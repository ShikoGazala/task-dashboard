import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project.model';
import { RealtimeService } from './realtime.service';
import { TaskStatus } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly destroy$ = new Subject<void>();
  private readonly projectsSubject = new BehaviorSubject<Project[]>([]);
  public readonly projects$ = this.projectsSubject.asObservable();

  constructor(private http: HttpClient, private realtime: RealtimeService) {
    this.loadProjects();
    this.handleRealtimeUpdates();
  }

  private loadProjects(): void {
    this.http.get<Project[]>('/assets/data/projects.json').subscribe({
      next: data => this.projectsSubject.next(data),
      error: () => this.projectsSubject.next([]),
    });
  }

  private handleRealtimeUpdates(): void {
    this.realtime.taskUpdates$
    .pipe(takeUntil(this.destroy$))
    .subscribe(update => {
      const projects = this.projectsSubject.getValue().map(project => ({
        ...project,
        recentTasks: project.recentTasks.map(task =>
          task.id === update.taskId
            ? { ...task, status: update.newStatus as TaskStatus }
            : task
        )
      }));
      this.projectsSubject.next(projects);
    });

    this.realtime.taskMoved$
    .pipe(takeUntil(this.destroy$))
    .subscribe(move => {
      this._moveTaskInternal(move.taskId, move.fromProjectId, move.toProjectId, move.toIndex, false);
      requestAnimationFrame(() => {
        const projects = [...this.projectsSubject.getValue()];
        this.projectsSubject.next(projects);
      });
    });

    this.realtime.userMoved$
    .pipe(takeUntil(this.destroy$))
    .subscribe(move => {
      this._moveUserInternal(move.userId, move.fromProjectId, move.toProjectId, false);
      requestAnimationFrame(() => {
        const projects = [...this.projectsSubject.getValue()];
        this.projectsSubject.next(projects);
      });
    });
  }

  public moveTask(taskId: number, fromProjectId: number, toProjectId: number, toIndex: number): void {
    this._moveTaskInternal(taskId, fromProjectId, toProjectId, toIndex, true);
  }

  public moveUserToProject(userId: number, fromProjectId: number, toProjectId: number): void {
    this._moveUserInternal(userId, fromProjectId, toProjectId, true);
  }

  private _moveTaskInternal(
    taskId: number,
    fromProjectId: number,
    toProjectId: number,
    toIndex: number,
    broadcast: boolean
  ): void {
    const projects = [...this.projectsSubject.getValue()];
    const fromIdx = projects.findIndex(p => p.id === fromProjectId);
    const toIdx = projects.findIndex(p => p.id === toProjectId);
    if (fromIdx === -1 || toIdx === -1) return;

    const fromProject = { ...projects[fromIdx], recentTasks: [...projects[fromIdx].recentTasks] };
    const toProject = { ...projects[toIdx], recentTasks: [...projects[toIdx].recentTasks] };

    const taskIndex = fromProject.recentTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const [task] = fromProject.recentTasks.splice(taskIndex, 1);
    task.projectId = toProjectId;
    toProject.recentTasks.splice(toIndex, 0, task);

    projects[fromIdx] = fromProject;
    projects[toIdx] = toProject;
    this.projectsSubject.next(projects);

    if (broadcast) {
      this.realtime.broadcastTaskMoved({ taskId, fromProjectId, toProjectId, toIndex });
    }
  }

  private _moveUserInternal(
    userId: number,
    fromProjectId: number,
    toProjectId: number,
    broadcast: boolean
  ): void {
    const projects = [...this.projectsSubject.getValue()];
    const fromIdx = projects.findIndex(p => p.id === fromProjectId);
    const toIdx = projects.findIndex(p => p.id === toProjectId);
    if (fromIdx === -1 || toIdx === -1) return;

    const fromProject = { ...projects[fromIdx], teamMembers: [...projects[fromIdx].teamMembers] };
    const toProject = { ...projects[toIdx], teamMembers: [...projects[toIdx].teamMembers] };

    const userIndex = fromProject.teamMembers.findIndex(u => u.id === userId);
    if (userIndex === -1) return;

    const [user] = fromProject.teamMembers.splice(userIndex, 1);
    toProject.teamMembers.push(user);

    projects[fromIdx] = fromProject;
    projects[toIdx] = toProject;
    this.projectsSubject.next(projects);

    if (broadcast) {
      this.realtime.broadcastUserMoved({ userId, fromProjectId, toProjectId });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}