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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { subtask } from '@/routes/update';
import { User } from '@/types';
import { Priority } from '@/types/priority';
import { Status } from '@/types/status';
import { SubTaskForm, SubTaskInterface } from '@/types/subTask';
import { Task } from '@/types/task';
import { useForm, usePage } from '@inertiajs/react';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import DeleteSubTaskDialog from './delete';

interface subTaskDetails {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subTask: SubTaskInterface;
    task?: Task;
    onSubTaskUpdated?: () => void;
    onSubTaskDeleted?: () => void;
}

export function SubTaskDialog({
    open,
    onOpenChange,
    subTask,
    onSubTaskUpdated,
    onSubTaskDeleted,
    task,
}: subTaskDetails) {
    console.log(task);
    const { systemPriorities, systemStatuses } = usePage().props;
    const { systemUsers } = usePage<{ systemUsers: User[] }>().props;
    const [openDelete, setOpenDelete] = useState(false);

    const { data, setData, processing, reset, put, errors } =
        useForm<SubTaskForm>({
            title: subTask.title ?? '',
            description: subTask.description ?? '',
            due_date: subTask.due_date ?? '',
            priority_id: subTask.priority_id ?? 0,
            status_id: subTask.status_id ?? 0,
            assignees: subTask.assignees.map((user) => user.id),
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
        put(subtask.url(subTask.id), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                onSubTaskUpdated?.();
                onOpenChange(false);
            },
        });
    };

    const handleSelectUserChange = (selectedUsers: User[]) => {
        setData(
            'assignees',
            selectedUsers.map((user) => user.id),
        );
    };

    return (
        <>
            {!openDelete && (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle> SubTask Details</DialogTitle>
                            <DialogDescription>
                                Fill out the details below to add a new task to
                                your project.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            className="mt-4 space-y-6"
                            onSubmit={handleSubmmit}
                        >
                            {/* Task Info */}
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
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
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
                                    users={task?.assignees || []}
                                    selectedUsers={systemUsers.filter((user) =>
                                        (data?.assignees || []).includes(
                                            user.id,
                                        ),
                                    )} // returns Use
                                    onUsersChange={handleSelectUserChange}
                                    placeholder="Select assignees"
                                />
                            </div>

                            <DialogFooter className="pt-4">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                {/* <Button
                                    type="button"
                                    variant="destructive"
                                    className="cursor-pointer"
                                    onClick={() => setOpenDelete(true)}
                                >
                                    Delete
                                </Button> */}

                                <Button
                                    type="submit"
                                    className="cursor-pointer"
                                >
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {openDelete && subTask && (
                <DeleteSubTaskDialog
                    open={openDelete}
                    setOpen={setOpenDelete}
                    subTask={subTask}
                    onSubTaskDeleted={() => {
                        onSubTaskDeleted?.();
                        onOpenChange(false);
                    }}
                />
            )}
        </>
    );
}
