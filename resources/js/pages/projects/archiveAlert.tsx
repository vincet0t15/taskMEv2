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
import { ArchiveIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    projects: Project;
}

export default function ArchiveProjectDialog({ projects }: Props) {
    const [open, setOpen] = useState(false);
    const archiveProject = () => {
        router.put(
            project.url(projects.id),
            {
                status_id: 5,
            },
            {
                onSuccess: () => {
                    toast.success('Project archived successfully.');
                    router.visit('/dashboard');
                },
            },
        );
    };
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="cursor-pointer text-orange-800 hover:text-orange-600"
                >
                    <ArchiveIcon />
                    Archive
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Archive this project?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will move
                        <strong className="text-orange-400 uppercase">
                            {projects.name}
                        </strong>{' '}
                        to the archived list. You can restore it later from the
                        project management page.
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
