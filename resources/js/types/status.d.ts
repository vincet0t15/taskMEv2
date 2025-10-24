export interface Status {
    id: number;
    name: string;
    color: string;
}
export type StatusCreateInput = Omit<Status, 'id'>;
