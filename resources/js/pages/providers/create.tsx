import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import ProviderForm from './provider-form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'AI Providers', href: '/providers' },
    { title: 'Create Provider', href: '/providers/create' },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create AI Provider" />
            <div className="flex flex-1 flex-col gap-4 p-4 max-w-3xl mx-auto w-full">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Add Configuration</h1>
                    <p className="text-muted-foreground">Configure a new AI model provider.</p>
                </div>

                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <ProviderForm mode="create" />
                </div>
            </div>
        </AppLayout>
    );
}
