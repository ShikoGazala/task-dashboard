import { Task } from "./task.model";
import { User } from "./user.model";

export interface Project {
    id: number;
    name: string;
    deadline: string;
    completionPercentage: number;
    recentTasks: Task[];
    teamMembers: User[];
  }