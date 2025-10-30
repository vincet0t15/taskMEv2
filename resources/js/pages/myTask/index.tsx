import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import myTask from '@/routes/myTask';
import { BreadcrumbItem } from '@/types';
import { Status } from '@/types/status';
import { Head } from '@inertiajs/react';
import CollapsibleTaskTable from '../projects/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'My Tasks',
        href: myTask.index.url(),
    },
];

interface MyTasksListProps {
    tasks: Status[];
}

export default function MyTasksList({ tasks }: MyTasksListProps) {
    console.log(tasks);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <CollapsibleTaskTable statusWithTasks={tasks} />
            </div>
        </AppLayout>
    );
}
