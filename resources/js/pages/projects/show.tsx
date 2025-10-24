import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { project } from '@/routes/show';
import { type BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { Head } from '@inertiajs/react';
import ProjectLayout from './project-layout';
import CollapsibleTaskTable from './table';

interface Props {
    projects: Project;
}

export default function Dashboard({ projects }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Projects',
            href: '#',
        },
        {
            title: projects.name,
            href: project.url(projects.id),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <ProjectLayout project={projects}>
                <CollapsibleTaskTable />
            </ProjectLayout>
        </AppLayout>
    );
}
