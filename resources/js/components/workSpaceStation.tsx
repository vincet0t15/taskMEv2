'use client';

import { cn } from '@/lib/utils';
import { CreateProject } from '@/pages/projects/create';
import { project } from '@/routes/show';
import { Project } from '@/types/project';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { SidebarGroupLabel } from './ui/sidebar';

interface Workspace {
    id: number | string;
    name: string;
    url: string;
}

export default function WorkspaceSection() {
    const [open, setOpen] = useState(true);
    const page = usePage();
    const { myProjects } = page.props;
    const currentUrl = page.url;

    const workspaces: Workspace[] = (myProjects as Project[]).map((data) => ({
        id: data.id,
        name: data.name,
        url: project.url(data.id),
    }));

    return (
        <div className="px-2 py-3">
            <div
                className="flex cursor-pointer items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                    <SidebarGroupLabel>Projects</SidebarGroupLabel>
                </div>
                <div className="flex items-center text-center">
                    <ChevronDown
                        className={cn(
                            'h-4 w-4 transition-transform',
                            !open && '-rotate-90',
                        )}
                    />
                    <button
                        className="rounded p-1 hover:bg-muted"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <CreateProject />
                    </button>
                </div>
            </div>

            {/* Workspace Items */}
            {open && (
                <ul className="mt-2 space-y-1">
                    {workspaces.map((ws) => {
                        const isActive = currentUrl.startsWith(
                            `/projects/${ws.id}`,
                        );

                        return (
                            <Link
                                href={ws.url}
                                key={ws.id}
                                className={cn(
                                    'flex cursor-pointer items-center space-x-2 rounded-md px-3 py-1 text-sm transition-colors',
                                    isActive
                                        ? 'bg-muted font-semibold text-foreground'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex size-8 items-center justify-center rounded-full text-xs font-medium',
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-foreground',
                                    )}
                                >
                                    {ws.name.charAt(0)}
                                </div>
                                <span className="truncate">{ws.name}</span>
                            </Link>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
