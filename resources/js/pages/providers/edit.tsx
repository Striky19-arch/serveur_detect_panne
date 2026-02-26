import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem, PredictionProvider } from '@/types';
import ProviderForm from './provider-form';

interface EditProps {
    provider: PredictionProvider;
}

export default function Edit({ provider }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'AI Providers', href: '/providers' },
        { title: provider.name, href: `/providers/${provider.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${provider.name}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 max-w-3xl mx-auto w-full">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Edit Configuration</h1>
                    <p className="text-muted-foreground">Modify settings for {provider.name}.</p>
                </div>

                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <ProviderForm provider={provider} mode="edit" />
                </div>
            </div>
        </AppLayout>
    );
}
