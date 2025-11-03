import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { Task } from '@/types/task';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    task: Task;
    project: Project;
}

export default function DeleteTaskDialog({ task, project }: Props) {
    const [open, setOpen] = useState(false);

    const deleteTask = () => {
        router.delete(`/tasks/${task.id}`, {
            onSuccess: () => {
                toast.success('Task deleted successfully.');
                router.visit(`/projects/${project.id}`);
            },
            onError: () => {
                toast.error('Failed to delete task.');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Task
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete{' '}
                        <strong className="text-red-500 uppercase">
                            {task.title}
                        </strong>{' '}
                        and all associated data, including its subtasks,
                        comments, attachments, and activity logs. This action
                        <span className="font-semibold"> cannot be undone</span>
                        .
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer rounded-sm"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={deleteTask}
                        size="sm"
                        className="cursor-pointer rounded-sm"
                    >
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
