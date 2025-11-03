import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboard } from '@/routes';
import { task } from '@/routes/create';
import { board, calendar, project } from '@/routes/show';
import { type BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { Link, router, usePage } from '@inertiajs/react';
import { ArchiveIcon, PlusIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';
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
            href: calendar.url(projects.id),
        },
    ];

    const activeTab =
        tabs.find((tab) => currentUrl.startsWith(tab.href))?.label ??
        tabs[0].label;

    return (
        <div className="flex h-[calc(100vh-64px)] flex-col space-y-6 overflow-hidden p-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {projects.name}
                    </h1>
                    <p className="max-w-3xl text-sm text-muted-foreground">
                        {projects.description || 'No description provided.'}
                    </p>
                </div>

                <div className="flex items-center gap-2 md:justify-end">
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

                    {projects.status?.name !== 'Archived' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (
                                    confirm(
                                        'Are you sure you want to archive this project?',
                                    )
                                ) {
                                    router.put(
                                        `/projects/${projects.id}`,
                                        {
                                            status_id: 5, // Archived status ID
                                        },
                                        {
                                            onSuccess: () => {
                                                router.visit('/dashboard');
                                            },
                                        },
                                    );
                                }
                            }}
                            className="text-orange-600 hover:text-orange-700"
                        >
                            <ArchiveIcon className="mr-1 h-4 w-4" />
                            Archive
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs + Create Button */}
            <div className="flex flex-shrink-0 flex-col gap-4 md:flex-row md:justify-between">
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
                <div className="flex gap-2 md:justify-end">
                    {/* <CreateTaskDialog projectId={projects.id} /> */}
                    <Button
                        variant={'outline'}
                        onClick={() => router.get(task.url(projects.id))}
                        className="cursor-pointer"
                    >
                        <PlusIcon />
                        Create task
                    </Button>
                </div>
            </div>

            {/* Main Content (Scrollable Area) */}
            <div className="flex-1 overflow-auto rounded-md bg-transparent">
                {children}
            </div>
        </div>
    );
}
