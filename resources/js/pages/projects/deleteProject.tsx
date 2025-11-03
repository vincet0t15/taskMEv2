import ProjectController from '@/actions/App/Http/Controllers/ProjectController';
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
import { Project } from '@/types/project';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    projects: Project;
}

export default function DeleteProjectDialog({ projects }: Props) {
    const [open, setOpen] = useState(false);
    const archiveProject = () => {
        router.delete(ProjectController.destroy(projects.id), {
            onSuccess: () => {
                toast.success('Project deleted successfully.');
                router.visit('/dashboard');
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 />
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
                        onClick={() => setOpen(false)}
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
