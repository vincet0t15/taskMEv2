import CustomDatePicker from '@/components/custom-date-picker';
import CustomSelectWithColor from '@/components/custom-select-with-color';
import InputError from '@/components/input-error';
import MultiSelectUser from '@/components/multi-select-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { task as createTask } from '@/routes/create';
import { project } from '@/routes/show';
import { task } from '@/routes/store';
import { User, type BreadcrumbItem } from '@/types';
import { Priority } from '@/types/priority';
import { Project } from '@/types/project';
import { Status } from '@/types/status';
import { TaskForm } from '@/types/task';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { ChangeEventHandler } from 'react';
import { toast } from 'sonner';

interface CreateTaskProps {
    project: Project;
}
export default function CreateTask({ project: proj }: CreateTaskProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: proj.name,
            href: project.url(proj.id),
        },
        {
            title: 'Create Task',
            href: createTask.url({ project: proj.id }),
        },
    ];

    const { systemPriorities, systemStatuses } = usePage().props;
    const { systemUsers } = usePage<{ systemUsers: User[] }>().props;
    const { data, setData, processing, reset, post, errors } =
        useForm<TaskForm>({
            title: '',
            description: '',
            due_date: '',
            priority_id: (systemPriorities as Priority[])[0]?.id || 0,
            status_id: (systemStatuses as Status[])[0]?.id || 0,
            project_id: proj.id,
            assignees: [] as number[],
            subTasks: [],
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

    const handleSubTaskChange = (index: number, field: string, value: any) => {
        const updatedSubTasks = [...(data.subTasks ?? [])];
        updatedSubTasks[index] = { ...updatedSubTasks[index], [field]: value };
        setData('subTasks', updatedSubTasks);
    };

    const addSubTask = () => {
        setData('subTasks', [
            ...(data.subTasks ?? []), // ✅ if undefined, use []
            {
                title: '',
                description: '',
                priority_id: (systemPriorities as Priority[])[0]?.id || 0,
                status_id: (systemStatuses as Status[])[0]?.id || 0,
                due_date: '',
                assignees: [],
            },
        ]);
    };

    const removeSubTask = (index: number) => {
        const updatedSubTasks = (data.subTasks ?? []).filter(
            (_, i) => i !== index,
        );
        setData('subTasks', updatedSubTasks);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(task.url(), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Task" />

            <form
                onSubmit={handleSubmit}
                className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"
            >
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
                            value={data.title}
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Write a short task description..."
                            value={data.description}
                            onChange={handleInputChange}
                            rows={3}
                        />
                        <InputError message={errors.description} />
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

                <div className="grid gap-2">
                    <Label htmlFor="assignees">Assignees</Label>
                    <MultiSelectUser
                        users={systemUsers}
                        selectedUsers={systemUsers.filter((user) =>
                            data.assignees.includes(user.id),
                        )}
                        onUsersChange={(selectedUsers) =>
                            setData(
                                'assignees',
                                selectedUsers.map((user) => user.id),
                            )
                        }
                        placeholder="Select assignees"
                    />
                </div>

                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Subtasks</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addSubTask}
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Subtask
                        </Button>
                    </div>
                    {data.subTasks?.map((subTask, index) => (
                        <div
                            key={index}
                            className="relative space-y-4 rounded-lg border p-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                    Subtask {index + 1}
                                </h3>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeSubTask(index)}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`subTitle-${index}`}>
                                    Subtask Name
                                </Label>
                                <Input
                                    id={`subTitle-${index}`}
                                    placeholder="Enter subtask name"
                                    value={subTask.title}
                                    onChange={(e) =>
                                        handleSubTaskChange(
                                            index,
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`subDescription-${index}`}>
                                    Description
                                </Label>
                                <Textarea
                                    id={`subDescription-${index}`}
                                    placeholder="Write a short subtask description..."
                                    rows={2}
                                    value={subTask.description}
                                    onChange={(e) =>
                                        handleSubTaskChange(
                                            index,
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2 md:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor={`subDueDate-${index}`}>
                                        Deadline
                                    </Label>
                                    <CustomDatePicker
                                        initialDate={subTask.due_date}
                                        onSelect={(date) =>
                                            handleSubTaskChange(
                                                index,
                                                'due_date',
                                                date,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor={`subPriority-${index}`}>
                                        Priority
                                    </Label>
                                    <CustomSelectWithColor
                                        widthClass="w-full"
                                        options={priorityOptions}
                                        onChange={(value) =>
                                            handleSubTaskChange(
                                                index,
                                                'priority_id',
                                                Number(value),
                                            )
                                        }
                                        value={String(subTask.priority_id)}
                                        placeholder="Select priority"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor={`subStatus-${index}`}>
                                        Status
                                    </Label>
                                    <CustomSelectWithColor
                                        widthClass="w-full"
                                        options={statusOptions}
                                        onChange={(value) =>
                                            handleSubTaskChange(
                                                index,
                                                'status_id',
                                                Number(value),
                                            )
                                        }
                                        value={String(subTask.status_id)}
                                        placeholder="Select status"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`subAssignees-${index}`}>
                                    Assignees
                                </Label>
                                <MultiSelectUser
                                    users={systemUsers}
                                    selectedUsers={systemUsers.filter((user) =>
                                        subTask.assignees.includes(user.id),
                                    )}
                                    onUsersChange={(selectedUsers) =>
                                        handleSubTaskChange(
                                            index,
                                            'assignees',
                                            selectedUsers.map(
                                                (user) => user.id,
                                            ),
                                        )
                                    }
                                    placeholder="Select assignees"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <Button type="submit" disabled={processing}>
                    Create Task
                </Button>
            </form>
        </AppLayout>
    );
}
