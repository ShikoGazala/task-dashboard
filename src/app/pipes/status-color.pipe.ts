import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../models/task.model';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(status: TaskStatus): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case TaskStatus.Completed:
        return 'primary';
      case TaskStatus.InProgress:
        return 'accent';
      case TaskStatus.Pending:
        return 'warn';
      default:
        return 'primary';
    }
  }
}