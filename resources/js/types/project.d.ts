import { Priority } from './priority';
import { Status } from './status';
import { Task } from './task';

export interface Project {
    id: number;
    name: string;
    description?: string;
    priority_id: number;
    status_id: number;
    status?: Status;
    priority?: Priority;
    tasks?: Task[];
}

export type ProjectCreateInput = {
    name: string;
    description?: string;
    priority_id: number;
    status_id: number;
};
