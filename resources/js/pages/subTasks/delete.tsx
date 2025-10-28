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
import { subtask } from '@/routes/destroy';
import { SubTaskInterface } from '@/types/subTask';

import { router } from '@inertiajs/react';
import { toast } from 'sonner';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    subTask: SubTaskInterface;
    onSubTaskDeleted?: () => void;
}
export default function DeleteSubTaskDialog({
    open,
    setOpen,
    subTask,
    onSubTaskDeleted,
}: Props) {
    const deleteData = () => {
        router.delete(subtask.url(subTask.id), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                setOpen(false);
                onSubTaskDeleted?.();
            },
        });
    };
    return (
        <div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="cursor-pointer">
                        Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. It will permanently
                            delete the data you selected{' '}
                            <strong className="text-orange-400 uppercase">
                                {subTask.title}
                            </strong>{' '}
                            from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            size={'sm'}
                            variant={'outline'}
                            onClick={() => setOpen(false)}
                            className="cursor-pointer rounded-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={deleteData}
                            size={'sm'}
                            className="cursor-pointer rounded-sm"
                        >
                            Continue
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
