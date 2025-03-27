import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { RealtimeService } from '../../services/realtime.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StatusColorPipe } from '../../pipes/status-color.pipe';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, MatChipsModule, DragDropModule, StatusColorPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
 
  readonly TaskStatus = TaskStatus;

  constructor(private realtime: RealtimeService) { }

  markAsCompleted(task: Task): void {
    task.status = TaskStatus.Completed;
    console.log('[BroadcastChannel] sending update for task', task.id);
    this.realtime.broadcastStatusChange({ taskId: task.id, newStatus: TaskStatus.Completed }
    );
  }

}