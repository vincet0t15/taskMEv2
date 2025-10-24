export interface Priority {
    id: number;
    name: string;
    color: string;
}
export type PriorityCreateInput = Omit<Priority, 'id'>;
