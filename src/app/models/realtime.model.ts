import { TaskStatus } from "./task.model";

export interface StatusChangePayload {
    taskId: number;
    newStatus: TaskStatus;
}

export interface TaskMovedPayload {
    taskId: number;
    fromProjectId: number;
    toProjectId: number;
    toIndex: number;
}

export interface UserMovedPayload {
    userId: number;
    fromProjectId: number;
    toProjectId: number;
}