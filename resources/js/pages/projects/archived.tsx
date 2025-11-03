import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { Head, router } from '@inertiajs/react';
import { ArchiveRestoreIcon, ArrowLeftIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Archived Projects',
        href: '/projects/archived',
    },
];

interface ArchivedProjectsProps {
    archivedProjects: Project[];
}

export default function ArchivedProjects({
    archivedProjects,
}: ArchivedProjectsProps) {
    const handleUnarchive = (projectId: number) => {
        if (confirm('Are you sure you want to restore this project?')) {
            router.put(
                `/projects/${projectId}`,
                {
                    status_id: 1, // Set to "To Do" status (active)
                },
                {
                    onSuccess: () => {
                        // Optionally refresh the page or update the list
                        window.location.reload();
                    },
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archived Projects" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Archived Projects
                        </h1>
                        <p className="text-muted-foreground">
                            View and restore your archived projects
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </div>

                {/* Projects Grid */}
                {archivedProjects.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {archivedProjects.map((project) => (
                            <Card key={project.id} className="relative">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="truncate text-lg">
                                                {project.name}
                                            </CardTitle>
                                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                {project.description ||
                                                    'No description provided.'}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="secondary"
                                                style={{
                                                    backgroundColor:
                                                        project.priority?.color,
                                                }}
                                            >
                                                {project.priority?.name}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                style={{
                                                    borderColor:
                                                        project.status?.color,
                                                    color: project.status
                                                        ?.color,
                                                }}
                                            >
                                                {project.status?.name}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                                        <span>
                                            Created{' '}
                                            {new Date(
                                                project.created_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <Button
                                        onClick={() =>
                                            handleUnarchive(project.id)
                                        }
                                        className="flex w-full items-center gap-2"
                                        variant="default"
                                    >
                                        <ArchiveRestoreIcon className="h-4 w-4" />
                                        Restore Project
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ArchiveRestoreIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">
                            No archived projects
                        </h3>
                        <p className="mb-4 text-muted-foreground">
                            You haven't archived any projects yet.
                        </p>
                        <Button onClick={() => router.visit('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
