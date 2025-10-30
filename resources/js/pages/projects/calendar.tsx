import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { project } from '@/routes/show';
import { type BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { Task } from '@/types/task';
import { Head } from '@inertiajs/react';
import CalendarData from './calendarData';
import ProjectLayout from './project-layout';

interface Props {
    projects: Project;

    task: Task[];
}

export default function TaskBoard({ projects, task }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: projects.name,
            href: project.url(projects.id),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <ProjectLayout projects={projects}>
                <CalendarData task={task} />
            </ProjectLayout>
        </AppLayout>
    );
}
