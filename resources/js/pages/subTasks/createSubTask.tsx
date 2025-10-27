import CustomDatePicker from '@/components/custom-date-picker';
import CustomSelectWithColor from '@/components/custom-select-with-color';
import InputError from '@/components/input-error';
import MultiSelectUser from '@/components/multi-select-user';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types';
import { Priority } from '@/types/priority';
import { Status } from '@/types/status';
import { SubTaskForm } from '@/types/subTask';
import { Task } from '@/types/task';
import { useForm, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { ChangeEventHandler, FormEventHandler } from 'react';
interface CreateSubTaskDialogProps {
    task: Task;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export function CreateSubTaskDialog({
    task,
    open,
    onOpenChange,
}: CreateSubTaskDialogProps) {
    const { systemPriorities, systemStatuses } = usePage().props;
    const { systemUsers } = usePage<{ systemUsers: User[] }>().props;

    const { data, setData, processing, reset, post, errors } =
        useForm<SubTaskForm>({
            title: '',
            description: '',
            due_date: '',
            priority_id: 0,
            status_id: 0,
            assignees: [] as number[],
            task_id: task.id,
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

    const handleSubmmit: FormEventHandler = (e) => {
        e.preventDefault();
        // post(task.url(), {
        //     onSuccess: (response: { props: FlashProps }) => {
        //         toast.success(response.props.flash?.success);
        //         reset();
        //     },
        // });
    };

    const handleSelectUserChange = (selectedUsers: User[]) => {
        setData(
            'assignees',
            selectedUsers.map((user) => user.id),
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex cursor-pointer items-center gap-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    Add Subtask
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Subtask</DialogTitle>
                    <DialogDescription>
                        Fill out the details below to add a new subtask to your
                        project.
                    </DialogDescription>
                </DialogHeader>

                <form className="mt-4 space-y-6" onSubmit={handleSubmmit}>
                    {/* Task Info */}
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Task Name</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter subtask name"
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
                                rows={3}
                                value={data.description}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Dates, Priority, Status */}
                    <div className="grid gap-2 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="due_date">Deadline</Label>
                            <CustomDatePicker
                                initialDate={data.due_date}
                                onSelect={onChangeDueDate}
                            />
                            <InputError message={errors.due_date} />
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
                            <InputError message={errors.priority_id} />
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
                            <InputError message={errors.status_id} />
                        </div>
                    </div>

                    {/* Assignee */}
                    <div className="grid gap-2">
                        <Label htmlFor="assignee">Assignee</Label>
                        <MultiSelectUser
                            users={task.assignees}
                            selectedUsers={task.assignees.filter((user) =>
                                data.assignees.includes(user.id),
                            )}
                            onUsersChange={handleSelectUserChange}
                            placeholder="Select assignees"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer">
                            Create Subtask
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
