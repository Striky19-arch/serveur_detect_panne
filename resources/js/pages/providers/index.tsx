import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BreadcrumbItem, PredictionProvider } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Activity, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface IndexProps {
    providers: PredictionProvider[];
}

export default function Index({ providers }: IndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'AI Providers', href: '/providers' },
    ];

    const handleDelete = (id: number) => {
        router.delete(`/providers/${id}`);
    };

    const getStatusColor = (status: string | null | undefined) => {
        if (status === 'success') return 'text-green-500';
        if (status === 'failed') return 'text-red-500';
        return 'text-gray-400';
    };

    const getStatusIcon = (status: string | null | undefined) => {
        if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />;
        if (status === 'failed') return <XCircle className="w-4 h-4 text-red-500" />;
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Providers" />
            <div className="flex flex-1 flex-col gap-4 p-4 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">AI Configuration</h1>
                        <p className="text-muted-foreground">Manage your AI prediction models and providers.</p>
                    </div>
                    <Link href="/providers/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Provider
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {providers.map((provider) => (
                        <Card key={provider.id} className="relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${provider.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                                        <CardDescription className="capitalize">
                                            {provider.provider} ({provider.type.replace('_', ' ')})
                                        </CardDescription>
                                    </div>
                                    <Badge variant={provider.is_active ? 'default' : 'secondary'}>
                                        {provider.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Priority:</span>
                                        <span className="font-medium">{provider.priority}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Last Test:</span>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(provider.last_test_status)}
                                            <span className={getStatusColor(provider.last_test_status)}>
                                                {provider.last_test_status ? (provider.last_test_status.charAt(0).toUpperCase() + provider.last_test_status.slice(1)) : 'Never'}
                                            </span>
                                        </div>
                                    </div>
                                    {provider.last_test_response_time && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Response Time:</span>
                                            <span>{provider.last_test_response_time}ms</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-4 flex justify-between border-t bg-muted/20">
                                <div className="flex gap-2">
                                    {/* We could add a quick test button here too */}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/providers/${provider.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Configure
                                        </Button>
                                    </Link>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the provider configuration.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(provider.id)} className="bg-destructive hover:bg-destructive/90">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}

                    {providers.length === 0 && (
                        <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl">
                            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium">No Providers Configured</h3>
                            <p className="text-muted-foreground mb-4">Add an AI provider to start generating predictions.</p>
                            <Link href="/providers/create">
                                <Button>Add Provider</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
