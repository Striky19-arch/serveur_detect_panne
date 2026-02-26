import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Smartphone, AlertCircle, Cpu, Activity, History, Settings } from 'lucide-react';
import { notifications } from '@/routes/settings';
import AppLogo from './app-logo';

import { useLaravelReactI18n } from 'laravel-react-i18n';

export function AppSidebar() {
    const { t } = useLaravelReactI18n();

    const mainNavItems: NavItem[] = [
        {
            title: t('Dashboard'),
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: t('Medical Devices'),
            href: '/medical-devices',
            icon: Smartphone,
        },
        {
            title: t('Readings History'),
            href: '/readings',
            icon: History,
        },
        {
            title: t('Alerts'),
            href: '/alerts',
            icon: AlertCircle,
        },
        {
            title: t('Predictions'),
            href: '/predictions',
            icon: Activity,
        },
        {
            title: t('AI Providers'),
            href: '/providers',
            icon: Cpu,
        },
        {
            title: t('Settings'),
            href: notifications(),
            icon: Settings,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: t('Repository'),
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: t('Documentation'),
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
