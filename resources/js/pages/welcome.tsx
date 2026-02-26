import { dashboard, login, register } from '@/routes';
import { documentation } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, BookOpen, Brain, ChevronRight, LineChart, Shield, Zap } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useLaravelReactI18n();

    return (
        <>
            <Head title={t('Welcome')}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Background avec gradient animé */}
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse delay-1000" />
                    <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-500" />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

                <div className="relative z-10 flex min-h-screen flex-col">
                    {/* Header */}
                    <header className="container mx-auto px-6 py-6">
                        <nav className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
                                    <Brain className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">
                                    {t('AI Fault Detection')}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <LanguageSwitcher />
                                <Link
                                    href={documentation()}
                                    className="flex items-center gap-1.5 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    {t('Documentation')}
                                </Link>
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/60"
                                    >
                                        <span className="relative z-10">{t('Dashboard')}</span>
                                        <ChevronRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 transition-opacity group-hover:opacity-100" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                                        >
                                            {t('Log in')}
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/60"
                                            >
                                                <span className="relative z-10">{t('Get Started')}</span>
                                                <ChevronRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 transition-opacity group-hover:opacity-100" />
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </nav>
                    </header>

                    {/* Hero Section */}
                    <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 backdrop-blur-sm">
                            <Zap className="h-4 w-4" />
                            <span>{t('Powered by Advanced AI Technology')}</span>
                        </div>

                        <h1 className="mb-6 max-w-4xl bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-7xl">
                            {t('Predict Equipment Failures Before They Happen')}
                        </h1>

                        <p className="mb-12 max-w-2xl text-lg text-slate-300 md:text-xl">
                            {t('Harness the power of artificial intelligence to monitor your medical devices in real-time, predict potential failures, and prevent costly downtime.')}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {!auth.user && (
                                <>
                                    <Link
                                        href={register()}
                                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-blue-500/50 transition-all hover:shadow-blue-500/60"
                                    >
                                        <span className="relative z-10">{t('Start Free Trial')}</span>
                                        <ChevronRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 transition-opacity group-hover:opacity-100" />
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                                    >
                                        {t('Watch Demo')}
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="mt-24 grid gap-6 md:grid-cols-3">
                            <FeatureCard
                                icon={<Brain className="h-8 w-8" />}
                                title={t('AI-Powered Predictions')}
                                description={t('Advanced machine learning algorithms analyze patterns to predict failures with high accuracy')}
                                gradient="from-blue-500/10 to-cyan-500/10"
                                borderGradient="from-blue-500/50 to-cyan-500/50"
                            />
                            <FeatureCard
                                icon={<Activity className="h-8 w-8" />}
                                title={t('Real-Time Monitoring')}
                                description={t('Continuous sensor data collection and analysis for instant anomaly detection')}
                                gradient="from-purple-500/10 to-pink-500/10"
                                borderGradient="from-purple-500/50 to-pink-500/50"
                            />
                            <FeatureCard
                                icon={<LineChart className="h-8 w-8" />}
                                title={t('Predictive Analytics')}
                                description={t('Comprehensive dashboards with insights and actionable recommendations')}
                                gradient="from-cyan-500/10 to-blue-500/10"
                                borderGradient="from-cyan-500/50 to-blue-500/50"
                            />
                        </div>

                        {/* Stats */}
                        <div className="mt-24 grid gap-8 md:grid-cols-3">
                            <StatCard number="99.9%" label={t('Prediction Accuracy')} />
                            <StatCard number="50%" label={t('Downtime Reduction')} />
                            <StatCard number="24/7" label={t('Monitoring')} />
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="container mx-auto border-t border-white/10 px-6 py-6 text-center text-sm text-slate-400">
                        <p>© 2025 AI Fault Detection. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </>
    );
}

function FeatureCard({
    icon,
    title,
    description,
    gradient,
    borderGradient,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
    borderGradient: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm transition-all hover:scale-105">
            {/* Gradient border */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${borderGradient} opacity-0 transition-opacity group-hover:opacity-100`} />
            <div className="absolute inset-[1px] rounded-2xl bg-slate-950/90" />

            {/* Content */}
            <div className="relative z-10">
                <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${gradient} p-3 text-white`}>
                    {icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
        </div>
    );
}

function StatCard({ number, label }: { number: string; label: string }) {
    return (
        <div className="rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm">
            <div className="mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                {number}
            </div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    );
}
