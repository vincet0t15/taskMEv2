import CustomDatePicker from '@/components/custom-date-picker';
import CustomSelectWithColor from '@/components/custom-select-with-color';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { task } from '@/routes/create';
import { User, type BreadcrumbItem } from '@/types';
import { Priority } from '@/types/priority';
import { Project } from '@/types/project';
import { Status } from '@/types/status';
import { TaskForm } from '@/types/task';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ChangeEventHandler } from 'react';
import { CreateSubTaskDialog } from './createSubTask';

interface CreateTaskProps {
    project: Project;
}
export default function CreateTask({ project }: CreateTaskProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: project.name,
            href: '',
        },
        {
            title: 'Create Task',
            href: task.url({ project: project.id }),
        },
    ];

    const { systemPriorities, systemStatuses } = usePage().props;
    const { systemUsers } = usePage<{ systemUsers: User[] }>().props;
    const { data, setData, processing, reset, post, errors } =
        useForm<TaskForm>({
            title: '',
            description: '',
            due_date: '',
            priority_id: 0,
            status_id: 0,
            project_id: 1,
            assignees: [] as number[],
            subTasks: [
                {
                    title: '',
                    description: '',
                    priority_id: 0,
                    status_id: 0,
                    due_date: '',
                    assignees: [],
                },
            ],
        });

    const priorityOptions = (systemPriorities as Priority[]).map(
        (priority) => ({
            value: String(priority.id),
            label: priority.name,
            color: priority.color,
        }),
    );

    const statusOptions = (systemStatuses as Status[]).map((status) => ({
        value: String(status.id),
        label: status.name,
        color: status.color,
    }));

    const onChangeDueDate = (date: string) => setData('due_date', date);
    const handleSelectPriorityChange = (value: string) =>
        setData('priority_id', Number(value));
    const handleSelectStatusChange = (value: string) =>
        setData('status_id', Number(value));

    const handleInputChange: ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add form submit logic
        console.log('Form submitted');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Task" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Create Task
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Fill out the form below to create a new task.
                    </p>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Task Name</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter task name"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Write a short task description..."
                            rows={3}
                        />
                    </div>
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor="due_date">Deadline</Label>
                        <CustomDatePicker
                            initialDate={data.due_date}
                            onSelect={onChangeDueDate}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <CustomSelectWithColor
                            widthClass="w-full"
                            options={priorityOptions}
                            onChange={handleSelectPriorityChange}
                            value={String(data.priority_id)}
                            placeholder="Select priority"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <CustomSelectWithColor
                            widthClass="w-full"
                            options={statusOptions}
                            onChange={handleSelectStatusChange}
                            value={String(data.status_id)}
                            placeholder="Select status"
                        />
                    </div>
                </div>
                <CreateSubTaskDialog />
            </div>
        </AppLayout>
    );
}
