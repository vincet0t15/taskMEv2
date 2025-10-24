export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
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
