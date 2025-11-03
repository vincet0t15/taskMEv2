import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import myTask from '@/routes/myTask';
import { Status } from '@/types/status';
import { Task } from '@/types/task';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';

interface Props {
    tasks: Task;
}

export function StatusDropDown({ tasks }: Props) {
    const { systemStatuses } = usePage<{ systemStatuses: Status[] }>().props;

    const onChangeStatus = (status: Status) => {
        router.put(
            myTask.update.url({ task: tasks, status: status }),
            {},
            {
                onSuccess: (response: { props: FlashProps }) => {
                    toast.success(response.props.flash?.success);
                },
                onError: (errors) => {
                    // only fires for validation errors (422)
                    Object.values(errors).forEach((message) => {
                        toast.error(String(message));
                    });
                },
            },
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    style={{
                        backgroundColor: `${tasks.status.color}33`,
                        color: tasks.status.color,
                    }}
                >
                    {tasks.status.name}
                </Badge>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="start">
                {systemStatuses.map((status) => (
                    <DropdownMenuItem
                        key={status.id}
                        onSelect={() => onChangeStatus(status)}
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <Checkbox
                            style={{
                                backgroundColor:
                                    tasks.status_id === status.id
                                        ? status.color
                                        : 'transparent',
                                borderColor: status.color,
                            }}
                        />
                        <span style={{ color: status.color }}>
                            {status.name}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
