'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useInitials } from '@/hooks/use-initials';
import { comments } from '@/routes/update';
import { CommentInterface } from '@/types/commet';
import { router } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';
import { KeyboardEventHandler, useState } from 'react';
import { toast } from 'sonner';
import DeleteCommentDialog from './deleteComment';

interface CommentItemProps {
    comment: CommentInterface;
}

export default function CommentItem({ comment }: CommentItemProps) {
    const getInitials = useInitials();
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.comment);

    const handleSave: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            router.put(
                comments.url(comment.id),
                { comment: editedComment },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Comment updated');
                        setIsEditing(false);
                    },
                    onError: () => toast.error('Failed to update comment'),
                },
            );
        }
    };

    return (
        <div className="flex flex-col rounded-lg border p-3 hover:bg-gray-50">
            <div className="flex justify-between">
                <div className="flex flex-1 items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-xs font-medium text-blue-600">
                            {getInitials(comment.user.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800">
                                {comment.user.name}
                            </span>
                        </div>

                        {isEditing ? (
                            <Input
                                type="text"
                                value={editedComment}
                                onChange={(e) =>
                                    setEditedComment(e.target.value)
                                }
                                onKeyDown={handleSave}
                                autoFocus
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        ) : (
                            <p className="mt-1 text-sm break-words text-gray-600">
                                {comment.comment}
                            </p>
                        )}
                    </div>

                    {!isEditing && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                                {new Date(comment.date_created).toLocaleString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                    },
                                )}
                            </span>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <MoreHorizontal className="cursor-pointer rounded-full p-1 hover:bg-white hover:shadow" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-44"
                                    align="end"
                                >
                                    <DropdownMenuItem
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <DeleteCommentDialog
                                            comment={comment}
                                        />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
