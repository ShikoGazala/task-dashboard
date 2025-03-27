import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeamMember } from '../../models/team-member.model';
import { LazyLoadDirective } from '../../directives/lazy.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-team-member-list',
  imports: [CommonModule, MatTooltipModule,LazyLoadDirective, DragDropModule ],
  templateUrl: './team-member-list.component.html',
  styleUrl: './team-member-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMemberListComponent {
  @Input() members: TeamMember[] = [];

}
