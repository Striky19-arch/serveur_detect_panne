import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem, MedicalDevice } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle, Wrench } from 'lucide-react';

interface IndexProps {
    devices: {
        data: MedicalDevice[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Medical Devices', href: '/medical-devices' },
];

export default function Index({ devices, filters }: IndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Medical Devices" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Medical Devices</h1>
                    <Link href="/medical-devices/create" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                        Add Device
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {devices.data.map((device) => (
                        <Card key={device.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <Link href={`/medical-devices/${device.id}`}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-semibold">{device.name}</CardTitle>
                                        <div className="text-sm text-muted-foreground">{device.model}</div>
                                    </div>
                                    {device.status === 'active' && <CheckCircle className="h-5 w-5 text-green-500" />}
                                    {device.status === 'inactive' && <XCircle className="h-5 w-5 text-gray-400" />}
                                    {device.status === 'maintenance' && <Wrench className="h-5 w-5 text-orange-500" />}
                                    {device.status === 'faulty' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm grid gap-1">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Serial:</span>
                                            <span className="font-mono">{device.serial_number}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Location:</span>
                                            <span>{device.location}</span>
                                        </div>
                                        {device.last_sync_at && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Last Sync:</span>
                                                <span>{new Date(device.last_sync_at).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
