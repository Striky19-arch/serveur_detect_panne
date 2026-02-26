import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePoll } from '@inertiajs/react';
import { BreadcrumbItem, MedicalDevice } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Activity,
    AlertCircle,
    Server,
    Settings,
    Thermometer,
    Wifi,
    WifiOff,
    Zap,
} from 'lucide-react';
import LiveSensorChart from '@/components/live-sensor-chart';

interface ShowProps {
    device: MedicalDevice;
}

function timeAgo(dateString?: string): string {
    if (!dateString) return 'Never';
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function getSensorIcon(type: string) {
    switch (type) {
        case 'temperature':
            return <Thermometer className="h-4 w-4 text-muted-foreground" />;
        case 'vibration':
            return <Activity className="h-4 w-4 text-muted-foreground" />;
        case 'voltage':
        case 'current':
            return <Zap className="h-4 w-4 text-muted-foreground" />;
        default:
            return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
}

export default function Show({ device }: ShowProps) {
    usePoll(5000, { only: ['device'] });

    const isConnected = device.last_sync_at
        && new Date(device.last_sync_at).getTime() > Date.now() - 2 * 60 * 1000;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Medical Devices', href: '/medical-devices' },
        { title: device.name, href: `/medical-devices/${device.id}` },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            case 'maintenance':
                return <Badge variant="outline" className="border-orange-500 text-orange-500">Maintenance</Badge>;
            case 'faulty':
                return <Badge variant="destructive">Faulty</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={device.name} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-bold">
                            {device.name}
                            {getStatusBadge(device.status)}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {device.manufacturer} — {device.model}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                            {isConnected ? (
                                <>
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                                    </span>
                                    <Wifi className="h-3.5 w-3.5 text-green-500" />
                                    <span className="text-green-600 dark:text-green-400">
                                        Connected · Synced {timeAgo(device.last_sync_at)}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                    <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        Disconnected · Last sync {timeAgo(device.last_sync_at)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/medical-devices/${device.id}/edit`}>Edit Device</Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/predictions/create?device_id=${device.id}`}>Generate Prediction</Link>
                        </Button>
                    </div>
                </div>

                {/* Sensor Cards — Latest Readings */}
                {device.sensors && device.sensors.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {device.sensors.map((sensor) => {
                            const reading = sensor.readings?.[0];
                            return (
                                <Card key={sensor.id} className="relative overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="mb-2 flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                {getSensorIcon(sensor.type)}
                                                <span className="text-sm font-medium">{sensor.name}</span>
                                            </div>
                                            {reading && (
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        reading.status === 'critical'
                                                            ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                                                            : reading.status === 'warning'
                                                                ? 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                                                                : 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                                                    }
                                                >
                                                    {reading.status.toUpperCase()}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-3xl font-bold tabular-nums">
                                                {reading ? Number(reading.value).toFixed(1) : '--'}
                                            </span>
                                            <span className="text-sm text-muted-foreground">{sensor.unit}</span>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                                            <span>
                                                Range: {sensor.min_normal_value ?? '–'} – {sensor.max_normal_value ?? '–'} {sensor.unit}
                                            </span>
                                            <span>
                                                {reading ? new Date(reading.recorded_at).toLocaleTimeString() : ''}
                                            </span>
                                        </div>
                                    </CardContent>
                                    {/* Subtle color bar at bottom based on status */}
                                    <div
                                        className={`h-0.5 ${reading?.status === 'critical'
                                                ? 'bg-red-500'
                                                : reading?.status === 'warning'
                                                    ? 'bg-orange-500'
                                                    : 'bg-green-500'
                                            }`}
                                    />
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Live Chart */}
                {device.sensors && device.sensors.length > 0 && (
                    <LiveSensorChart sensors={device.sensors} />
                )}

                {/* No sensors empty state */}
                {(!device.sensors || device.sensors.length === 0) && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <Settings className="mb-3 h-12 w-12 opacity-20" />
                            <p className="text-lg font-medium">No sensors configured</p>
                            <p className="mt-1 text-sm">Add sensors to this device to start monitoring.</p>
                            <Button variant="link" asChild className="mt-2">
                                <Link href={`/medical-devices/${device.id}/edit`}>Configure Sensors</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs for Predictions & Alerts */}
                <Tabs defaultValue="predictions" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="predictions">Predictions</TabsTrigger>
                        <TabsTrigger value="alerts">Alerts</TabsTrigger>
                        <TabsTrigger value="details">Device Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="predictions" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Prediction History</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {device.predictions?.map((prediction) => (
                                        <div key={prediction.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">
                                                        Failure Probability: <span className={
                                                            prediction.failure_probability > 75 ? 'text-red-600' :
                                                                prediction.failure_probability > 50 ? 'text-orange-600' : 'text-green-600'
                                                        }>{prediction.failure_probability}%</span>
                                                    </span>
                                                    <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
                                                        {prediction.risk_level}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    {new Date(prediction.created_at).toLocaleString()}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/predictions/${prediction.id}`}>View Report</Link>
                                            </Button>
                                        </div>
                                    ))}
                                    {!device.predictions?.length && (
                                        <div className="p-8 text-center text-sm text-muted-foreground">
                                            No predictions generated yet.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="alerts">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Recent Alerts</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {device.alerts?.map((alert) => (
                                        <div key={alert.id} className="flex items-start gap-3 p-4 hover:bg-muted/50">
                                            <AlertCircle className={`mt-0.5 h-5 w-5 ${alert.severity === 'critical' ? 'text-red-500' :
                                                alert.severity === 'warning' ? 'text-orange-500' : 'text-blue-500'
                                                }`} />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{alert.title}</p>
                                                <p className="text-sm text-muted-foreground">{alert.message}</p>
                                                <div className="mt-1 flex gap-2">
                                                    <span className="text-xs text-muted-foreground">{new Date(alert.created_at).toLocaleString()}</span>
                                                    {!alert.is_read && <Badge variant="outline" className="h-4 text-[10px]">New</Badge>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {!device.alerts?.length && (
                                        <div className="p-8 text-center text-sm text-muted-foreground">
                                            No active alerts.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="details">
                        <Card>
                            <CardHeader>
                                <CardTitle>Device Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <span className="block text-sm text-muted-foreground">Serial Number</span>
                                        <span className="font-mono font-medium">{device.serial_number}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-muted-foreground">Location</span>
                                        <span>{device.location}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-muted-foreground">Installed</span>
                                        <span>{new Date(device.installation_date).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-muted-foreground">ESP32 ID</span>
                                        <div className="flex items-center gap-2">
                                            <Server className="h-3 w-3" />
                                            <span className="font-mono text-xs">{device.esp32_device_id || 'Not Linked'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-muted-foreground">Manufacturer</span>
                                        <span>{device.manufacturer}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-muted-foreground">Model</span>
                                        <span>{device.model}</span>
                                    </div>
                                    {device.description && (
                                        <div className="sm:col-span-2 lg:col-span-3">
                                            <span className="block text-sm text-muted-foreground">Description</span>
                                            <p className="text-sm">{device.description}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
