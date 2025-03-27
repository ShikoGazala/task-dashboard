import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../models/project.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { TaskListComponent } from '../task-list/task-list.component';
import { TeamMemberListComponent } from '../team-member-list/team-member-list.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-project-card',
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatIconModule, TaskListComponent, DragDropModule, TeamMemberListComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
  @Input() connectedProjectIds!: string[];
  @Input() connectedUserListIds: string[] = [];

  @Output() taskMoved = new EventEmitter<{
    task: Task;
    fromProjectId: number;
    toProjectId: number;
    toIndex: number;
  }>();

  @Output() userMoved = new EventEmitter<{
    user: User;
    fromProjectId: number;
    toProjectId: number;
  }>();
  constructor() { }

  onTaskDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer !== event.container) {
      const task = event.item.data;
      const fromProjectId = +event.previousContainer.id;
      const toProjectId = +event.container.id;
      const toIndex = event.currentIndex;

      task.projectId = toProjectId;
      this.taskMoved.emit({ task, fromProjectId, toProjectId, toIndex });
    }
  }

  onUserDrop(event: CdkDragDrop<any>): void {
    if (event.previousContainer !== event.container) {
      const user = event.item.data as User;
      const fromProjectId = +event.previousContainer.id.replace('-users', '');
      const toProjectId = +event.container.id.replace('-users', '');

      this.userMoved.emit({ user, fromProjectId, toProjectId });
    }
  }

}