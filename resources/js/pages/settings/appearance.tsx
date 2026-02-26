import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { ThemeSelector } from '@/components/theme-selector';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Apparence"
                        description="Réglez le mode (clair/sombre/système) et la palette de thème"
                    />
                    <div className="space-y-4">
                        <div>
                            <h3 className="mb-2 text-sm font-medium">Mode</h3>
                            <AppearanceTabs />
                        </div>
                        <div>
                            <h3 className="mb-2 text-sm font-medium">Thème</h3>
                            <ThemeSelector />
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
