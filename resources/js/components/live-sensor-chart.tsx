import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sensor } from '@/types';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface LiveSensorChartProps {
    sensors: Sensor[];
}

const SENSOR_COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#22c55e', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#14b8a6', // teal
    '#6366f1', // indigo
];

function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        color: string;
        dataKey: string;
    }>;
    label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur-sm">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
            <div className="space-y-1">
                {payload.map((entry) => (
                    <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                            <span
                                className="inline-block h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span>{entry.name}</span>
                        </div>
                        <span className="font-mono font-semibold">{Number(entry.value).toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function LiveSensorChart({ sensors }: LiveSensorChartProps) {
    const [selectedSensors, setSelectedSensors] = useState<Set<number>>(() => {
        return new Set(sensors.map((s) => s.id));
    });

    const toggleSensor = (sensorId: number) => {
        setSelectedSensors((prev) => {
            const next = new Set(prev);
            if (next.has(sensorId)) {
                next.delete(sensorId);
            } else {
                next.add(sensorId);
            }
            return next;
        });
    };

    // Build chart data: merge all sensor readings into a unified timeline
    const chartData = useMemo(() => {
        const timeMap = new Map<string, Record<string, number | string>>();

        sensors.forEach((sensor) => {
            if (!selectedSensors.has(sensor.id)) return;

            // Reverse to get chronological order (readings come latest-first)
            const readings = [...(sensor.readings || [])].reverse();

            readings.forEach((reading) => {
                const timeKey = reading.recorded_at;
                const existing = timeMap.get(timeKey) || { time: formatTime(timeKey), rawTime: timeKey };
                existing[`sensor_${sensor.id}`] = reading.value;
                timeMap.set(timeKey, existing);
            });
        });

        // Sort by raw time
        return Array.from(timeMap.values()).sort((a, b) =>
            String(a.rawTime).localeCompare(String(b.rawTime)),
        );
    }, [sensors, selectedSensors]);

    const activeSensors = sensors.filter((s) => selectedSensors.has(s.id));
    const hasData = chartData.length > 0;

    return (
        <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Sensor Readings — Live Chart</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Showing last 50 readings per sensor · Auto-refresh every 5s
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {sensors.map((sensor, index) => (
                        <div key={sensor.id} className="flex items-center gap-1.5">
                            <Checkbox
                                id={`sensor-${sensor.id}`}
                                checked={selectedSensors.has(sensor.id)}
                                onCheckedChange={() => toggleSensor(sensor.id)}
                                style={{
                                    borderColor: SENSOR_COLORS[index % SENSOR_COLORS.length],
                                    backgroundColor: selectedSensors.has(sensor.id)
                                        ? SENSOR_COLORS[index % SENSOR_COLORS.length]
                                        : undefined,
                                }}
                            />
                            <Label
                                htmlFor={`sensor-${sensor.id}`}
                                className="cursor-pointer text-xs font-medium"
                            >
                                {sensor.name}
                                <span className="ml-1 text-muted-foreground">({sensor.unit})</span>
                            </Label>
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                {!hasData ? (
                    <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                            {sensors.length === 0
                                ? 'No sensors configured for this device.'
                                : activeSensors.length === 0
                                    ? 'Select at least one sensor to display data.'
                                    : 'No readings available yet.'}
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 11 }}
                                interval="preserveStartEnd"
                                className="text-muted-foreground"
                            />
                            <YAxis
                                tick={{ fontSize: 11 }}
                                className="text-muted-foreground"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                            />
                            {activeSensors.map((sensor, idx) => {
                                const globalIndex = sensors.findIndex((s) => s.id === sensor.id);
                                return (
                                    <Line
                                        key={sensor.id}
                                        type="monotone"
                                        dataKey={`sensor_${sensor.id}`}
                                        name={`${sensor.name} (${sensor.unit})`}
                                        stroke={SENSOR_COLORS[globalIndex % SENSOR_COLORS.length]}
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4, strokeWidth: 0 }}
                                        connectNulls
                                    />
                                );
                            })}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
