import { User } from '.';
import { Priority } from './priority';
import { Status } from './status';

export type SubTaskForm = {
    title: string;
    description: string;
    priority_id: number;
    status_id: number;
    due_date: string;
    assignees: number[];
    task_id?: number;
};

export interface SubTaskInterface {
    id: number;
    title: string;
    description?: string;
    status_id: number;
    priority_id: number;
    due_date: string;
    assignees: User[];
    task_id: number;
    status: Status;
    priority: Priority;
}
