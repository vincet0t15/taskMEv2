import { move } from '@/routes/calendar';
import { tasks } from '@/routes/view';
import { Task } from '@/types/task';
import { EventDropArg } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import TaskDetailDialog from '../tasks/viewTask';
interface Props {
    task: Task[];
}
export default function CalendarData({ task }: Props) {
    const [openViewTask, setOpenViewTask] = useState(false);
    const [taskDetails, setTaskDetails] = useState<Task>();
    const events = (task as Task[]).map((task) => ({
        id: String(task.id),
        title: task.title ?? '',
        color: String(task.status.color) ?? '',
        start: task.due_date ?? '',
        end: task.due_date ?? '',
    }));

    function handleEventDrop(info: EventDropArg) {
        const start = info.event.start
            ? info.event.start.toLocaleDateString('en-CA')
            : null;

        if (!start) {
            console.warn('Invalid event start date');
            info.revert();
            return;
        }

        router.put(
            move.url(Number(info.event.id)),
            { due_date: start },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (response: { props: FlashProps }) => {
                    toast.success(
                        response.props.flash?.success ||
                            'Task date updated successfully',
                    );
                },
                onError: (error) => {
                    console.error('Failed to update task date:', error);
                    info.revert();
                },
            },
        );
    }
    function handleEventClick(data: any) {
        const matchedTask = task.find(
            (task) => task.id === Number(data.event.id),
        );

        if (!matchedTask) return;

        router.get(
            tasks.url({
                project: Number(matchedTask.project_id),
                task: Number(matchedTask.id),
            }),
        );
    }

    return (
        <div className="rounded-md bg-sidebar p-4">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                editable={true}
                selectable={true} // Allow dates to be selectable.
                selectMirror={true}
                eventDrop={handleEventDrop}
                expandRows={true}
                dayMaxEvents={true}
                eventClick={handleEventClick}
            />
            {openViewTask && taskDetails && (
                <TaskDetailDialog
                    tasks={taskDetails}
                    open={openViewTask}
                    setOpen={setOpenViewTask}
                    onDataNeededRefresh={() =>
                        router.reload({ only: ['tasks'] })
                    }
                />
            )}
        </div>
    );
}
