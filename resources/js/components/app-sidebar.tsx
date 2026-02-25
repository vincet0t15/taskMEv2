import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home } from '@/routes';
import archived from '@/routes/archived';
import calendar from '@/routes/calendar';
import myTask from '@/routes/myTask';
import { SharedData, type NavItem } from '@/types';
import { Project } from '@/types/project';
import { Link, usePage } from '@inertiajs/react';
import { Archive, Calendar1, LayoutGrid, UserIcon, UserRoundCheck } from 'lucide-react';
import AppLogo from './app-logo';
import { ArchiveProjects } from './archiveProjects';
import WorkspaceSection from './workSpaceStation';
import accounts from '@/routes/accounts';

export function AppSidebar() {

    const { auth, myArchivedProjects } = usePage<SharedData>().props

    const user = auth.user

    console.log(user)
    const mainNavItems: NavItem[] = [
        {
            title: 'General',
            children: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
                {
                    title: 'My Task',
                    href: myTask.index.url(),
                    icon: UserRoundCheck,
                },
                {
                    title: 'Calendar',
                    href: calendar.index.url(),
                    icon: Calendar1,
                },
            ],
        },
    ];

    const archiveItems: NavItem[] = [
        {
            title: 'Settings',
            children: [
                ...(user.is_admin
                    ? [
                        {
                            title: 'Accounts',
                            href: accounts.index.url(),
                            icon: UserIcon,
                        },
                    ]
                    : []),

                {
                    title: 'Archived Projects',
                    href: archived.projects.url(),
                    icon: Archive,
                },
            ],
        },
        ...(myArchivedProjects && (myArchivedProjects as Project[]).length > 0
            ? [
                {
                    title: 'Archive',
                    children: (myArchivedProjects as Project[]).map(project => ({
                        title: project.name,
                        href: `/projects/${project.id}/list`,
                        icon: Archive,
                    })),
                }
            ]
            : []),
    ]
    return (
        <Sidebar collapsible="offcanvas" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href={home()} prefetch>
                            <AppLogo />
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* <NavMainProject items={data.navMain} /> */}
                <NavMain items={mainNavItems} />
                <WorkspaceSection />
                <ArchiveProjects items={archiveItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
