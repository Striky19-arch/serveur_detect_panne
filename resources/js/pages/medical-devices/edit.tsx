import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { BreadcrumbItem, MedicalDevice } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface EditProps {
    device: MedicalDevice;
}

export default function Edit({ device }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Medical Devices', href: '/medical-devices' },
        { title: device.name, href: `/medical-devices/${device.id}` },
        { title: 'Edit', href: `/medical-devices/${device.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: device.name || '',
        model: device.model || '',
        manufacturer: device.manufacturer || '',
        serial_number: device.serial_number || '',
        installation_date: device.installation_date || '',
        location: device.location || '',
        status: device.status || 'active',
        description: device.description || '',
        esp32_device_id: device.esp32_device_id || '',
        sensors: (device.sensors || []).map(s => ({
            id: s.id,
            name: s.name,
            type: s.type,
            unit: s.unit,
            pin_number: s.pin_number?.toString() || '',
            min_normal_value: s.min_normal_value?.toString() || '',
            max_normal_value: s.max_normal_value?.toString() || '',
        })) as {
            id?: number;
            name: string;
            type: string;
            unit: string;
            pin_number: string;
            min_normal_value: string;
            max_normal_value: string;
        }[],
    });

    const addSensor = () => {
        setData('sensors', [
            ...data.sensors,
            {
                name: '',
                type: '',
                unit: '',
                pin_number: '',
                min_normal_value: '',
                max_normal_value: '',
            },
        ]);
    };

    const removeSensor = (index: number) => {
        const newSensors = [...data.sensors];
        newSensors.splice(index, 1);
        setData('sensors', newSensors);
    };

    const updateSensor = (index: number, field: keyof typeof data.sensors[0], value: string) => {
        const newSensors = [...data.sensors];
        newSensors[index] = { ...newSensors[index], [field]: value };
        setData('sensors', newSensors);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/medical-devices/${device.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${device.name}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
                <h1 className="text-2xl font-bold mb-4">Edit Device: {device.name}</h1>

                <form onSubmit={submit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Device Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                value={data.model}
                                onChange={(e) => setData('model', e.target.value)}
                                required
                            />
                            {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="manufacturer">Manufacturer</Label>
                            <Input
                                id="manufacturer"
                                value={data.manufacturer}
                                onChange={(e) => setData('manufacturer', e.target.value)}
                                required
                            />
                            {errors.manufacturer && <p className="text-sm text-red-500">{errors.manufacturer}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="serial_number">Serial Number</Label>
                            <Input
                                id="serial_number"
                                value={data.serial_number}
                                onChange={(e) => setData('serial_number', e.target.value)}
                                required
                            />
                            {errors.serial_number && <p className="text-sm text-red-500">{errors.serial_number}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="installation_date">Installation Date</Label>
                            <Input
                                id="installation_date"
                                type="date"
                                value={data.installation_date}
                                onChange={(e) => setData('installation_date', e.target.value)}
                                required
                            />
                            {errors.installation_date && <p className="text-sm text-red-500">{errors.installation_date}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                required
                            />
                            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select onValueChange={(value) => setData('status', value as MedicalDevice['status'])} defaultValue={data.status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="faulty">Faulty</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="esp32_device_id">ESP32 Device ID</Label>
                            <Input
                                id="esp32_device_id"
                                value={data.esp32_device_id}
                                onChange={(e) => setData('esp32_device_id', e.target.value)}
                            />
                            {errors.esp32_device_id && <p className="text-sm text-red-500">{errors.esp32_device_id}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Sensors Configuration</h2>
                            <Button type="button" variant="outline" size="sm" onClick={addSensor}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Sensor
                            </Button>
                        </div>

                        {data.sensors.length === 0 && (
                            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                                No sensors added.
                            </div>
                        )}

                        <div className="space-y-4">
                            {data.sensors.map((sensor, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-card relative space-y-4">
                                    <div className="absolute right-4 top-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => removeSensor(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-10">
                                        <div className="space-y-2">
                                            <Label>Sensor Name</Label>
                                            <Input
                                                value={sensor.name}
                                                onChange={(e) => updateSensor(index, 'name', e.target.value)}
                                                placeholder="e.g. Temp Sensor 1"
                                                required
                                            />
                                            {(errors as any)[`sensors.${index}.name`] && (
                                                <p className="text-sm text-red-500">{(errors as any)[`sensors.${index}.name`]}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select
                                                value={sensor.type}
                                                onValueChange={(value) => updateSensor(index, 'type', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="temperature">Temperature</SelectItem>
                                                    <SelectItem value="humidity">Humidity</SelectItem>
                                                    <SelectItem value="pressure">Pressure</SelectItem>
                                                    <SelectItem value="vibration">Vibration</SelectItem>
                                                    <SelectItem value="voltage">Voltage</SelectItem>
                                                    <SelectItem value="current">Current</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {(errors as any)[`sensors.${index}.type`] && (
                                                <p className="text-sm text-red-500">{(errors as any)[`sensors.${index}.type`]}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Unit</Label>
                                            <Input
                                                value={sensor.unit}
                                                onChange={(e) => updateSensor(index, 'unit', e.target.value)}
                                                placeholder="e.g. °C, %, Pa"
                                                required
                                            />
                                            {(errors as any)[`sensors.${index}.unit`] && (
                                                <p className="text-sm text-red-500">{(errors as any)[`sensors.${index}.unit`]}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Pin Number (ESP32)</Label>
                                            <Input
                                                type="number"
                                                value={sensor.pin_number}
                                                onChange={(e) => updateSensor(index, 'pin_number', e.target.value)}
                                                placeholder="e.g. 34"
                                            />
                                            {(errors as any)[`sensors.${index}.pin_number`] && (
                                                <p className="text-sm text-red-500">{(errors as any)[`sensors.${index}.pin_number`]}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Min Normal Value</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={sensor.min_normal_value}
                                                onChange={(e) => updateSensor(index, 'min_normal_value', e.target.value)}
                                                placeholder="Optional"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Max Normal Value</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={sensor.max_normal_value}
                                                onChange={(e) => updateSensor(index, 'max_normal_value', e.target.value)}
                                                placeholder="Optional"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href={`/medical-devices/${device.id}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                            Cancel
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Device'}
                        </Button>
                    </div>
                </form>
            </div >
        </AppLayout >
    );
}
