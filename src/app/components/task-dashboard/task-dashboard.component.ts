import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent,
    FilterBarComponent
  ],
  templateUrl: './task-dashboard.component.html',
  styleUrl: './task-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDashboardComponent {
  private readonly destroy$ = new Subject<void>();
  projects$: Observable<Project[]>;
  filteredProjects$ = new BehaviorSubject<Project[]>([]);

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {
    this.taskService.projects$
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => this.cdr.markForCheck());

    this.projects$ = this.taskService.projects$;

    this.projects$
    .pipe(takeUntil(this.destroy$))
    .subscribe(projects => {
      this.filteredProjects$.next(projects);
    });
  }
  getConnectedIds(currentId: number): string[] {
    return (this.filteredProjects$.value || [])
      .filter(p => p.id !== currentId)
      .map(p => p.id.toString());
  }
  onFilterChange(filterData: { status?: string, priority?: string, assignee?: any }): void {
    this.projects$
      .pipe(
        takeUntil(this.destroy$),
        map(projects => projects.map(project => ({
          ...project,
          recentTasks: project.recentTasks.filter(task => {
            const matchStatus = !filterData.status || task.status === filterData.status;
            const matchPriority = !filterData.priority || task.priority === filterData.priority;
            const matchAssignee = !filterData.assignee || task.assignee === filterData.assignee;
            return matchStatus && matchPriority && matchAssignee;
          })
        })))
      )
      .subscribe(filteredProjects => {
        this.filteredProjects$.next(filteredProjects);
      });
  }

  onTaskMoved(event: {
    task: Task;
    fromProjectId: number;
    toProjectId: number;
    toIndex: number;
  }) {

    this.taskService.moveTask(
      event.task.id,
      event.fromProjectId,
      event.toProjectId,
      event.toIndex
    );
  }

  onUserMoved(event: {

    user: User;
    fromProjectId: number;
    toProjectId: number;
  }) {
    this.taskService.moveUserToProject(event.user.id, event.fromProjectId, event.toProjectId);
  }

  getConnectedUserIds(currentId: number): string[] {
    return (this.filteredProjects$.value || [])
      .filter(p => p.id !== currentId)
      .map(p => p.id.toString() + '-users');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}