export interface Task {
    id: number;
    name: string;
    status: TaskStatus;
    priority: PriorityEnum;
    assignee: number;
    projectId: number
  }
  
  export enum TaskStatus {
    Pending = 'pending',
    InProgress = 'in-progress',
    Completed = 'completed'
  }

  export enum PriorityEnum {
    High = 'high',
    Medium = 'medium',
    Low = 'low'
  }