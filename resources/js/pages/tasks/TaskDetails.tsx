'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import {
    project as projectRoute,
    task,
    task as taskRoute,
} from '@/routes/show';
import { type BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { Task } from '@/types/task';
import { Head, router, useForm, usePage } from '@inertiajs/react';

import comment from '@/routes/comment';
import { CommentTypes } from '@/types/commet';
import {
    Calendar,
    CheckCircle2,
    Circle,
    DownloadIcon,
    File,
    Plus,
} from 'lucide-react';
import { KeyboardEventHandler, useState } from 'react';
import { CreateSubTaskDialog } from '../subTasks/createSubTask';
interface TaskDetailsProps {
    tasks: Task;
    project: Project;
}
interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
        } | null;
    };
}
export default function TaskDetails({
    tasks,
    project: proj,
}: TaskDetailsProps) {
    console.log(tasks);
    const getInitials = useInitials();
    const [addSubTaskDialog, setAddSubTaskDialog] = useState(false);
    const isOverdue = tasks.due_date && new Date(tasks.due_date) < new Date();
    const { auth } = usePage<any>().props;

    const { data, setData, post } = useForm<CommentTypes>({
        comment: '',
        task_id: tasks.id,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: proj.name, href: projectRoute.url(proj.id) },
        {
            title: tasks.title,
            href: taskRoute.url({ project: proj.id, task: tasks.id }),
        },
    ];

    // Sample Activity Logs
    const sampleActivity = [
        {
            id: 1,
            action: 'created the task',
            user: 'John Doe',
            timestamp: '2025-10-28T10:15:00Z',
        },
        {
            id: 2,
            action: 'updated task status to "In Progress"',
            user: 'Jane Smith',
            timestamp: '2025-10-28T13:45:00Z',
        },
        {
            id: 3,
            action: 'added 2 new subtasks',
            user: 'John Doe',
            timestamp: '2025-10-29T08:05:00Z',
        },
    ];

    const handleKeyEnter: KeyboardEventHandler = (e) => {
        if (e.key === 'Enter') {
            post(comment.task.url());
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={tasks.title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Top Section */}
                <div className="flex flex-col gap-6 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left: Title + Status */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold text-gray-800 uppercase">
                            {tasks.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge
                                variant="secondary"
                                style={{
                                    backgroundColor: `${tasks.status.color}33`,
                                }}
                            >
                                {tasks.status.name}
                            </Badge>
                            <Badge
                                className="rounded-full"
                                variant="outline"
                                style={{
                                    backgroundColor: `${tasks.priority.color}33`,
                                }}
                            >
                                {tasks.priority.name}
                            </Badge>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-500">
                                    Due Date
                                </span>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span
                                        className={`${
                                            isOverdue
                                                ? 'text-red-500'
                                                : 'text-gray-800'
                                        }`}
                                    >
                                        {new Date(
                                            tasks.due_date,
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Due date */}
                    <div className="flex flex-col items-start gap-3 sm:items-end">
                        <Button
                            variant="outline"
                            className=" "
                            onClick={() =>
                                router.get(
                                    task.url({
                                        project: tasks.project_id,
                                        task: tasks.id,
                                    }),
                                )
                            }
                        >
                            Edit Task
                        </Button>
                    </div>
                </div>

                {/* Assignees */}
                <div className="flex flex-col gap-3 border-b pb-6">
                    <span className="text-sm font-medium text-gray-500">
                        Assignees
                    </span>
                    <div className="flex items-center gap-3">
                        {tasks.assignees.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-xs font-medium text-blue-600">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-gray-800">
                                    {user.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                {tasks.description && (
                    <div className="border-b pb-6">
                        <span className="block text-sm font-medium text-gray-500">
                            Description
                        </span>
                        <p className="mt-2 rounded-lg border bg-gray-50 p-3 text-sm text-gray-700">
                            {tasks.description}
                        </p>
                    </div>
                )}

                {/* Attachments */}

                {tasks.attachments.length > 0 && (
                    <div className="mb-6">
                        <span className="text-sm font-medium text-gray-500">
                            Attachments
                        </span>
                        <div className="mt-2 flex gap-2">
                            {tasks.attachments.map((attachment, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50"
                                >
                                    {/* File Info */}
                                    <div className="flex items-center gap-3">
                                        <File className="h-5 w-5 text-orange-500" />
                                        <div className="text-xs">
                                            <p className="font-medium text-gray-800">
                                                {attachment.original_name}
                                            </p>
                                            <span className="text-gray-400">
                                                {attachment.file_size}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Download Button */}

                                    <a
                                        href={attachment.path} // ✅ Adjust this key based on your backend response
                                        download={attachment.original_name}
                                        className="text-green-40 ml-2 text-xs font-medium text-green-400 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <DownloadIcon className="h-5 w-5" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <Tabs defaultValue="subtasks" className="w-full">
                    <TabsList className="mb-4 flex w-fit gap-2 rounded-lg bg-gray-100 p-1">
                        <TabsTrigger
                            value="subtasks"
                            className="rounded-md px-3 py-1 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow"
                        >
                            Sub Tasks ({tasks.total_subtasks_count})
                        </TabsTrigger>
                        <TabsTrigger
                            value="comments"
                            className="rounded-md px-3 py-1 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow"
                        >
                            Comments
                        </TabsTrigger>
                        <TabsTrigger
                            value="activity"
                            className="rounded-md px-3 py-1 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow"
                        >
                            Activity
                        </TabsTrigger>
                    </TabsList>

                    {/* Subtasks Tab */}
                    <TabsContent value="subtasks">
                        <Card className="rounded-xl border border-gray-200 shadow-sm">
                            <CardContent className="space-y-4 p-4">
                                {/* Progress */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>
                                        Sub Tasks (
                                        {tasks.completed_subtasks_count}/
                                        {tasks.total_subtasks_count})
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        tasks.total_subtasks_count
                                            ? ((tasks.completed_subtasks_count ??
                                                  0) /
                                                  tasks.total_subtasks_count) *
                                              100
                                            : 0
                                    }
                                    className="mb-3 [&>div]:bg-blue-500"
                                />

                                {/* Subtask List */}
                                <div className="mt-4 space-y-2">
                                    {tasks.sub_tasks.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="flex items-center justify-between rounded-lg border p-3 transition hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                {sub.status_id === 4 ? (
                                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-gray-400" />
                                                )}
                                                <span
                                                    className={`text-sm ${
                                                        sub.status_id === 4
                                                            ? 'text-gray-400 line-through'
                                                            : 'text-gray-800'
                                                    }`}
                                                >
                                                    {sub.title}
                                                </span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                style={{
                                                    color: sub.status.color,
                                                    borderColor:
                                                        sub.status.color,
                                                }}
                                            >
                                                {sub.status.name}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>

                                {/* Add new subtask */}
                                <Button
                                    onClick={() => setAddSubTaskDialog(true)}
                                    variant="ghost"
                                    className="mt-3 w-fit text-sm text-blue-600 hover:bg-blue-50"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add new Subtask
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Comments & Activity Placeholder */}
                    <TabsContent value="comments">
                        <div className="space-y-4">
                            {/* Existing comments */}
                            {tasks.comments.length > 0 ? (
                                tasks.comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="flex flex-col rounded-lg border p-3 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-blue-100 text-xs font-medium text-blue-600">
                                                        {getInitials(
                                                            comment.user.name,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-gray-500">
                                                    {comment.comment}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(
                                                    comment.date_created,
                                                ).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                })}
                                            </span>
                                        </div>
                                        {/* <p className="mt-2 text-sm text-gray-700">
                                            {comment.comment}
                                        </p> */}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No comments yet.
                                </p>
                            )}

                            {/* Add new comment form */}
                            <div className="mt-6 border-t pt-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-blue-100 text-xs font-medium text-blue-600">
                                            {getInitials(auth.user?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <input
                                        value={data.comment}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                comment: e.target.value,
                                            })
                                        }
                                        type="text"
                                        name="comment"
                                        placeholder="Write a comment..."
                                        className="flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                        onKeyDown={handleKeyEnter}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="activity">
                        {sampleActivity.length > 0 ? (
                            <ul className="space-y-3">
                                {sampleActivity.map((activity) => (
                                    <li
                                        key={activity.id}
                                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                            <span className="text-sm text-gray-700">
                                                <strong>{activity.user}</strong>{' '}
                                                {activity.action}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(
                                                activity.timestamp,
                                            ).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No recent activity.
                            </p>
                        )}
                    </TabsContent>
                </Tabs>
                {addSubTaskDialog && tasks && (
                    <CreateSubTaskDialog
                        open={addSubTaskDialog}
                        onOpenChange={setAddSubTaskDialog}
                        task={tasks}
                    />
                )}
            </div>
        </AppLayout>
    );
}
