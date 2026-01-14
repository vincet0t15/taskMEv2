import CustomDatePicker from '@/components/custom-date-picker';
import CustomSelectWithColor from '@/components/custom-select-with-color';
import FileInput from '@/components/file-input';
import InputError from '@/components/input-error';
import MultiSelectUser from '@/components/multi-select-user';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { ChangeEventHandler, useState } from 'react';
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

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSubTaskIndex, setEditingSubTaskIndex] = useState<
        number | null
    >(null);
    const [subTaskForm, setSubTaskForm] = useState({
        title: '',
        description: '',
        priority_id: (systemPriorities as Priority[])[0]?.id || 0,
        status_id: (systemStatuses as Status[])[0]?.id || 0,
        due_date: '',
        assignees: [] as number[],
    });
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
            attachment: [],
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

    const openSubTaskDialog = () => {
        setEditingSubTaskIndex(null);
        setSubTaskForm({
            title: '',
            description: '',
            priority_id: (systemPriorities as Priority[])[0]?.id || 0,
            status_id: (systemStatuses as Status[])[0]?.id || 0,
            due_date: '',
            assignees: [],
        });
        setIsDialogOpen(true);
    };

    const editSubTask = (index: number) => {
        const subTask = data.subTasks?.[index];
        if (subTask) {
            setEditingSubTaskIndex(index);
            setSubTaskForm({ ...subTask });
            setIsDialogOpen(true);
        }
    };

    const handleSubTaskFormChange = (field: string, value: any) => {
        setSubTaskForm((prev) => ({ ...prev, [field]: value }));
    };

    const saveSubTask = () => {
        if (editingSubTaskIndex !== null) {
            // Update existing subtask
            const updatedSubTasks = [...(data.subTasks ?? [])];
            updatedSubTasks[editingSubTaskIndex] = subTaskForm;
            setData('subTasks', updatedSubTasks);
            setEditingSubTaskIndex(null);
        } else {
            // Create new subtask
            setData('subTasks', [...(data.subTasks ?? []), subTaskForm]);
            setSubTaskForm({
                title: '',
                description: '',
                priority_id: (systemPriorities as Priority[])[0]?.id || 0,
                status_id: (systemStatuses as Status[])[0]?.id || 0,
                due_date: '',
                assignees: [],
            });
        }
        // Keep dialog open for creating another subtask (only for new subtasks)
        if (editingSubTaskIndex !== null) {
            setIsDialogOpen(false);
        }
    };

    const saveSubTaskAndClose = () => {
        saveSubTask();
        setIsDialogOpen(false);
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

                <div className="grid gap-2">
                    <Label>Attachments</Label>
                    <FileInput
                        value={data.attachment as File[]}
                        onChange={(files) => setData('attachment', files)}
                    />
                    <InputError message={errors.attachment} />
                </div>

                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Subtasks</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={openSubTaskDialog}
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Subtask
                        </Button>
                    </div>
                    {data.subTasks?.length ? (
                        <div className="space-y-2">
                            {data.subTasks.map((subTask, index) => (
                                <div
                                    key={index}
                                    className="flex cursor-pointer items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                                    onClick={() => editSubTask(index)}
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium">
                                            {subTask.title ||
                                                `Subtask ${index + 1}`}
                                        </h4>
                                        {subTask.description && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {subTask.description}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSubTask(index);
                                        }}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No subtasks added yet.
                        </p>
                    )}
                </div>

                <Button type="submit" disabled={processing}>
                    Create Task
                </Button>
            </form>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingSubTaskIndex !== null
                                ? 'Edit Subtask'
                                : 'Add Subtask'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSubTaskIndex !== null
                                ? 'Update the subtask details.'
                                : 'Create a new subtask for this task.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="subtask-title">Subtask Name</Label>
                            <Input
                                id="subtask-title"
                                placeholder="Enter subtask name"
                                value={subTaskForm.title}
                                onChange={(e) =>
                                    handleSubTaskFormChange(
                                        'title',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subtask-description">
                                Description
                            </Label>
                            <Textarea
                                id="subtask-description"
                                placeholder="Write a short subtask description..."
                                rows={2}
                                value={subTaskForm.description}
                                onChange={(e) =>
                                    handleSubTaskFormChange(
                                        'description',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-2 md:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="subtask-due-date">
                                    Deadline
                                </Label>
                                <CustomDatePicker
                                    initialDate={subTaskForm.due_date}
                                    onSelect={(date) =>
                                        handleSubTaskFormChange(
                                            'due_date',
                                            date,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="subtask-priority">
                                    Priority
                                </Label>
                                <CustomSelectWithColor
                                    widthClass="w-full"
                                    options={priorityOptions}
                                    onChange={(value) =>
                                        handleSubTaskFormChange(
                                            'priority_id',
                                            Number(value),
                                        )
                                    }
                                    value={String(subTaskForm.priority_id)}
                                    placeholder="Select priority"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="subtask-status">Status</Label>
                                <CustomSelectWithColor
                                    widthClass="w-full"
                                    options={statusOptions}
                                    onChange={(value) =>
                                        handleSubTaskFormChange(
                                            'status_id',
                                            Number(value),
                                        )
                                    }
                                    value={String(subTaskForm.status_id)}
                                    placeholder="Select status"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subtask-assignees">Assignees</Label>
                            <MultiSelectUser
                                users={systemUsers.filter((user) =>
                                    data.assignees.includes(user.id),
                                )}
                                selectedUsers={systemUsers.filter((user) =>
                                    subTaskForm.assignees.includes(user.id),
                                )}
                                onUsersChange={(selectedUsers) =>
                                    handleSubTaskFormChange(
                                        'assignees',
                                        selectedUsers.map((user) => user.id),
                                    )
                                }
                                placeholder="Select assignees"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        {editingSubTaskIndex !== null && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                    removeSubTask(editingSubTaskIndex);
                                    setIsDialogOpen(false);
                                }}
                            >
                                Delete Subtask
                            </Button>
                        )}

                        <Button type="button" onClick={saveSubTaskAndClose}>
                            {editingSubTaskIndex !== null
                                ? 'Update Subtask'
                                : 'Create Subtask'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
