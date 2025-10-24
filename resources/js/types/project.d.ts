import { Priority } from './priority';
import { Status } from './status';

export interface Project {
    id: number;
    name: string;
    description?: string;
    priority_id: number;
    status_id: number;
    status?: Status;
    priority?: Priority;
}

export type ProjectCreateInput = Omit<Project, 'id'>;
