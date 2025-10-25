import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboard } from '@/routes';
import { task } from '@/routes/create';
import { board, project } from '@/routes/show';
import { type BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { CreateTaskDialog } from '../tasks/create';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Props {
    projects: Project;
}

export default function ProjectLayout({
    projects,
    children,
}: PropsWithChildren<Props>) {
    const page = usePage();
    const currentUrl = page.url;

    const tabs = [
        {
            label: 'List',
            href: project.url(projects.id),
        },
        {
            label: 'Board',
            href: board.url(projects.id),
        },
        {
            label: 'Calendar',
            href: `/projects/${projects.id}/calendar`,
        },
        {
            label: 'Settings',
            href: `/projects/${projects.id}/settings`,
        },
    ];

    const activeTab =
        tabs.find((tab) => currentUrl.startsWith(tab.href))?.label ??
        tabs[0].label;

    return (
        <div className="flex h-[calc(100vh-64px)] flex-col space-y-6 overflow-hidden p-6">
            {/* Header Section */}
            <div className="flex flex-shrink-0 items-center justify-between gap-2 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {projects.name}
                    </h1>
                    <p className="max-w-3xl text-sm text-muted-foreground">
                        {projects.description || 'No description provided.'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge
                            style={{
                                backgroundColor: projects.status?.color,
                            }}
                        >
                            {projects.status?.name}
                        </Badge>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Priority
                        </p>
                        <Badge
                            style={{
                                backgroundColor: projects.priority?.color,
                            }}
                        >
                            {projects.priority?.name}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Tabs + Create Button */}
            <div className="flex flex-shrink-0 justify-between gap-4">
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
                <CreateTaskDialog projectId={projects.id} />
                <Button onClick={() => router.get(task.url(projects.id))}>
                    Create task
                </Button>
            </div>

            {/* Main Content (Scrollable Area) */}
            <div className="flex-1 overflow-auto rounded-md bg-transparent">
                {children}
            </div>
        </div>
    );
}
