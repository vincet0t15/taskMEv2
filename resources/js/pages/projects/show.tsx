import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { project } from '@/routes/show';
import { type BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { Status } from '@/types/status';
import { Head } from '@inertiajs/react';
import ProjectLayout from './project-layout';
import CollapsibleTaskTable from './table';

interface Props {
    projects: Project;
    statusWithTasks: Status[];
}

export default function TaskList({ projects, statusWithTasks }: Props) {
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
                <CollapsibleTaskTable statusWithTasks={statusWithTasks} />
                {/* <TaskDetailModal /> */}
            </ProjectLayout>
        </AppLayout>
    );
}
