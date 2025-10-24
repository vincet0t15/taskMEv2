import CustomSelectWithColor from '@/components/custom-select-with-color';
import InputError from '@/components/input-error';
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
import { Textarea } from '@/components/ui/textarea';
import { project } from '@/routes/store';
import { Priority } from '@/types/priority';
import { ProjectCreateInput } from '@/types/project';
import { Status } from '@/types/status';
import { useForm, usePage } from '@inertiajs/react';
import { Loader2Icon, Plus } from 'lucide-react';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

export function CreateProject() {
    const { systemStatuses } = usePage().props;
    const { systemPriorities } = usePage().props;
    const { data, setData, processing, errors, reset, post } =
        useForm<ProjectCreateInput>({
            name: '',
            description: '',
            priority_id: 0,
            status_id: 0,
        });

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

    const handleSelectPriorityChange = (value: string) => {
        setData('priority_id', Number(value));
    };

    const handleSelectStatusChange = (value: string) => {
        setData('status_id', Number(value));
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(project.url(), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
            },
        });
    };

    const handleInputChange: ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Plus className="h-4 w-4 cursor-pointer" />
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create project</DialogTitle>
                    <DialogDescription>
                        Give your project a clear, concise name. You can change
                        it later in settings.
                    </DialogDescription>
                </DialogHeader>
                <form className="contents" onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="project-name">Project name</Label>
                            <Input
                                name="name"
                                placeholder="e.g. Marketing Website Redesign"
                                required
                                autoFocus
                                onChange={handleInputChange}
                                value={data.name}
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="project-description">
                                Description
                            </Label>
                            <Textarea
                                className="max-h-[200px] min-h-[80px] resize-y overflow-auto"
                                name="description"
                                placeholder="e.g. Marketing Website Redesign"
                                required
                                autoFocus
                                onChange={handleInputChange}
                                value={data.description}
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="mt-4 mb-2 flex flex-col gap-2 md:flex-row">
                            <div className="grid flex-1 gap-3">
                                <Label>Priority</Label>
                                <CustomSelectWithColor
                                    options={prioritiesOption}
                                    widthClass="w-full"
                                    label="Priority"
                                    onChange={handleSelectPriorityChange}
                                    value={String(data.priority_id)}
                                    placeholder="Select types"
                                />
                                <InputError message={errors.priority_id} />
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
                                <InputError message={errors.status_id} />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                            )}
                            {processing ? 'Creating' : 'Create project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
