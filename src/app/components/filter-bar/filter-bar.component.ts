import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/project.model';
import { TaskService } from '../../services/task.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-filter-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBarComponent {
  @Output() filterChange = new EventEmitter<{ status?: string, priority?: string, assignee?: number }>();

  statuses: string[] = [];
  priorities: string[] = [];
  assignees: number[] = [];

  selectedStatus: string | undefined;
  selectedPriority: string | undefined;
  selectedAssignee: number | undefined;
  private readonly destroy$ = new Subject<void>();

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.taskService.projects$
    .pipe(takeUntil(this.destroy$))
    .subscribe(projects => {
      if (projects?.length)
        this.updateFilters(projects);
    });
  }

  updateFilters(projects: Project[]): void {
    const allStatuses = new Set<string>();
    const allPriorities = new Set<string>();
    const allAssignees = new Set<number>();


    projects.forEach(project => {
      project.recentTasks.forEach(task => {
        allStatuses.add(task.status);
        allPriorities.add(task.priority);
        allAssignees.add(task.assignee);
      });
    });


    this.statuses = [...allStatuses];
    this.priorities = [...allPriorities];
    this.assignees = [...allAssignees];
    this.cdr.markForCheck();
  }

  onFilterChange(): void {
    this.filterChange.emit({
      status: this.selectedStatus,
      priority: this.selectedPriority,
      assignee: this.selectedAssignee
    });
  }

  clearFilter(type: 'status' | 'priority' | 'assignee'): void {
    if (type === 'status') {
      this.selectedStatus = undefined;
    } else if (type === 'priority') {
      this.selectedPriority = undefined;
    } else if (type === 'assignee') {
      this.selectedAssignee = undefined;
    }
    this.onFilterChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
