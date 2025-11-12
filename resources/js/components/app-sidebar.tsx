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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Archive, Calendar1, LayoutGrid, UserRoundCheck } from 'lucide-react';
import AppLogo from './app-logo';
import { ArchiveProjects } from './archiveProjects';
import WorkspaceSection from './workSpaceStation';
const mainNavItems: NavItem[] = [
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
];

const archiveItems: NavItem[] = [
    {
        title: 'Arhived',
        href: archived.projects.url(),
        icon: Archive,
    },
];
export function AppSidebar() {
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
