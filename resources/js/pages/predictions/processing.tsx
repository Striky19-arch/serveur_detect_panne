import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ProcessingProps {
    prompt: string;
    payload: {
        medical_device_id: number;
        provider_id: number;
        analysis_period_days: number;
    };
}

export default function Processing({ prompt, payload }: ProcessingProps) {
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        // Start processing immediately on mount
        const executePrediction = async () => {
            try {
                const response = await axios.post('/predictions/execute', payload);

                if (response.data.success) {
                    setRedirectUrl(response.data.redirect_url);
                    setStatus('success');
                } else {
                    setStatus('error');
                    setErrorMsg('Unknown error occurred.');
                }
            } catch (error: any) {
                setStatus('error');
                setErrorMsg(error.response?.data?.message || error.message || 'An error occurred during prediction.');
            }
        };

        executePrediction();
    }, []); // Run once on mount

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Generating Prediction', href: '#' }]}>
            <Head title="Processing Prediction" />

            <div className="flex flex-1 flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                    {status === 'processing' && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                                <Loader2 className="h-16 w-16 text-blue-600 animate-spin relative z-10" />
                            </div>
                            <h1 className="text-2xl font-bold">Generating Analysis...</h1>
                            <p className="text-muted-foreground">Connecting to LLM Provider, analyzing sensor data, and generating report.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-green-700">Analysis Complete!</h1>
                            <p className="text-muted-foreground">The prediction report has been generated successfully.</p>
                            <Button size="lg" className="mt-4" onClick={() => redirectUrl && router.visit(redirectUrl)}>
                                View Full Report <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-10 w-10 text-red-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-red-700">Generation Failed</h1>
                            <p className="text-red-500 max-w-md">{errorMsg}</p>
                            <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
                                Go Back
                            </Button>
                        </>
                    )}
                </div>

                <Card className="border-t-4 border-t-slate-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Generated Prompt
                        </CardTitle>
                        <CardDescription>
                            This is the raw context and data sent to the AI model for analysis.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-xs overflow-auto max-h-[400px] whitespace-pre-wrap">
                            {prompt}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
