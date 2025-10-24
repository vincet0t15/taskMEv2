import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DialogDemo() {
    return (
        <Dialog>
            <form
                className="contents"
                onSubmit={(e) => {
                    // Let the parent handle submission; prevent default for now
                    // e.preventDefault();
                }}
            >
                <DialogTrigger asChild>
                    <Button variant="default">New Project</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Create project</DialogTitle>
                        <DialogDescription>
                            Give your project a clear, concise name. You can change it later in settings.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="project-name">Project name</Label>
                            <Input
                                id="project-name"
                                name="name"
                                placeholder="e.g. Marketing Website Redesign"
                                required
                                autoFocus
                                maxLength={80}
                            />
                            <p className="text-xs text-muted-foreground">
                                Max 80 characters. Use something team-friendly.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create project</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
