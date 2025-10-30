import { User } from '.';
import { CommentInterface } from './commet';
import { Priority } from './priority';
import { Status } from './status';
import { SubTaskForm, SubTaskInterface } from './subTask';
import { TaskAttachment } from './taskAttachment';

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
    sub_tasks: SubTaskInterface[];
    completed_subtasks_count?: number;
    total_subtasks_count?: number;
    attachments: TaskAttachment[];
    comments: CommentInterface[]
}

export type TaskForm = {
    title: string;
    description: string;
    priority_id: number;
    status_id: number;
    project_id: number;
    due_date: string;
    assignees: number[];
    subTasks?: SubTaskForm[];
    attachment?:File[]
    deleted_attachments?:number[]
};
