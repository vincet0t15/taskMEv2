import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { Lock, LogIn } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
            <Head title="Log in" />

            <div className="w-full max-w-md rounded-2xl border border-indigo-100 bg-white/80 p-8 shadow-xl backdrop-blur-lg md:p-10">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-sm">
                        <LogIn className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome Back 👋
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Sign in to continue managing your tasks
                    </p>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                {/* Username Field */}
                                <div className="grid gap-2">
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
                                        autoFocus
                                        tabIndex={1}
                                        placeholder="Enter your username"
                                        className="rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
                                    />
                                    <InputError message={errors.username} />
                                </div>

                                {/* Password Field */}
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-xs text-indigo-600 hover:text-indigo-800"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className="rounded-xl border-slate-200 pl-10 focus:border-indigo-400 focus:ring-indigo-400"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center space-x-3">
                                    <Checkbox id="remember" name="remember" />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm text-slate-600"
                                    >
                                        Remember me
                                    </Label>
                                </div>

                                {/* Login Button */}
                                <Button
                                    type="submit"
                                    className="mt-4 h-11 w-full rounded-xl bg-indigo-600 text-base font-medium text-white shadow-md transition-all hover:bg-indigo-700"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing ? <Spinner /> : 'Log In'}
                                </Button>
                            </div>

                            {/* Register Link */}
                            {canRegister && (
                                <div className="mt-6 text-center text-sm text-slate-500">
                                    Don’t have an account?{' '}
                                    <TextLink
                                        href={register()}
                                        tabIndex={5}
                                        className="font-medium text-indigo-600 hover:text-indigo-800"
                                    >
                                        Sign up
                                    </TextLink>
                                </div>
                            )}
                        </>
                    )}
                </Form>

                {/* Status Message */}
                {status && (
                    <div className="mt-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}
