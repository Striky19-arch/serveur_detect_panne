import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem, Alert } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, AlertCircle, Check, Eye } from 'lucide-react';

interface IndexProps {
    alerts: {
        data: Alert[];
        links: any[];
    };
    filters: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Alerts', href: '/alerts' },
];

export default function Index({ alerts }: IndexProps) {
    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-orange-500" />;
            default:
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <Badge variant="destructive">Critical</Badge>;
            case 'warning':
                return <Badge variant="outline" className="text-orange-500 border-orange-500">Warning</Badge>;
            default:
                return <Badge variant="secondary">Info</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alerts Center" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Alerts Center</h1>
                        <p className="text-muted-foreground">Monitor and manage system notifications</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {alerts.data.map((alert) => (
                        <Card key={alert.id} className={`transition-colors ${!alert.is_read ? 'bg-muted/40 border-l-4 border-l-primary' : ''}`}>
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className="mt-1">
                                    {getSeverityIcon(alert.severity)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{alert.title}</h3>
                                            {getSeverityBadge(alert.severity)}
                                            {!alert.is_read && <Badge className="bg-primary text-xs">New</Badge>}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(alert.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/90">{alert.message}</p>
                                    <div className="flex gap-2 pt-2">
                                        {!alert.acknowledged_at && (
                                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                                <Check className="h-3.5 w-3.5" />
                                                Acknowledge
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                                            <Eye className="h-3.5 w-3.5" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {!alerts.data.length && (
                        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                            <Check className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p>No alerts found. System is running smoothly.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
