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
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    subTask: SubTaskInterface;
}

export default function DeleteSubTaskDialog({ subTask }: Props) {
    const [open, setOpen] = useState(false);

    const deleteData = (e: React.MouseEvent) => {
        e.stopPropagation(); // ✅ Prevent triggering parent click
        router.delete(subtask.url(subTask.id), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                setOpen(false);
            },
        });
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation(); // ✅ Prevent parent dialog from opening
        setOpen(false);
    };

    return (
        <div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()} // ✅ Prevent parent click
                    >
                        <Trash2 className="text-orange-600" />
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent
                    onClick={(e) => e.stopPropagation()} // ✅ Extra guard
                >
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
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                            className="cursor-pointer rounded-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={deleteData}
                            size="sm"
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
