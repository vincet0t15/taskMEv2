import { User } from '.';
import { Priority } from './priority';
import { Status } from './status';

export interface Task {
    id: number;
    title: string;
    description?: string;
    status_id: number;
    priority_id: number;
    project_id: number;
    status: Status;
    priority: Priority;
    due_date: string;
    assignees: User[];
}

export type TaskForm = {
    title: string;
    description: string;
    priority_id: number;
    status_id: number;
    project_id: number;
    due_date: string;
    assignees: number[];
};
