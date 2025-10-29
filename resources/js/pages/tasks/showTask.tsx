import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { Head, router } from '@inertiajs/react';

interface Props {
    project: Project;
}
export default function ShowTask({ project }: Props) {
    const handleGoBack = (e: React.MouseEvent) => {
        console.log(1);
        e.preventDefault();
        router.visit(document.referrer);
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: project.name,
            href: '#',
            onClick: () => window.history.back(),
        },
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"></div>
        </AppLayout>
    );
}
