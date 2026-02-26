import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem, Prediction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Brain, Calendar, ShieldCheck, Activity, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { router } from '@inertiajs/react';

interface ShowProps {
    prediction: Prediction;
}

export default function Show({ prediction }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Predictions', href: '/predictions' },
        { title: `Analysis #${prediction.id}`, href: `/predictions/${prediction.id}` },
    ];

    const getRiskBadge = (level: string) => {
        switch (level) {
            case 'low':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low Risk</Badge>;
            case 'medium':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium Risk</Badge>;
            case 'high':
                return <Badge variant="destructive">High Risk</Badge>;
            case 'critical':
                return <Badge variant="destructive" className="animate-pulse">CRITICAL</Badge>;
            default:
                return <Badge variant="outline">{level}</Badge>;
        }
    };

    // Parse suggestions if string, or use as is
    const recommendations = typeof prediction.recommendations === 'string'
        ? JSON.parse(prediction.recommendations)
        : prediction.recommendations || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Prediction #${prediction.id}`} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">Prediction Result</h1>
                            {getRiskBadge(prediction.risk_level)}
                        </div>
                        <p className="text-muted-foreground mt-1">
                            Generated on {new Date(prediction.created_at).toLocaleString()}
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this prediction? This action cannot be undone.')) {
                                router.delete(`/predictions/${prediction.id}`);
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Analysis
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-1 border-t-4 border-t-blue-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Failure Probability
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6">
                            <div className="text-5xl font-bold mb-2">
                                {prediction.failure_probability}%
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                Estimated likelihood of failure in the near future.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Predicted Date
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6">
                            <div className="text-2xl font-bold mb-2">
                                {prediction.predicted_failure_date
                                    ? new Date(prediction.predicted_failure_date).toLocaleDateString()
                                    : 'None Predicted'}
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                Estimated date of potential failure.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5" />
                                Confidence Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6">
                            <div className="text-3xl font-bold mb-2">
                                {prediction.confidence_score}%
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                AI model confidence in this prediction.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Detailed Analysis</CardTitle>
                            <CardDescription>
                                Provided by {prediction.provider?.name} ({prediction.provider?.type})
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none dark:prose-invert">
                                {/* Assuming result is text or markdown. If JSON, needs parsing */}
                                <div className="text-sm font-sans">
                                    {(prediction.prediction_result as any).report_content ? (
                                        <div className="markdown-preview">
                                            <ReactMarkdown
                                                components={{
                                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3 text-primary border-b pb-1" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 mb-4 text-muted-foreground" {...props} />,
                                                    li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                                                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-muted-foreground" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                                                }}
                                            >
                                                {(prediction.prediction_result as any).report_content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <pre className="whitespace-pre-wrap">
                                            {typeof prediction.prediction_result === 'string'
                                                ? prediction.prediction_result
                                                : JSON.stringify(prediction.prediction_result, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="h-5 w-5" />
                                Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {Array.isArray(recommendations) && recommendations.length > 0 ? (
                                    recommendations.map((rec: any, idx: number) => (
                                        <li key={idx} className="flex gap-3 items-start">
                                            {rec.priority === 'high' ? (
                                                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                                            ) : (
                                                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                            )}
                                            <div>
                                                <div className="font-medium text-sm">{rec.action}</div>
                                                {rec.urgency_days && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Urgency: {rec.urgency_days} days
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-muted-foreground text-sm">No specific recommendations provided.</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
