import CustomSelectWithColor from '@/components/custom-select-with-color';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { project } from '@/routes/show';
import { type BreadcrumbItem } from '@/types';
import { Priority } from '@/types/priority';
import { Project } from '@/types/project';
import { Status } from '@/types/status';
import { Head, useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import ArchiveProjectDialog from './archiveAlert';
import DeleteProjectDialog from './deleteProject';
import ProjectLayout from './project-layout';

interface Props {
    projects: Project;
}

export default function ProjectSettings({ projects }: Props) {
    const { systemStatuses } = usePage().props;
    const { systemPriorities } = usePage().props;
    const prioritiesOption = (systemPriorities as Priority[]).map(
        (priority) => ({
            value: String(priority.id),
            label: priority.name || '',
            color: priority.color || '#000000',
        }),
    );

    const statusesOptions = (systemStatuses as Status[]).map((status) => ({
        value: String(status.id),
        label: status.name || '',
        color: status.color || '#000000',
    }));

    const { data, setData, put, processing, errors } = useForm({
        name: projects.name || '',
        description: projects.description || '',
        priority_id: projects.priority?.id || 0,
        status_id: projects.status?.id || 0,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: projects.name,
            href: project.url(projects.id),
        },
        {
            title: 'Settings',
            href: '#',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/projects/${projects.id}`, {
            onSuccess: () => {
                toast.success('Project updated successfully');
            },
        });
    };
    const handleSelectPriorityChange = (value: string) => {
        setData('priority_id', Number(value));
    };

    const handleSelectStatusChange = (value: string) => {
        setData('status_id', Number(value));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${projects.name} - Settings`} />
            <ProjectLayout projects={projects}>
                <div className="space-y-6">
                    {/* Project Details Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                            <CardDescription>
                                Update your project information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Project Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Enter project name"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 mb-2 flex flex-col gap-2 md:flex-row">
                                    <div className="grid flex-1 gap-3">
                                        <Label>Priority</Label>
                                        <CustomSelectWithColor
                                            options={prioritiesOption}
                                            widthClass="w-full"
                                            label="Priority"
                                            onChange={
                                                handleSelectPriorityChange
                                            }
                                            value={String(data.priority_id)}
                                            placeholder="Select types"
                                        />
                                    </div>
                                    <div className="grid flex-1 gap-3">
                                        <Label>Status</Label>
                                        <CustomSelectWithColor
                                            widthClass="w-full"
                                            options={statusesOptions}
                                            label="Status"
                                            onChange={handleSelectStatusChange}
                                            value={String(data.status_id)}
                                            placeholder="Select types"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter project description"
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-600">
                                Danger Zone
                            </CardTitle>
                            <CardDescription>
                                Irreversible and destructive actions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Archive Project */}
                            {projects.status?.name !== 'Archived' && (
                                <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-4">
                                    <div>
                                        <h4 className="font-medium text-orange-900">
                                            Archive Project
                                        </h4>
                                        <p className="text-sm text-orange-700">
                                            Move this project to archive. You
                                            can restore it later.
                                        </p>
                                    </div>
                                    <ArchiveProjectDialog projects={projects} />
                                </div>
                            )}

                            {/* Delete Project */}
                            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                                <div>
                                    <h4 className="font-medium text-red-900">
                                        Delete Project
                                    </h4>
                                    <p className="text-sm text-red-700">
                                        Permanently delete this project and all
                                        its tasks. This action cannot be undone.
                                    </p>
                                </div>
                                <DeleteProjectDialog projects={projects} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ProjectLayout>
        </AppLayout>
    );
}
