import CustomSelect from '@/components/custom-select';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { OfficeInterface } from '@/types/office';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Lock, UserPlus } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

export default function Register() {
    const { systemOffices } = usePage().props;

    const { data, setData, post, errors, processing, reset } = useForm({
        name: '',
        username: '',
        office_id: 0,
        password: '',
        password_confirmation: '',
    });

    const officeOptions = (systemOffices as OfficeInterface[]).map(
        (office) => ({
            value: String(office.id),
            label: office.name,
        }),
    );

    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        post(store.url(), {
            onSuccess: () => {
                toast.success('User successfully created');
                reset();
            },
        });
    };

    const handleOfficeChange = (value: string) => {
        setData('office_id', Number(value));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-4">
            <Head title="Register" />
            <div className="w-full max-w-sm rounded-2xl border border-indigo-100 bg-white/90 p-6 shadow-xl backdrop-blur-lg sm:max-w-md sm:p-8">
                {/* Header Section */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-sm">
                        <UserPlus className="h-5 w-5" />
                    </div>
                    <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                        Create an Account ✨
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Enter your details below to get started
                    </p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    {/* Full Name */}
                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="name"
                            className="text-sm font-medium text-slate-700"
                        >
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            required
                            autoFocus
                            tabIndex={1}
                            placeholder="Enter your full name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Username */}
                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="username"
                            className="text-sm font-medium text-slate-700"
                        >
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            name="username"
                            required
                            tabIndex={2}
                            placeholder="Choose a username"
                            value={data.username}
                            onChange={(e) =>
                                setData('username', e.target.value)
                            }
                            className="rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
                        />
                        <InputError message={errors.username} />
                    </div>

                    {/* Office */}
                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="office_id"
                            className="text-sm font-medium text-slate-700"
                        >
                            Office
                        </Label>
                        <CustomSelect
                            tabIndex={3}
                            id="office_id"
                            name="office_id"
                            placeholder="Select your office"
                            options={officeOptions}
                            value={String(data.office_id)}
                            onChange={handleOfficeChange}
                            widthClass="w-full truncate rounded-xl"
                        />
                        <InputError message={errors.office_id} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="password"
                            className="text-sm font-medium text-slate-700"
                        >
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Confirm Password */}
                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="password_confirmation"
                            className="text-sm font-medium text-slate-700"
                        >
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                required
                                tabIndex={5}
                                autoComplete="new-password"
                                placeholder="Re-enter your password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                className="rounded-xl border-slate-200 pl-10 focus:border-indigo-400 focus:ring-indigo-400"
                            />
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="mt-3 h-11 w-full rounded-xl bg-indigo-600 text-sm font-medium text-white shadow-md transition-all hover:bg-indigo-700 sm:text-base"
                        tabIndex={6}
                        disabled={processing}
                        data-test="register-user-button"
                    >
                        {processing ? <Spinner /> : 'Create Account'}
                    </Button>

                    {/* Login link */}
                    <div className="mt-4 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <TextLink
                            href={login()}
                            tabIndex={7}
                            className="font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            Log in
                        </TextLink>
                    </div>
                </form>
            </div>
        </div>
    );
}
