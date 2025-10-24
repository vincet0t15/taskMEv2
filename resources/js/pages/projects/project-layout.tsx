import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { CreateTaskDialog } from '../tasks/create';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Props {
    project: Project;
}

export default function ProjectLayout({
    project,
    children,
}: PropsWithChildren<Props>) {
    const page = usePage();
    const currentUrl = page.url;
    const { url } = usePage();
    const current = url.split('/').pop();
    const tabs = [
        {
            label: 'List',
            href: `/projects/${project.id}/list`,
        },
        {
            label: 'Board',
            href: `/projects/${project.id}/tasks`,
        },
        {
            label: 'Calendar',
            href: `/projects/${project.id}/calendar`,
        },
        {
            label: 'Settings',
            href: `/projects/${project.id}/settings`,
        },
    ];
    const activeTab =
        tabs.find((tab) => currentUrl.startsWith(tab.href))?.label ||
        tabs[0].label;
    return (
        <div className="space-y-6 p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between gap-2 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {project.name}
                    </h1>
                    <p className="max-w-3xl text-sm text-muted-foreground">
                        {project.description || 'No description provided.'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge
                            style={{
                                backgroundColor: project.status?.color,
                            }}
                            className=""
                        >
                            {project.status?.name}
                        </Badge>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Priority
                        </p>
                        <Badge
                            style={{
                                backgroundColor: project.priority?.color,
                            }}
                        >
                            {project.priority?.name}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="flex justify-between gap-4">
                <Tabs value={activeTab}>
                    <TabsList>
                        {tabs.map((tab) => {
                            const isActive = currentUrl.startsWith(tab.href);
                            return (
                                <TabsTrigger
                                    key={tab.href}
                                    value={tab.label}
                                    asChild
                                >
                                    <Link href={tab.href} className="w-20">
                                        {tab.label}
                                    </Link>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>
                <div>
                    <CreateTaskDialog projectId={project.id} />
                </div>
            </div>

            <div className="mt-4 rounded-md bg-transparent">{children}</div>
        </div>
    );
}
