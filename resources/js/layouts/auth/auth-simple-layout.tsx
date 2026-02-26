import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Brain, Shield, Zap } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLaravelReactI18n } from 'laravel-react-i18n';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { t } = useLaravelReactI18n();
    return (
        <div className="relative flex min-h-screen overflow-hidden">
            {/* Left side - Form */}
            <div className="relative z-10 flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
                {/* Language Switcher */}
                <div className="absolute right-6 top-6">
                    <LanguageSwitcher />
                </div>

                {/* Logo and Back Link */}
                <div className="mb-8">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
                            <Brain className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold">{t('AI Fault Detection')}</span>
                    </Link>
                </div>

                {/* Form Container */}
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8 space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>

                {/* Footer */}
                <div className="mt-auto pt-12 text-center text-xs text-muted-foreground">
                    <p>© 2025 AI Fault Detection. All rights reserved.</p>
                </div>
            </div>

            {/* Right side - Visual */}
            <div className="relative hidden w-1/2 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 lg:block">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse delay-1000" />
                    <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-500" />
                </div>

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-white">
                    <div className="max-w-md space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold leading-tight">
                                {t('Predict. Prevent. Protect.')}
                            </h2>
                            <p className="text-lg text-slate-300">
                                {t('Advanced AI-powered fault detection for medical equipment monitoring')}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            <FeatureItem
                                icon={<Brain className="h-5 w-5" />}
                                title={t('AI-Powered Analysis')}
                                description={t('Machine learning algorithms detect anomalies in real-time')}
                            />
                            <FeatureItem
                                icon={<Zap className="h-5 w-5" />}
                                title={t('Instant Alerts')}
                                description={t('Get notified immediately when issues are detected')}
                            />
                            <FeatureItem
                                icon={<Shield className="h-5 w-5" />}
                                title={t('Secure & Reliable')}
                                description={t('Enterprise-grade security for your sensitive data')}
                            />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <div className="text-center">
                                <div className="mb-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
                                    99.9%
                                </div>
                                <div className="text-xs text-slate-400">{t('Accuracy')}</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
                                    24/7
                                </div>
                                <div className="text-xs text-slate-400">{t('Monitoring')}</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
                                    50%
                                </div>
                                <div className="text-xs text-slate-400">{t('Less Downtime')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400">
                {icon}
            </div>
            <div>
                <h3 className="mb-1 font-semibold">{title}</h3>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
        </div>
    );
}
