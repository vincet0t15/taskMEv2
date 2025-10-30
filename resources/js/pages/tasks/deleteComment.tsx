'use client';

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
import { comments } from '@/routes/destroy';
import { CommentInterface } from '@/types/commet';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface Props {
    comment: CommentInterface;
}

export default function DeleteCommentDialog({ comment }: Props) {
    const deleteData = () => {
        router.delete(comments.url(comment.id), {
            preserveScroll: true,
            onSuccess: (response: any) => {
                toast.success(
                    response.props.flash?.success ||
                        'Comment deleted successfully',
                );
            },
            onError: () => toast.error('Failed to delete comment'),
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <span className="w-full cursor-pointer text-left">Delete</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your comment.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-sm"
                        >
                            Cancel
                        </Button>
                    </AlertDialogTrigger>
                    <Button
                        onClick={deleteData}
                        size="sm"
                        className="rounded-sm bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
