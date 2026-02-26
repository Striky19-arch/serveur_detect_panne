import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react'; // Link removed as unused
import { BreadcrumbItem, MedicalDevice, SensorReading, Sensor } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { pickBy } from 'lodash';
import { useState } from 'react';

// Extend SensorReading to include nested relations loaded by controller
interface ExtendedSensorReading extends SensorReading {
    sensor?: Sensor & {
        medical_device?: MedicalDevice;
    };
}


interface IndexProps {
    readings: {
        data: ExtendedSensorReading[];
        links: any[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    devices: MedicalDevice[];
    sensorTypes: string[];
    filters: {
        device_id?: string;
        sensor_type?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Readings History', href: '/readings' },
];

export default function Index({ readings, devices, sensorTypes, filters }: IndexProps) {
    const [filterValues, setFilterValues] = useState({
        device_id: filters.device_id || 'all',
        sensor_type: filters.sensor_type || 'all',
        status: filters.status || 'all',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filterValues, [key]: value };
        setFilterValues(newFilters);

        // Debounce or apply immediately? Applying immediately for selects, maybe wait for dates/inputs
        // For simplicity, let's trigger reload
        const query = pickBy({
            ...newFilters,
            device_id: newFilters.device_id === 'all' ? undefined : newFilters.device_id,
            sensor_type: newFilters.sensor_type === 'all' ? undefined : newFilters.sensor_type,
            status: newFilters.status === 'all' ? undefined : newFilters.status,
        });

        router.get('/readings', query as any, {
            preserveState: true,
            replace: true,
        });
    };

    const statusColors = {
        normal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sensor Readings" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold">Readings History</h1>
                </div>

                {/* Filters */}
                <div className="bg-card p-4 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Device</label>
                        <Select
                            value={filterValues.device_id}
                            onValueChange={(val) => handleFilterChange('device_id', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Devices" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Devices</SelectItem>
                                {devices.map((device) => (
                                    <SelectItem key={device.id} value={device.id.toString()}>
                                        {device.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sensor Type</label>
                        <Select
                            value={filterValues.sensor_type}
                            onValueChange={(val) => handleFilterChange('sensor_type', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {sensorTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                            value={filterValues.status}
                            onValueChange={(val) => handleFilterChange('status', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">From</label>
                        <Input
                            type="date"
                            value={filterValues.date_from}
                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">To</label>
                        <Input
                            type="date"
                            value={filterValues.date_to}
                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Device</TableHead>
                                <TableHead>Sensor</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {readings.data.length > 0 ? (
                                readings.data.map((reading) => (
                                    <TableRow key={reading.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {new Date(reading.recorded_at).toLocaleDateString()}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(reading.recorded_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {reading.sensor?.medical_device?.name || 'Unknown Device'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{reading.sensor?.name || 'Unknown Sensor'}</span>
                                                <span className="text-xs text-muted-foreground capitalize">{reading.sensor?.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono font-medium">
                                                {reading.value} {reading.sensor?.unit}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={statusColors[reading.status] || ''}>
                                                {reading.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No readings found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {readings.data.length > 0 && (
                    <div className="flex items-center justify-between py-4">
                        <div className="text-sm text-muted-foreground">
                            Page {readings.current_page} of {readings.last_page}
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.visit(readings.prev_page_url!)}
                                disabled={!readings.prev_page_url}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.visit(readings.next_page_url!)}
                                disabled={!readings.next_page_url}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
