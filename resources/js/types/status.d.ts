import { Task } from './task';

export interface Status {
    id: number;
    name: string;
    color: string;
    tasks: Task[];
}
export type StatusCreateInput = Omit<Status, 'id'>;
