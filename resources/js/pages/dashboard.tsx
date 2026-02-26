import { Head, Link, usePoll } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type DashboardDevice } from '@/types';
import { Activity, AlertTriangle, CheckCircle, Cpu, MapPin, Smartphone, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Stats {
    total_devices: number;
    active_devices: number;
    critical_alerts: number;
    predictions_today: number;
}

interface DashboardProps {
    stats: Stats;
    devices: DashboardDevice[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

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

function getStatusConfig(status: string) {
    switch (status) {
        case 'active':
            return { label: 'Active', variant: 'default' as const, className: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20' };
        case 'inactive':
            return { label: 'Inactive', variant: 'secondary' as const, className: '' };
        case 'maintenance':
            return { label: 'Maintenance', variant: 'outline' as const, className: 'text-orange-600 dark:text-orange-400 border-orange-500/30' };
        case 'faulty':
            return { label: 'Faulty', variant: 'destructive' as const, className: '' };
        default:
            return { label: status, variant: 'secondary' as const, className: '' };
    }
}

export default function Dashboard({ stats, devices }: DashboardProps) {
    usePoll(10000, { only: ['devices', 'stats'] });

    const connectedCount = devices.filter((d) => d.is_connected).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 bg-muted/20 p-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_devices}</div>
                            <p className="text-xs text-muted-foreground">Registered in system</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_devices}</div>
                            <p className="text-xs text-muted-foreground">Currently online</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.critical_alerts}</div>
                            <p className="text-xs text-muted-foreground">Unread critical issues</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Predictions</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.predictions_today}</div>
                            <p className="text-xs text-muted-foreground">Generated today</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Connected Devices Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CardTitle>Connected Devices</CardTitle>
                            <Badge variant="outline" className="font-mono text-xs">
                                <span className="relative mr-1.5 flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                                </span>
                                {connectedCount}/{devices.length} online
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Auto-refresh every 10s</p>
                    </CardHeader>
                    <CardContent>
                        {devices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Smartphone className="mb-3 h-10 w-10 opacity-20" />
                                <p className="text-sm">No devices registered yet.</p>
                                <Link
                                    href="/medical-devices/create"
                                    className="text-primary mt-2 text-sm underline underline-offset-4 hover:text-primary/80"
                                >
                                    Add your first device
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                <TooltipProvider delayDuration={300}>
                                    {devices.map((device) => {
                                        const statusConfig = getStatusConfig(device.status);
                                        return (
                                            <Link
                                                key={device.id}
                                                href={`/medical-devices/${device.id}`}
                                                className="group"
                                            >
                                                <div className="border-border hover:border-primary/30 flex flex-col gap-3 rounded-lg border p-4 transition-all hover:shadow-md">
                                                    {/* Header: Connection + Status */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="flex items-center gap-1.5">
                                                                        {device.is_connected ? (
                                                                            <>
                                                                                <span className="relative flex h-2.5 w-2.5">
                                                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                                                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                                                                                </span>
                                                                                <Wifi className="h-3.5 w-3.5 text-green-500" />
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                                                <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {device.is_connected ? 'Connected' : 'Disconnected'}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                        <Badge variant={statusConfig.variant} className={`text-[10px] ${statusConfig.className}`}>
                                                            {statusConfig.label}
                                                        </Badge>
                                                    </div>

                                                    {/* Device Info */}
                                                    <div>
                                                        <h3 className="group-hover:text-primary truncate text-sm font-semibold transition-colors">
                                                            {device.name}
                                                        </h3>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {device.model}
                                                        </p>
                                                    </div>

                                                    {/* Metadata */}
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {device.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Cpu className="h-3 w-3" />
                                                            {device.sensors_count} sensor{device.sensors_count !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>

                                                    {/* Last Sync */}
                                                    <div className={`text-[11px] ${device.is_connected ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                                        Last sync: {timeAgo(device.last_sync_at)}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </TooltipProvider>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
