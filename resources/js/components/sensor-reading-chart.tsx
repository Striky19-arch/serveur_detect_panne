import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sensor } from '@/types';
import { Activity } from 'lucide-react';

interface SensorReadingChartProps {
    sensor: Sensor;
    className?: string;
}

export default function SensorReadingChart({ sensor, className }: SensorReadingChartProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="h-4 w-4" />
                    {sensor.name} History
                </CardTitle>
                <CardDescription>
                    Last 24 hours trend ({sensor.unit})
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                    <div className="text-muted-foreground text-sm flex flex-col items-center">
                        <Activity className="h-8 w-8 mb-2 opacity-50" />
                        <span>Chart visualization requires additional library (e.g. Recharts)</span>
                        <span className="text-xs mt-1">Current Value: {sensor.readings?.[0]?.value ?? 'N/A'} {sensor.unit}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
