import AppLayout from '@/layouts/app-layout';
import calendar from '@/routes/calendar';
import { BreadcrumbItem } from '@/types';
import { Task } from '@/types/task';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { Head, router } from '@inertiajs/react';

interface Props {
    task: Task[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function CalendarData({ task }: Props) {
    const events = (task as Task[]).map((task) => ({
        id: String(task.id),
        title: task.title ?? '',
        start: task.due_date ?? '',
        end: task.due_date ?? '',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: 'inherit',
        extendedProps: {
            statusColor: task.status?.color ?? '#787c84ff',
        },
    }));

    function handleEventClick(data: any) {
        const matchedTask = task.find(
            (task) => task.id === Number(data.event.id),
        );

        if (!matchedTask) return;

        router.get(calendar.view.url(matchedTask.id));
    }

    function renderEventContent(eventInfo: any) {
        const color = eventInfo.event.extendedProps.statusColor || '#1e293b';
        const backgroundColor = hexToRgba(color, 0.15);
        const sideColor = hexToRgba(color, 0.6);

        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    width: '100%',
                    height: '100%',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    backgroundColor: backgroundColor,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: color,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
            >
                {/* Sidebar strip */}
                <div
                    style={{
                        width: '5px',
                        backgroundColor: sideColor,
                    }}
                ></div>

                {/* Event title */}
                <div
                    style={{
                        cursor: 'pointer',
                        padding: '4px 8px',
                        flex: 1,
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center', // center text vertically
                    }}
                >
                    {eventInfo.event.title}
                </div>
            </div>
        );
    }

    // Helper to convert hex color → rgba()
    function hexToRgba(hex: string, alpha: number) {
        let r = 0,
            g = 0,
            b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />
            <div className="rounded-md bg-sidebar p-4">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    expandRows={true}
                    dayMaxEvents={true}
                    eventClick={handleEventClick}
                    eventContent={renderEventContent}
                />
            </div>
        </AppLayout>
    );
}
