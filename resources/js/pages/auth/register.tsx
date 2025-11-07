import { login } from '@/routes';
import { Head, useForm, usePage } from '@inertiajs/react';

import CustomSelect from '@/components/custom-select';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/register';
import { OfficeInterface } from '@/types/office';
import { FormEventHandler } from 'react';

export default function Register() {
    const { systemOffices } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
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
        post(store.url());
    };

    const handleOfficeChange = (value: string) => {
        setData('office_id', Number(value));
    };

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <>
                    <div className="grid gap-6">
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                name="name"
                                placeholder="Full name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        {/* Username */}
                        <div className="grid gap-2">
                            <Label>Username</Label>
                            <Input
                                id="username"
                                type="text"
                                required
                                tabIndex={2}
                                name="username"
                                placeholder="Username"
                                value={data.username}
                                onChange={(e) =>
                                    setData('username', e.target.value)
                                }
                            />
                            <InputError message={errors.username} />
                        </div>

                        {/* Office */}
                        <div className="grid gap-2">
                            <Label>Office</Label>
                            <CustomSelect
                                id="office_id"
                                name="office_id"
                                placeholder="Select an office"
                                options={officeOptions}
                                value={
                                    data.office_id
                                        ? String(data.office_id)
                                        : undefined
                                }
                                onChange={handleOfficeChange}
                                widthClass="w-full truncate"
                            />
                            <InputError message={errors.office_id} />
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                name="password"
                                placeholder="Password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                name="password_confirmation"
                                placeholder="Confirm password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="mt-2 w-full"
                            tabIndex={5}
                            data-test="register-user-button"
                        >
                            {processing && <Spinner />}
                            Create account
                        </Button>
                    </div>

                    {/* Login link */}
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <TextLink href={login()} tabIndex={6}>
                            Log in
                        </TextLink>
                    </div>
                </>
            </form>
        </AuthLayout>
    );
}
