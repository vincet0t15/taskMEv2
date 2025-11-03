import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { project } from '@/routes/update';
import { Project } from '@/types/project';
import { router } from '@inertiajs/react';
import { ArchiveRestore } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    projects: Project;
}

export default function RestoreProjectDialog({ projects }: Props) {
    const [open, setOpen] = useState(false);
    const archiveProject = () => {
        router.put(
            project.url(projects.id),
            {
                status_id: 1,
            },
            {
                onSuccess: () => {
                    toast.success('Project restore successfully.');
                },
            },
        );
    };
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    className="flex w-full items-center gap-2"
                    variant="default"
                >
                    <ArchiveRestore />
                    Restore Project
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Restore this project?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will move{' '}
                        <strong className="text-green-500 uppercase">
                            {projects.name}
                        </strong>{' '}
                        back to the active projects list. It will become visible
                        again in your project management dashboard.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer rounded-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={archiveProject}
                        size="sm"
                        className="cursor-pointer rounded-sm"
                    >
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
