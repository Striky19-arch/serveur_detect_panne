import { Head, useForm, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { update as updateNotifications, test as testNotification } from '@/routes/settings/notifications';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Paramètres',
        href: '#',
    },
    {
        title: 'Notifications',
        href: '/settings/notifications',
    },
];

interface SettingsProps {
    settings: {
        notification_email: string;
        alert_template_critical_max: string;
        alert_template_critical_min: string;
        alert_template_warning_max: string;
        alert_template_warning_min: string;
    };
}

export default function NotificationSettings({ settings }: SettingsProps) {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        notification_email: settings.notification_email || '',
        alert_template_critical_max: settings.alert_template_critical_max || '',
        alert_template_critical_min: settings.alert_template_critical_min || '',
        alert_template_warning_max: settings.alert_template_warning_max || '',
        alert_template_warning_min: settings.alert_template_warning_min || '',
    });

    const [testing, setTesting] = useState<string | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(updateNotifications.url());
    };

    const sendTest = (key: keyof typeof data, subject: string) => {
        if (!data.notification_email) {
            toast.error("Veuillez d'abord configurer une adresse email.");
            return;
        }

        setTesting(key);
        router.post(testNotification.url(), {
            email: data.notification_email,
            subject: subject,
            message: data[key],
        }, {
            preserveScroll: true,
            onFinish: () => setTesting(null),
            onSuccess: () => toast.success("Notification de test envoyée !")
        });
    };

    const variables = [
        '{sensor}: Nom du capteur',
        '{value}: Valeur mesurée',
        '{unit}: Unité',
        '{threshold}: Valeur seuil déclenchée',
        '{time}: Heure de la lecture',
        '{equipment}: Nom de l\'équipement',
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Paramètres de Notifications" />
            <Toaster richColors />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Paramètres de Notifications</h1>
                        <p className="text-muted-foreground">Configurez les destinataires et les modèles de messages d'alerte.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Destinataire</CardTitle>
                            <CardDescription>Adresse email qui recevra les alertes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={data.notification_email}
                                    onChange={e => setData('notification_email', e.target.value)}
                                />
                                {errors.notification_email && <p className="text-sm text-red-500">{errors.notification_email}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Modèles de Messages</CardTitle>
                            <CardDescription>
                                Personnalisez les messages envoyés. Variables disponibles : <br />
                                <code className="bg-muted px-1 py-0.5 rounded text-xs">{variables.join(', ')}</code>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Critique Max (Dépassement seuil critique haut)</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => sendTest('alert_template_critical_max', 'TEST: Alerte Critique Max')}
                                            disabled={testing === 'alert_template_critical_max'}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            {testing === 'alert_template_critical_max' ? 'Envoi...' : 'Tester'}
                                        </Button>
                                    </div>
                                    <Textarea
                                        rows={5}
                                        value={data.alert_template_critical_max}
                                        onChange={e => setData('alert_template_critical_max', e.target.value)}
                                    />
                                    {errors.alert_template_critical_max && <p className="text-sm text-red-500">{errors.alert_template_critical_max}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Critique Min (Dépassement seuil critique bas)</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => sendTest('alert_template_critical_min', 'TEST: Alerte Critique Min')}
                                            disabled={testing === 'alert_template_critical_min'}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            {testing === 'alert_template_critical_min' ? 'Envoi...' : 'Tester'}
                                        </Button>
                                    </div>
                                    <Textarea
                                        rows={5}
                                        value={data.alert_template_critical_min}
                                        onChange={e => setData('alert_template_critical_min', e.target.value)}
                                    />
                                    {errors.alert_template_critical_min && <p className="text-sm text-red-500">{errors.alert_template_critical_min}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Avertissement Max (Dépassement seuil normal haut)</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => sendTest('alert_template_warning_max', 'TEST: Avertissement Max')}
                                            disabled={testing === 'alert_template_warning_max'}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            {testing === 'alert_template_warning_max' ? 'Envoi...' : 'Tester'}
                                        </Button>
                                    </div>
                                    <Textarea
                                        rows={5}
                                        value={data.alert_template_warning_max}
                                        onChange={e => setData('alert_template_warning_max', e.target.value)}
                                    />
                                    {errors.alert_template_warning_max && <p className="text-sm text-red-500">{errors.alert_template_warning_max}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Avertissement Min (Dépassement seuil normal bas)</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => sendTest('alert_template_warning_min', 'TEST: Avertissement Min')}
                                            disabled={testing === 'alert_template_warning_min'}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            {testing === 'alert_template_warning_min' ? 'Envoi...' : 'Tester'}
                                        </Button>
                                    </div>
                                    <Textarea
                                        rows={5}
                                        value={data.alert_template_warning_min}
                                        onChange={e => setData('alert_template_warning_min', e.target.value)}
                                    />
                                    {errors.alert_template_warning_min && <p className="text-sm text-red-500">{errors.alert_template_warning_min}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
