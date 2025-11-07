import { login, register } from '@/routes';
import { Link } from '@inertiajs/react';
import { CheckCircle, ListTodo, Users, Zap } from 'lucide-react';
import React from 'react';

// --- Main Component ---
export default function Welcome() {
    // NOTE: Keep state definition simple for a welcome page example
    const [auth] = React.useState({ user: null });
    const canRegister = true;

    return (
        // Reduced overall vertical padding from lg:p-12 to lg:p-8
        <div className="flex min-h-screen flex-col items-center bg-gray-50 p-4 text-slate-900 lg:justify-center lg:p-8">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50" />

            {/* Reduced max-width for the header to match the content slightly better */}
            <header className="mb-6 w-full max-w-6xl text-sm">
                <nav className="flex items-center justify-end gap-3">
                    {auth.user ? (
                        <a
                            href="#dashboard"
                            // Slightly smaller padding: px-4 py-1.5
                            className="inline-block rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:border-slate-400 hover:shadow-md"
                        >
                            Dashboard
                        </a>
                    ) : (
                        <>
                            <Link
                                href={login.url()}
                                // Slightly smaller padding/text size
                                className="inline-block rounded-lg px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register.url()}
                                    // Slightly smaller padding: px-5 py-2
                                    className="inline-block rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl"
                                >
                                    Get Started
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </header>

            <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow">
                {/* Reduced max-width for the main content */}
                <main className="flex w-full max-w-6xl flex-col lg:flex-row lg:gap-10">
                    {/* Left Content (Hero & Features) */}
                    <div className="flex-1 lg:py-12">
                        <div className="mb-8">
                            {/* Adjusted badge size */}
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100/70 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
                                <Zap className="h-3 w-3 fill-indigo-500 text-indigo-700" />
                                <span>Boost Your Productivity</span>
                            </div>
                            {/* Reduced headline size: 5xl -> 4xl, 7xl -> 6xl */}
                            <h1 className="mb-4 text-4xl leading-tight font-extrabold text-slate-900 lg:text-6xl">
                                Manage Tasks
                                <br />
                                <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                                    Like a Pro
                                </span>
                            </h1>
                            {/* Reduced subheading size: 2xl -> xl */}
                            <p className="mb-8 max-w-xl text-lg text-slate-600 lg:text-xl">
                                Organize, prioritize, and collaborate on tasks
                                with ease. Built for teams that move **fast**.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="mb-10 flex flex-wrap gap-3">
                            {canRegister && (
                                <Link
                                    href={register.url()}
                                    // Reduced padding: px-6 py-3
                                    className="inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-2xl"
                                >
                                    Start Managing Now
                                </Link>
                            )}
                        </div>

                        {/* Features List */}
                        {/* Reduced vertical gap */}
                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                            <FeatureItem
                                icon={
                                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                                }
                                title="Smart Task Organization"
                                description="Categorize and filter tasks with powerful organization tools"
                            />
                            <FeatureItem
                                icon={
                                    <ListTodo className="h-4 w-4 text-indigo-600" />
                                }
                                title="Real-time Collaboration"
                                description="Work together seamlessly with your team in real-time"
                            />
                            <FeatureItem
                                icon={
                                    <Users className="h-4 w-4 text-indigo-600" />
                                }
                                title="Team Management"
                                description="Assign tasks, track progress, and manage your team effectively"
                            />
                        </div>
                    </div>

                    {/* Right Visual (Mockup) */}
                    {/* Adjusted margins for the visual section */}
                    <div className="relative mt-8 max-w-3xl flex-1 lg:mt-0 lg:max-w-none">
                        {/* Reduced padding in mock-up: p-6 -> p-5, lg:p-8 -> lg:p-6 */}
                        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-slate-100/50 lg:p-6">
                            {/* Task Board Preview */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                    <h3 className="text-base font-bold text-slate-900">
                                        Today's Tasks
                                    </h3>
                                    {/* Reduced badge size: px-3 py-1 -> px-2 py-0.5 */}
                                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-200">
                                        8 tasks
                                    </span>
                                </div>

                                {/* Task Cards */}
                                <TaskCard
                                    title="Design new landing page"
                                    priority="high"
                                    status="in-progress"
                                    delay={0}
                                />
                                <TaskCard
                                    title="Review pull requests"
                                    priority="medium"
                                    status="pending"
                                    delay={100}
                                />
                                <TaskCard
                                    title="Update documentation"
                                    priority="low"
                                    status="completed"
                                    delay={200}
                                />
                                <TaskCard
                                    title="Team standup meeting"
                                    priority="high"
                                    status="pending"
                                    delay={300}
                                />
                            </div>

                            {/* Decorative Elements - Kept size, but adjusted blur to soften */}
                            <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-indigo-400/10 blur-2xl" />
                            <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-sky-400/10 blur-2xl" />
                        </div>
                    </div>
                </main>
            </div>
            {/* Reduced max-width and top margin */}
            <p className="mt-8 max-w-lg text-center text-xs text-slate-500">
                Start managing your projects today. No credit card required.
                Cancel anytime.
            </p>
        </div>
    );
}

// --- Helper Components ---
interface FeatureItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
    return (
        <div className="flex items-start gap-3">
            {/* Reduced icon container size: h-10 w-10 -> h-8 w-8 */}
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100/70 shadow-sm ring-1 ring-indigo-200">
                {/* Icon size passed in: h-4 w-4 */}
                {icon}
            </div>
            <div>
                {/* Reduced title size: lg -> base */}
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
                {/* Reduced description size: base -> sm */}
                <p className="text-sm text-slate-600">{description}</p>
            </div>
        </div>
    );
}

type Status = 'completed' | 'in-progress' | 'pending';
type Priority = 'high' | 'medium' | 'low';

interface TaskCardProps {
    title: string;
    delay: number;
    priority: Priority;
    status: Status;
}
const statusIcons: Record<Status, React.ReactNode> = {
    completed: '✓',
    'in-progress': '⏳',
    pending: '•',
};

const priorityColors: Record<Priority, string> = {
    high: 'border-red-500 text-red-500',
    medium: 'border-yellow-500 text-yellow-500',
    low: 'border-green-500 text-green-500',
};

function TaskCard({ title, priority, status, delay }: TaskCardProps) {
    const priorityColors = {
        high: 'bg-red-50 text-red-600 border-red-300',
        medium: 'bg-amber-50 text-amber-600 border-amber-300',
        low: 'bg-green-50 text-green-600 border-green-300',
    };

    const statusIcons = {
        completed: '✓',
        'in-progress': '▶',
        pending: '…',
    };

    return (
        // Reduced padding: p-4 -> p-3
        <div
            className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md"
            style={{
                animation: `fadeInUp 0.5s ease-out ${delay}ms both`,
            }}
        >
            {/* Reduced icon container size: h-6 w-6 -> h-5 w-5 */}
            <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    status === 'completed'
                        ? 'border-green-500 bg-green-500 text-white'
                        : status === 'in-progress'
                          ? 'border-indigo-500 bg-indigo-500 text-white'
                          : 'border-slate-300 bg-white text-slate-500'
                }`}
            >
                {statusIcons[status]}
            </div>
            <div className="flex-1">
                {/* Reduced title size: base -> sm */}
                <div
                    className={`text-sm font-medium ${status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900'}`}
                >
                    {title}
                </div>
            </div>
            {/* Reduced priority tag padding and font size */}
            <span
                className={`rounded-full border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${priorityColors[priority]}`}
            >
                {priority}
            </span>
        </div>
    );
}

// Ensure keyframes are still included (Important for the task card animation!)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
