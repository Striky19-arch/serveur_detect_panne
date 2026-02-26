import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { PredictionProvider } from '@/types';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ProviderFormProps {
    provider?: PredictionProvider;
    mode: 'create' | 'edit';
}

interface ProviderFormData {
    name: string;
    provider: string;
    type: string;
    is_active: boolean;
    priority: number;
    config: ProviderConfig;
}

interface ProviderConfig {
    [key: string]: string | number | boolean | null | undefined;
    api_key?: string;
    model?: string;
    endpoint?: string;
    additional_params?: string;
}

export default function ProviderForm({ provider, mode }: ProviderFormProps) {
    const { data, setData, post, put, processing, errors } = useForm<ProviderFormData>({
        name: provider?.name || '',
        provider: provider?.provider || 'openrouter',
        type: provider?.type || 'cloud_api',
        is_active: provider?.is_active ?? true,
        priority: provider?.priority || 0,
        config: (provider?.config as ProviderConfig) || {
            api_key: '',
            model: '',
            endpoint: '',
            additional_params: ''
        },
    });

    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
    const [testMessage, setTestMessage] = useState('');

    // Auto-set type based on provider
    useEffect(() => {
        if (data.provider === 'openrouter') {
            setData('type', 'cloud_api');
        } else if (data.provider === 'ollama') {
            setData('type', 'local_llm');
            if (!data.config.endpoint) {
                setData('config', { ...data.config, endpoint: 'http://localhost:11434' });
            }
        } else if (data.provider === 'python') {
            setData('type', 'python_model');
        }
    }, [data.provider]);

    const updateConfig = (key: string, value: string) => {
        setData('config', { ...data.config, [key]: value });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            post('/providers');
        } else {
            put(`/providers/${provider!.id}`);
        }
    };

    const runTest = async () => {
        setTestStatus('testing');
        setTestMessage('');
        try {
            const response = await axios.post('/providers/test-connection', {
                provider: data.provider,
                type: data.type,
                config: data.config
            });

            if (response.data.success) {
                setTestStatus('success');
                setTestMessage(response.data.message || 'Connection successful');
            } else {
                setTestStatus('failed');
                setTestMessage(response.data.message || 'Connection failed');
            }
        } catch (error: any) {
            setTestStatus('failed');
            setTestMessage(error.response?.data?.message || error.message || 'An error occurred during testing');
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Card className="border-none shadow-none">
                <CardContent className="p-0 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Friendly Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Main GPT-4o Model"
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="provider">Provider</Label>
                            <Select
                                value={data.provider}
                                onValueChange={(value) => setData('provider', value as string)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="openrouter">OpenRouter (Cloud)</SelectItem>
                                    <SelectItem value="ollama">Ollama (Local LLM)</SelectItem>
                                    <SelectItem value="python">Python Script (Custom)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.provider && <p className="text-sm text-red-500">{errors.provider}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Integration Type</Label>
                            <Input
                                id="type"
                                value={data.type}
                                disabled
                                className="bg-muted"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority Order</Label>
                            <Input
                                id="priority"
                                type="number"
                                value={data.priority}
                                onChange={(e) => setData('priority', parseInt(e.target.value))}
                                min={0}
                            />
                            <p className="text-xs text-muted-foreground">Lower number runs first.</p>
                            {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-medium">Configuration Details</h3>

                        {data.provider === 'openrouter' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="api_key">API Key</Label>
                                    <Input
                                        id="api_key"
                                        type="password"
                                        value={data.config.api_key || ''}
                                        onChange={(e) => updateConfig('api_key', e.target.value)}
                                        placeholder="sk-or-..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model">Model Name</Label>
                                    <Input
                                        id="model"
                                        value={data.config.model || ''}
                                        onChange={(e) => updateConfig('model', e.target.value)}
                                        placeholder="openai/gpt-4o"
                                    />
                                </div>
                            </>
                        )}

                        {data.provider === 'ollama' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="endpoint">Endpoint URL</Label>
                                    <Input
                                        id="endpoint"
                                        value={data.config.endpoint || ''}
                                        onChange={(e) => updateConfig('endpoint', e.target.value)}
                                        placeholder="http://localhost:11434"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model">Model Name</Label>
                                    <Input
                                        id="model"
                                        value={data.config.model || ''}
                                        onChange={(e) => updateConfig('model', e.target.value)}
                                        placeholder="llama3"
                                    />
                                </div>
                            </>
                        )}

                        {data.provider === 'python' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="endpoint">Endpoint / Script Path</Label>
                                    <Input
                                        id="endpoint"
                                        value={data.config.endpoint || ''}
                                        onChange={(e) => updateConfig('endpoint', e.target.value)}
                                        placeholder="/path/to/script.py or http://localhost:5000"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 pt-4">
                        <Switch
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', checked)}
                        />
                        <Label htmlFor="is_active">Enable this provider</Label>
                    </div>
                </CardContent>
            </Card>

            {testStatus !== 'idle' && (
                <Alert variant={testStatus === 'failed' ? "destructive" : "default"} className={testStatus === 'success' ? "border-green-500 bg-green-50" : ""}>
                    <div className="flex items-center gap-2">
                        {testStatus === 'testing' && <Loader2 className="h-4 w-4 animate-spin" />}
                        {testStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {testStatus === 'failed' && <XCircle className="h-4 w-4" />}
                        <AlertTitle>
                            {testStatus === 'testing' ? 'Testing Connection...' : (testStatus === 'success' ? 'Test Success' : 'Test Failed')}
                        </AlertTitle>
                    </div>
                    <AlertDescription className={testStatus === 'success' ? "text-green-700" : ""}>
                        {testMessage}
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex justify-between items-center gap-4 border-t pt-6">
                <Button type="button" variant="secondary" onClick={runTest} disabled={testStatus === 'testing'}>
                    {testStatus === 'testing' ? 'Testing...' : 'Test Configuration'}
                </Button>

                <div className="flex gap-4">
                    <Button variant="ghost" type="button" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : (mode === 'create' ? 'Create Provider' : 'Update Provider')}
                    </Button>
                </div>
            </div>
        </form>
    );
}
