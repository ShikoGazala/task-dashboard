import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StatusChangePayload, TaskMovedPayload, UserMovedPayload } from '../models/realtime.model';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private readonly channel = new BroadcastChannel('task-updates');

  private readonly taskUpdatesSubject = new Subject<StatusChangePayload>();
  private readonly taskMovedSubject = new Subject<TaskMovedPayload>();
  private readonly userMovedSubject = new Subject<UserMovedPayload>();

  public readonly taskUpdates$ = this.taskUpdatesSubject.asObservable();
  public readonly taskMoved$ = this.taskMovedSubject.asObservable();
  public readonly userMoved$ = this.userMovedSubject.asObservable();

  constructor() {
    this.channel.onmessage = (event: MessageEvent) => {
      const data = event.data;
      switch (data.type) {
        case 'status-change':
          this.taskUpdatesSubject.next(data.payload);
          break;
        case 'task-moved':
          this.taskMovedSubject.next(data.payload);
          break;
        case 'user-moved':
          this.userMovedSubject.next(data.payload);
          break;
        default:
          console.warn('Unknown BroadcastChannel message type:', data.type);
      }
    };
  }

  public broadcastStatusChange(payload: StatusChangePayload): void {
    this.channel.postMessage({ type: 'status-change', payload });
  }

  public broadcastTaskMoved(payload: TaskMovedPayload): void {
    this.channel.postMessage({ type: 'task-moved', payload });
  }

  public broadcastUserMoved(payload: UserMovedPayload): void {
    this.channel.postMessage({ type: 'user-moved', payload });
  }
}
