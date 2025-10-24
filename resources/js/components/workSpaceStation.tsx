'use client';

import { cn } from '@/lib/utils';
import { CreateProject } from '@/pages/projects/create';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { SidebarGroupLabel } from './ui/sidebar';

export default function WorkspaceSection() {
    const [open, setOpen] = useState(true);

    const workspaces = [
        { id: 1, name: 'Beyond UI' },
        { id: 2, name: 'Marketing' },
        { id: 3, name: 'HR' },
    ];

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
                    {workspaces.map((ws) => (
                        <li
                            key={ws.id}
                            className="flex cursor-pointer items-center space-x-2 rounded-md px-3 py-1 text-sm text-foreground hover:bg-muted"
                        >
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-medium text-foreground">
                                {ws.name.charAt(0)}
                            </div>
                            <span>{ws.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
