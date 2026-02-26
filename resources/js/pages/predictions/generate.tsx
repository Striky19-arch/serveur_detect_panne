import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { BreadcrumbItem, MedicalDevice, PredictionProvider } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Loader2 } from 'lucide-react';

interface GenerateProps {
    devices: MedicalDevice[];
    providers: PredictionProvider[];
}

export default function Generate({ devices, providers }: GenerateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Predictions', href: '/predictions' },
        { title: 'Generate', href: '/predictions/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        medical_device_id: '',
        provider_id: '',
        analysis_period_days: '30', // Default to last 30 days
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Since we don't have the actual generation logic in the backend controller yet, 
        // we might get a 404 or 500 if the store route isn't allowing generation.
        // But for UI implementation this is correct.
        // Note: The plan says "GeneratePredictionJob", so this might just queue it.
        post('/predictions');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Generate Prediction" />

            <div className="max-w-xl mx-auto p-4 flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold">Generate Prediction</h1>
                    <p className="text-muted-foreground mt-1">Analyze sensor data to predict potential hardware failures.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Select the device and analysis parameters.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="device">Medical Device</Label>
                                <Select
                                    value={String(data.medical_device_id)}
                                    onValueChange={(val) => setData('medical_device_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a device" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {devices.map((device) => (
                                            <SelectItem key={device.id} value={String(device.id)}>
                                                {device.name} ({device.serial_number})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.medical_device_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="provider">AI Provider</Label>
                                <Select
                                    value={String(data.provider_id)}
                                    onValueChange={(val) => setData('provider_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an AI provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {providers.map((provider) => (
                                            <SelectItem key={provider.id} value={String(provider.id)}>
                                                {provider.name} ({provider.type})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Different providers may have different costs or accuracy levels.
                                </p>
                                <InputError message={errors.provider_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="period">Analysis Period</Label>
                                <Select
                                    value={data.analysis_period_days}
                                    onValueChange={(val) => setData('analysis_period_days', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">Last 7 Days</SelectItem>
                                        <SelectItem value="30">Last 30 Days</SelectItem>
                                        <SelectItem value="90">Last 3 Months</SelectItem>
                                        <SelectItem value="180">Last 6 Months</SelectItem>
                                        <SelectItem value="365">Last Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t">
                                <Button variant="outline" asChild>
                                    <Link href="/predictions">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate Analysis
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
