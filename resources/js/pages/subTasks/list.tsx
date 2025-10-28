'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SubTaskInterface } from '@/types/subTask';
import { Task } from '@/types/task';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    PlusCircle,
    Users,
    Workflow,
} from 'lucide-react';
import { useState } from 'react';
import { CreateSubTaskDialog } from './createSubTask';
import { SubTaskDialog } from './subTaskDialog';

interface SubTaskDrawerProps {
    subTasks?: SubTaskInterface[];
    task?: Task;
    onSubTaskUpdated?: () => void;
}

export function SubTaskDrawer({
    subTasks = [],
    task,
    onSubTaskUpdated,
}: SubTaskDrawerProps) {
    const [open, setOpen] = useState(false);
    const [subTaskDetails, setSubTaskDetails] =
        useState<SubTaskInterface | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const handleSubTaskClick = (subTask: SubTaskInterface) => {
        setSubTaskDetails(subTask);
        setOpen(true);
    };

    return (
        <div>
            <Drawer direction="right">
                <DrawerTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-1 transition hover:text-primary">
                        <Workflow className="h-4 w-4" />
                        <span className="text-xs">
                            {subTasks.length} Subtask
                            {subTasks.length !== 1 && 's'}
                        </span>
                    </div>
                </DrawerTrigger>

                <DrawerContent className="ml-auto max-w-md border-l bg-background shadow-lg">
                    <DrawerHeader className="flex border-b">
                        <div>
                            <DrawerTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Workflow className="h-5 w-5 text-primary" />
                                Subtasks
                            </DrawerTitle>
                            <DrawerDescription>
                                Review or manage subtasks for this task.
                            </DrawerDescription>
                        </div>
                    </DrawerHeader>

                    <ScrollArea className="h-[89vh] px-2 py-2">
                        {subTasks.length > 0 ? (
                            <div className="space-y-3">
                                {subTasks.map((sub, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer rounded-sm border bg-card p-2 shadow-sm transition hover:shadow-md"
                                        onClick={() => handleSubTaskClick(sub)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold">
                                                    {sub.title ||
                                                        'Untitled Subtask'}
                                                </h3>
                                                {sub.description && (
                                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                        {sub.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                {sub.priority && (
                                                    <Badge
                                                        style={{
                                                            backgroundColor:
                                                                sub.priority
                                                                    .color,
                                                        }}
                                                    >
                                                        {sub.priority.name}
                                                    </Badge>
                                                )}
                                                {sub.status && (
                                                    <Badge
                                                        style={{
                                                            backgroundColor:
                                                                sub.status
                                                                    .color,
                                                        }}
                                                    >
                                                        {sub.status.name}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            {sub.due_date && (
                                                <div className="flex items-center gap-1">
                                                    <span>
                                                        {(() => {
                                                            const dueDate =
                                                                sub?.due_date;
                                                            const isOverdue =
                                                                dueDate &&
                                                                new Date(
                                                                    dueDate,
                                                                ) < new Date();

                                                            if (dueDate) {
                                                                return (
                                                                    <div
                                                                        className={`flex items-center gap-1 text-xs ${
                                                                            isOverdue
                                                                                ? 'text-red-400'
                                                                                : 'text-gray-400'
                                                                        }`}
                                                                        title={
                                                                            isOverdue
                                                                                ? 'Overdue'
                                                                                : 'Due Date'
                                                                        }
                                                                    >
                                                                        {isOverdue ? (
                                                                            <AlertTriangle className="h-3 w-3" />
                                                                        ) : (
                                                                            <Clock className="h-3 w-3" />
                                                                        )}
                                                                        {new Date(
                                                                            dueDate,
                                                                        ).toLocaleDateString(
                                                                            'en-US',
                                                                            {
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                                year: '2-digit',
                                                                            },
                                                                        )}
                                                                    </div>
                                                                );
                                                            }

                                                            return (
                                                                <span className="text-gray-500">
                                                                    —
                                                                </span>
                                                            );
                                                        })()}
                                                    </span>
                                                </div>
                                            )}
                                            {sub.assignees &&
                                                sub.assignees.length > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-3 w-3" />
                                                        <div className="flex -space-x-2">
                                                            {sub.assignees.map(
                                                                (a, i) => (
                                                                    <Avatar
                                                                        key={i}
                                                                        className="h-6 w-6 border border-background bg-green-400"
                                                                    >
                                                                        <AvatarFallback className="bg-green-300">
                                                                            {a.name
                                                                                ? a.name
                                                                                      .charAt(
                                                                                          0,
                                                                                      )
                                                                                      .toUpperCase()
                                                                                : '?'}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center space-y-4 py-10 text-muted-foreground">
                                <CheckCircle className="mb-2 h-8 w-8" />
                                <p>No subtasks available.</p>
                                <Button
                                    onClick={() => setCreateDialogOpen(true)}
                                    className="flex items-center gap-1"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Add Subtask
                                </Button>
                            </div>
                        )}
                    </ScrollArea>
                </DrawerContent>
            </Drawer>

            {open && (
                <SubTaskDialog
                    open={open}
                    onOpenChange={setOpen}
                    subTask={subTaskDetails!}
                    onSubTaskUpdated={onSubTaskUpdated}
                    onSubTaskDeleted={onSubTaskUpdated}
                />
            )}

            {createDialogOpen && (
                <CreateSubTaskDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    task={task!}
                />
            )}
        </div>
    );
}
