import { Head, Link } from '@inertiajs/react';
import { Brain, ChevronLeft, Cpu, Activity, AlertTriangle, BarChart3, Wifi, BookOpen, Layers, Zap, Shield, Bell } from 'lucide-react';

interface SectionProps {
    id: string;
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

function Section({ id, icon, title, children }: SectionProps) {
    return (
        <section id={id} className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400">
                    {icon}
                </div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="space-y-4 text-slate-300 leading-relaxed">{children}</div>
        </section>
    );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold text-white/90">{title}</h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
    return (
        <div className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white">
                {number}
            </div>
            <div>
                <p className="font-medium text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-400">{description}</p>
            </div>
        </div>
    );
}

function InfoCard({ title, description, className = '' }: { title: string; description: string; className?: string }) {
    return (
        <div className={`rounded-lg border border-white/10 bg-white/[0.03] p-4 ${className}`}>
            <p className="font-medium text-white">{title}</p>
            <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
    );
}

function FieldTable({ fields }: { fields: { name: string; required: boolean; description: string }[] }) {
    return (
        <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/10 bg-white/[0.03]">
                        <th className="px-4 py-2 text-left font-medium text-white">Champ</th>
                        <th className="px-4 py-2 text-left font-medium text-white">Requis</th>
                        <th className="px-4 py-2 text-left font-medium text-white">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {fields.map((f) => (
                        <tr key={f.name}>
                            <td className="px-4 py-2 font-mono text-xs text-blue-300">{f.name}</td>
                            <td className="px-4 py-2">{f.required ? <span className="text-red-400">Oui</span> : <span className="text-slate-500">Non</span>}</td>
                            <td className="px-4 py-2 text-slate-400">{f.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const navItems = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'getting-started', label: 'Premiers pas' },
    { id: 'dashboard', label: 'Tableau de bord' },
    { id: 'devices', label: 'Appareils médicaux' },
    { id: 'sensors', label: 'Capteurs & données' },
    { id: 'predictions', label: 'Prédictions IA' },
    { id: 'providers', label: 'Fournisseurs IA' },
    { id: 'alerts', label: 'Alertes' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'esp32', label: 'Intégration ESP32' },
];

export default function Documentation() {
    return (
        <>
            <Head title="Documentation — Manuel d'utilisation" />

            <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="absolute bottom-0 -left-40 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

                <div className="relative z-10">
                    {/* Header */}
                    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
                        <div className="container mx-auto flex items-center justify-between px-6 py-4">
                            <Link href="/" className="flex items-center gap-3 text-white transition-colors hover:text-blue-400">
                                <ChevronLeft className="h-5 w-5" />
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
                                        <Brain className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="font-bold">AI Fault Detection</span>
                                </div>
                            </Link>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <BookOpen className="h-4 w-4" />
                                <span>Manuel d'utilisation</span>
                            </div>
                        </div>
                    </header>

                    <div className="container mx-auto px-6 py-10">
                        <div className="flex gap-10">
                            {/* Sidebar */}
                            <nav className="hidden w-56 shrink-0 lg:block">
                                <div className="sticky top-24 space-y-1">
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Sommaire</p>
                                    {navItems.map((item) => (
                                        <a key={item.id} href={`#${item.id}`} className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </nav>

                            {/* Main Content */}
                            <main className="min-w-0 max-w-3xl flex-1 space-y-16">
                                {/* Hero */}
                                <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-8 border border-blue-500/20">
                                    <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">📖 Manuel d'utilisation</h1>
                                    <p className="text-lg text-slate-300">
                                        Guide complet pour utiliser la plateforme <strong className="text-white">AI Fault Detection</strong> — système de maintenance prédictive pour équipements médicaux.
                                    </p>
                                </div>

                                {/* 1. Introduction */}
                                <Section id="introduction" icon={<Brain className="h-5 w-5" />} title="Introduction">
                                    <p>
                                        <strong className="text-white">AI Fault Detection</strong> est une plateforme de maintenance prédictive qui utilise l'intelligence artificielle pour surveiller vos équipements médicaux en temps réel. Elle collecte les données des capteurs via des modules ESP32, analyse les tendances et prédit les pannes potentielles avant qu'elles ne surviennent.
                                    </p>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <InfoCard title="🔍 Surveillance temps réel" description="Suivi continu des capteurs avec rafraîchissement automatique toutes les 5 à 10 secondes." />
                                        <InfoCard title="🤖 Prédictions IA" description="Algorithmes d'IA analysant les données pour évaluer la probabilité de panne de chaque appareil." />
                                        <InfoCard title="🔔 Alertes proactives" description="Notifications automatiques quand un capteur dépasse ses seuils de fonctionnement normaux." />
                                    </div>
                                </Section>

                                {/* 2. Premiers pas */}
                                <Section id="getting-started" icon={<Zap className="h-5 w-5" />} title="Premiers pas">
                                    <p>Pour commencer à utiliser la plateforme, suivez ces étapes dans l'ordre :</p>
                                    <div className="space-y-3">
                                        <Step number={1} title="Créer un compte" description="Rendez-vous sur la page d'accueil et cliquez sur « Commencer ». Renseignez votre nom complet, adresse email et un mot de passe sécurisé (minimum 8 caractères). Confirmez votre mot de passe puis validez." />
                                        <Step number={2} title="Se connecter" description="Saisissez votre email et mot de passe sur la page de connexion. Cochez « Se souvenir de moi » si souhaité. Vous serez redirigé vers le tableau de bord." />
                                        <Step number={3} title="Configurer un fournisseur IA" description="Avant de pouvoir générer des prédictions, vous devez configurer au moins un fournisseur IA. Allez dans « Fournisseurs IA » dans le menu latéral (voir section dédiée ci-dessous)." />
                                        <Step number={4} title="Ajouter un appareil médical" description="Depuis « Appareils Médicaux » dans le menu latéral, cliquez sur « Ajouter un appareil » et renseignez toutes les informations de l'équipement et de ses capteurs (voir section dédiée ci-dessous)." />
                                        <Step number={5} title="Connecter votre module ESP32" description="Programmez votre ESP32 avec l'identifiant de l'appareil (ESP32 Device ID) affiché sur la fiche de l'appareil pour commencer à envoyer des données capteurs (voir section ESP32)." />
                                        <Step number={6} title="Configurer les notifications" description="Allez dans « Paramètres > Notifications » pour définir l'email destinataire des alertes et personnaliser les modèles de messages (voir section Notifications)." />
                                        <Step number={7} title="Générer votre première prédiction" description="Une fois des données collectées par l'ESP32, allez dans « Prédictions » et cliquez sur « Générer » pour obtenir une analyse IA de l'état de l'équipement." />
                                    </div>
                                </Section>

                                {/* 3. Dashboard */}
                                <Section id="dashboard" icon={<BarChart3 className="h-5 w-5" />} title="Tableau de bord">
                                    <p>Le tableau de bord est votre vue d'ensemble. Il se rafraîchit automatiquement toutes les <strong className="text-white">10 secondes</strong>.</p>

                                    <SubSection title="Cartes de statistiques (en haut)">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <InfoCard title="Total des appareils" description="Nombre total d'appareils médicaux enregistrés dans le système, tous statuts confondus." />
                                            <InfoCard title="Appareils actifs" description="Nombre d'appareils dont le statut est « Actif » (ni inactif, ni en maintenance, ni défaillant)." />
                                            <InfoCard title="Alertes critiques" description="Nombre d'alertes de niveau « critique » non résolues, nécessitant une attention immédiate." />
                                            <InfoCard title="Prédictions du jour" description="Nombre de prédictions IA générées dans les dernières 24 heures." />
                                        </div>
                                    </SubSection>

                                    <SubSection title="Grille des appareils connectés">
                                        <p>Chaque appareil est affiché sous forme de carte avec son état de connexion en temps réel :</p>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <InfoCard title="🟢 Pastille verte animée" description="L'appareil est connecté — il a envoyé des données dans les 2 dernières minutes." />
                                            <InfoCard title="⚫ Pastille grise" description="L'appareil est déconnecté — aucune donnée reçue depuis plus de 2 minutes." />
                                        </div>
                                        <p className="text-sm text-slate-400">Chaque carte affiche : nom de l'appareil, modèle, emplacement, nombre de capteurs et temps écoulé depuis la dernière synchronisation. Cliquez sur une carte pour accéder à la page de détails.</p>
                                    </SubSection>
                                </Section>

                                {/* 4. Appareils médicaux */}
                                <Section id="devices" icon={<Cpu className="h-5 w-5" />} title="Appareils médicaux">
                                    <p>Cette section vous permet de gérer l'ensemble de vos équipements médicaux surveillés.</p>

                                    <SubSection title="Procédure : Ajouter un nouvel appareil">
                                        <div className="space-y-3">
                                            <Step number={1} title="Accéder au formulaire" description="Menu latéral → « Appareils Médicaux » → bouton « Ajouter un appareil » en haut à droite de la liste." />
                                            <Step number={2} title="Renseigner les informations générales" description="Remplissez tous les champs obligatoires du formulaire (voir tableau ci-dessous)." />
                                            <Step number={3} title="Ajouter les capteurs" description="Cliquez sur « Add Sensor » pour ajouter chaque capteur connecté à cet appareil. Vous pouvez en ajouter autant que nécessaire." />
                                            <Step number={4} title="Configurer chaque capteur" description="Pour chaque capteur, renseignez son nom, type, unité de mesure, numéro de pin ESP32, et les seuils de fonctionnement normal (min/max)." />
                                            <Step number={5} title="Enregistrer" description="Cliquez sur « Create Device ». L'appareil apparaît dans la liste et est prêt à recevoir des données de l'ESP32." />
                                        </div>
                                    </SubSection>

                                    <SubSection title="Champs du formulaire appareil">
                                        <FieldTable fields={[
                                            { name: 'Device Name', required: true, description: "Nom lisible de l'appareil (ex : « IRM Salle 3 », « Ventilateur B12 »)" },
                                            { name: 'Model', required: true, description: "Modèle de l'équipement (ex : « Siemens Magnetom Aera »)" },
                                            { name: 'Manufacturer', required: true, description: "Fabricant de l'équipement (ex : « Siemens », « GE Healthcare »)" },
                                            { name: 'Serial Number', required: true, description: "Numéro de série unique de l'appareil, utilisé pour l'identification" },
                                            { name: 'Installation Date', required: true, description: "Date à laquelle l'appareil a été installé (format JJ/MM/AAAA)" },
                                            { name: 'Location', required: true, description: "Emplacement physique de l'appareil (ex : « Bâtiment A, Salle 204 »)" },
                                            { name: 'Status', required: true, description: "État actuel : Active (en service), Inactive (arrêté), Maintenance (en cours de réparation), Faulty (défaillant)" },
                                            { name: 'ESP32 Device ID', required: false, description: "Identifiant unique du module ESP32 relié à cet appareil. C'est cette valeur que l'ESP32 envoie dans le champ « device_id » de ses requêtes API." },
                                            { name: 'Description', required: false, description: "Notes ou description libre pour apporter du contexte supplémentaire sur l'appareil" },
                                        ]} />
                                    </SubSection>

                                    <SubSection title="Page de détail d'un appareil">
                                        <p>En cliquant sur un appareil, vous accédez à sa page de détails qui comporte :</p>
                                        <div className="space-y-3">
                                            <InfoCard title="📡 Indicateur de connexion" description="En haut de la page, une pastille animée verte (connecté) ou grise (déconnecté) indique si l'ESP32 envoie actuellement des données." />
                                            <InfoCard title="📊 Cartes de lecture en direct" description="Grille affichant chaque capteur avec : dernière valeur lue (grand chiffre), badge de statut coloré (NORMAL vert / WARNING orange / CRITICAL rouge), plage de fonctionnement min-max, et temps depuis la dernière mesure. Rafraîchissement toutes les 5 secondes." />
                                            <InfoCard title="📈 Graphe interactif (Recharts)" description="Graphe multi-courbes des 50 dernières lectures. Cochez/décochez les checkboxes pour afficher ou masquer chaque capteur. Survolez le graphe pour voir un tooltip détaillé avec les valeurs exactes." />
                                            <InfoCard title="🔮 Onglet Prédictions" description="Les 5 dernières prédictions IA avec probabilité de panne, niveau de risque et lien vers le rapport complet." />
                                            <InfoCard title="🚨 Onglet Alertes" description="Les 5 dernières alertes avec sévérité (critique/avertissement/info) et message descriptif." />
                                            <InfoCard title="📋 Onglet Détails" description="Informations complètes de l'appareil : fabricant, modèle, numéro de série, emplacement, date d'installation, ESP32 Device ID." />
                                        </div>
                                    </SubSection>
                                </Section>

                                {/* 5. Capteurs */}
                                <Section id="sensors" icon={<Activity className="h-5 w-5" />} title="Capteurs & données temps réel">
                                    <p>Les capteurs sont les composants fondamentaux du système. Ils sont créés lors de l'ajout d'un appareil et reçoivent les données envoyées par l'ESP32.</p>

                                    <SubSection title="Champs de configuration d'un capteur">
                                        <FieldTable fields={[
                                            { name: 'Sensor Name', required: true, description: "Nom descriptif du capteur (ex : « Température moteur », « Vibration compresseur »)" },
                                            { name: 'Type', required: true, description: "Catégorie du capteur. Options : Temperature, Humidity, Pressure, Vibration, Voltage, Current, Other" },
                                            { name: 'Unit', required: true, description: "Unité de mesure (ex : °C, %, Pa, mm/s, V, A). Affichée à côté des valeurs dans toute l'interface." },
                                            { name: 'Pin Number (ESP32)', required: false, description: "Numéro de la broche GPIO sur l'ESP32 à laquelle le capteur est connecté (ex : 34, 35, 36). Informatif." },
                                            { name: 'Min Normal Value', required: false, description: "Seuil minimum de fonctionnement normal. Toute lecture en dessous déclenche une alerte (ex : 20 pour une température en °C)." },
                                            { name: 'Max Normal Value', required: false, description: "Seuil maximum de fonctionnement normal. Toute lecture au-dessus déclenche une alerte (ex : 40 pour une température en °C)." },
                                        ]} />
                                    </SubSection>

                                    <SubSection title="Types de capteurs supportés">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <InfoCard title="🌡️ Temperature" description="Mesure de la température en °C — détecte les surchauffes ou refroidissements anormaux des composants." />
                                            <InfoCard title="💧 Humidity" description="Mesure de l'humidité en % — surveille les conditions ambiantes critiques pour certains équipements." />
                                            <InfoCard title="🔵 Pressure" description="Mesure de la pression en Pa ou bar — détecte les anomalies de pression dans les circuits." />
                                            <InfoCard title="📳 Vibration" description="Mesure des vibrations en mm/s — détecte les déséquilibres mécaniques ou usures de roulements." />
                                            <InfoCard title="⚡ Voltage" description="Mesure de la tension en V — détecte les surtensions ou sous-tensions d'alimentation." />
                                            <InfoCard title="🔌 Current" description="Mesure du courant en A — détecte les surconsommations ou courts-circuits." />
                                        </div>
                                    </SubSection>

                                    <SubSection title="Fonctionnement des seuils">
                                        <p>
                                            Quand vous définissez les valeurs <strong className="text-white">Min Normal Value</strong> et <strong className="text-white">Max Normal Value</strong>, le système surveille automatiquement chaque lecture :
                                        </p>
                                        <ul className="list-inside list-disc space-y-2 text-slate-400">
                                            <li><strong className="text-white">NORMAL</strong> — La valeur est entre Min et Max → badge vert</li>
                                            <li><strong className="text-white">WARNING</strong> — La valeur approche les limites → badge orange</li>
                                            <li><strong className="text-white">CRITICAL</strong> — La valeur dépasse Min ou Max → badge rouge + alerte créée automatiquement</li>
                                        </ul>
                                    </SubSection>
                                </Section>

                                {/* 6. Prédictions IA */}
                                <Section id="predictions" icon={<Layers className="h-5 w-5" />} title="Prédictions IA">
                                    <p>Le module de prédiction utilise l'intelligence artificielle pour analyser les données historiques de vos capteurs et évaluer le risque de panne.</p>

                                    <SubSection title="Procédure : Générer une prédiction">
                                        <div className="space-y-3">
                                            <Step number={1} title="Accéder au formulaire" description="Menu latéral → « Prédictions » → bouton « Générer » en haut à droite." />
                                            <Step number={2} title="Sélectionner l'appareil" description="Dans le menu déroulant « Medical Device », choisissez l'appareil à analyser. Le nom et le numéro de série sont affichés pour chaque appareil." />
                                            <Step number={3} title="Choisir le fournisseur IA" description="Dans « AI Provider », sélectionnez le fournisseur d'IA à utiliser. Le nom et le type (openrouter, ollama, mock) s'affichent pour chaque option." />
                                            <Step number={4} title="Définir la période d'analyse" description="Dans « Analysis Period », choisissez la fenêtre de temps : 7 jours, 30 jours (par défaut), 3 mois, 6 mois ou 1 an. Plus la période est longue, plus l'analyse est complète mais nécessite des données." />
                                            <Step number={5} title="Lancer l'analyse" description="Cliquez sur « Generate Analysis ». Un indicateur de chargement s'affiche. L'IA va analyser toutes les lectures de capteurs sur la période sélectionnée." />
                                            <Step number={6} title="Consulter le résultat" description="Vous êtes redirigé vers le rapport de prédiction avec tous les détails de l'analyse." />
                                        </div>
                                    </SubSection>

                                    <SubSection title="Contenu d'un rapport de prédiction">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <InfoCard title="📊 Probabilité de panne" description="Pourcentage de 0 à 100% indiquant le risque de défaillance. Basé sur les tendances, les violations de seuils et les schémas de dégradation." />
                                            <InfoCard title="🎯 Niveau de risque" description="Évaluation qualitative : Low (faible), Medium (moyen), High (élevé), Critical (critique). Déterminé par les règles automatiques et l'analyse IA." />
                                            <InfoCard title="📝 Analyse détaillée" description="Rapport complet en français de 3-4 paragraphes : état de chaque capteur, anomalies détectées, raisonnement du risque, urgence de la maintenance." />
                                            <InfoCard title="✅ Recommandations" description="Au moins 3 actions de maintenance concrètes et actionnables, expliquant quoi faire et pourquoi." />
                                            <InfoCard title="🎯 Score de confiance" description="Indique la fiabilité de la prédiction (0-100%). Dépend de la quantité et de la qualité des données disponibles." />
                                        </div>
                                    </SubSection>

                                    <SubSection title="Règles automatiques du système">
                                        <ul className="list-inside list-disc space-y-2 text-slate-400">
                                            <li>Si des <strong className="text-white">violations de seuils</strong> sont détectées → le risque est au minimum « Medium »</li>
                                            <li>Si la <strong className="text-white">dernière valeur</strong> d'un capteur est hors plage → le risque est « High » ou « Critical »</li>
                                            <li>Si la <strong className="text-white">tendance</strong> montre une augmentation/diminution rapide vers les limites → la probabilité est augmentée</li>
                                        </ul>
                                    </SubSection>
                                </Section>

                                {/* 7. Fournisseurs IA */}
                                <Section id="providers" icon={<Shield className="h-5 w-5" />} title="Fournisseurs IA">
                                    <p>Les fournisseurs IA sont les moteurs d'intelligence artificielle utilisés pour analyser les données et produire les prédictions. Vous pouvez en configurer plusieurs et choisir lequel utiliser pour chaque prédiction.</p>

                                    <SubSection title="Types de fournisseurs disponibles">
                                        <div className="space-y-3">
                                            <InfoCard title="☁️ OpenRouter" description="Service cloud qui donne accès à des modèles LLM puissants (GPT-4, Claude, Llama, Mistral, etc.). Nécessite une clé API obtenue sur openrouter.ai. Idéal pour des prédictions de haute qualité. Coût variable selon le modèle choisi." />
                                            <InfoCard title="🖥️ Ollama" description="Exécution locale de modèles IA sur votre propre serveur. Aucune donnée ne quitte votre réseau — parfait pour la confidentialité des données médicales. Nécessite l'installation d'Ollama et le téléchargement d'un modèle (ex : llama3, mistral)." />
                                            <InfoCard title="🧪 Mock (Test)" description="Fournisseur simulé qui génère des résultats réalistes sans appeler un vrai modèle IA. Idéal pour les démonstrations, les tests et le développement. Aucune configuration requise." />
                                        </div>
                                    </SubSection>

                                    <SubSection title="Procédure : Configurer un fournisseur OpenRouter">
                                        <div className="space-y-3">
                                            <Step number={1} title="Accéder au formulaire" description="Menu latéral → « Fournisseurs IA » → bouton « Ajouter un fournisseur »." />
                                            <Step number={2} title="Informations de base" description="Renseignez un nom descriptif (ex : « OpenRouter GPT-4o ») et sélectionnez le type « openrouter »." />
                                            <Step number={3} title="Clé API" description="Entrez votre clé API OpenRouter. Pour en obtenir une : allez sur openrouter.ai, créez un compte, puis générez une clé dans Settings → API Keys." />
                                            <Step number={4} title="Modèle" description="Entrez l'identifiant du modèle souhaité (ex : « openai/gpt-4o », « anthropic/claude-3.5-sonnet », « meta-llama/llama-3-70b »). La liste complète est disponible sur openrouter.ai/models." />
                                            <Step number={5} title="Endpoint (URL)" description="Laissez la valeur par défaut « https://openrouter.ai/api/v1 » sauf si vous utilisez un proxy." />
                                            <Step number={6} title="Tester la connexion" description="Cliquez sur « Tester la connexion » pour vérifier que la clé API et le modèle fonctionnent correctement. Un message de succès ou d'erreur s'affichera." />
                                            <Step number={7} title="Enregistrer" description="Cliquez sur « Enregistrer ». Le fournisseur est prêt à être utilisé pour les prédictions." />
                                        </div>
                                    </SubSection>

                                    <SubSection title="Procédure : Configurer un fournisseur Ollama">
                                        <div className="space-y-3">
                                            <Step number={1} title="Installer Ollama" description="Téléchargez et installez Ollama depuis ollama.com. Une fois installé, lancez le service avec la commande « ollama serve »." />
                                            <Step number={2} title="Télécharger un modèle" description="Dans un terminal, exécutez : « ollama pull llama3 » (ou un autre modèle). Attendez la fin du téléchargement." />
                                            <Step number={3} title="Configurer dans la plateforme" description="Créez un nouveau fournisseur avec le type « ollama ». Nom : « Ollama Llama3 ». Endpoint : « http://localhost:11434 ». Modèle : « llama3 »." />
                                            <Step number={4} title="Tester" description="Cliquez sur « Tester la connexion ». Assurez-vous qu'Ollama est en cours d'exécution sur le serveur." />
                                        </div>
                                    </SubSection>

                                    <SubSection title="Champs du formulaire fournisseur">
                                        <FieldTable fields={[
                                            { name: 'Name', required: true, description: "Nom descriptif du fournisseur (ex : « GPT-4o Production », « Ollama Local »)" },
                                            { name: 'Type', required: true, description: "Type de fournisseur : openrouter (cloud), ollama (local), mock (test)" },
                                            { name: 'Active', required: true, description: "Si activé, ce fournisseur apparaît dans la liste de sélection lors de la génération de prédictions" },
                                            { name: 'Priority', required: true, description: "Ordre de priorité (1 = plus haute priorité). Détermine l'ordre d'affichage dans les listes" },
                                            { name: 'API Key', required: false, description: "Clé d'authentification API (obligatoire pour OpenRouter, non nécessaire pour Ollama et Mock)" },
                                            { name: 'Endpoint', required: false, description: "URL de l'API. OpenRouter : https://openrouter.ai/api/v1 — Ollama : http://localhost:11434" },
                                            { name: 'Model', required: false, description: "Identifiant du modèle IA à utiliser (ex : openai/gpt-4o, llama3, mistral)" },
                                            { name: 'Additional Params', required: false, description: "Paramètres JSON supplémentaires envoyés à l'API (utilisation avancée)" },
                                        ]} />
                                    </SubSection>
                                </Section>

                                {/* 8. Alertes */}
                                <Section id="alerts" icon={<AlertTriangle className="h-5 w-5" />} title="Alertes">
                                    <p>Le système d'alertes surveille automatiquement chaque lecture de capteur et génère des alertes quand une valeur dépasse les seuils configurés.</p>

                                    <SubSection title="Niveaux de sévérité">
                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <InfoCard title="🔵 Information" description="Événement de routine ne nécessitant pas d'action immédiate. Enregistré pour traçabilité." className="border-blue-500/20" />
                                            <InfoCard title="🟠 Avertissement" description="Valeur proche des limites de fonctionnement. Surveillance accrue recommandée. Emails d'avertissement envoyés." className="border-orange-500/20" />
                                            <InfoCard title="🔴 Critique" description="Valeur hors des limites — intervention immédiate requise. Email d'alerte critique envoyé automatiquement." className="border-red-500/20" />
                                        </div>
                                    </SubSection>

                                    <SubSection title="Fonctionnement automatique">
                                        <ul className="list-inside list-disc space-y-2 text-slate-400">
                                            <li>À chaque réception de données ESP32, le système compare les valeurs aux seuils Min/Max de chaque capteur</li>
                                            <li>Si une valeur <strong className="text-white">dépasse le seuil max</strong> ou <strong className="text-white">passe sous le seuil min</strong>, une alerte est automatiquement créée</li>
                                            <li>Si les notifications email sont configurées, un email est envoyé avec le modèle de message correspondant</li>
                                            <li>Les alertes sont visibles dans le menu « Alertes » et sur la page de détail de chaque appareil</li>
                                        </ul>
                                    </SubSection>
                                </Section>

                                {/* 9. Notifications */}
                                <Section id="notifications" icon={<Bell className="h-5 w-5" />} title="Notifications">
                                    <p>Le système de notifications vous avertit par email et dans l'interface quand des événements importants surviennent.</p>

                                    <SubSection title="Procédure : Configurer les notifications email">
                                        <div className="space-y-3">
                                            <Step number={1} title="Accéder aux paramètres" description="Menu latéral → « Paramètres » → « Notifications »." />
                                            <Step number={2} title="Définir l'email destinataire" description="Dans le champ « Email », saisissez l'adresse qui recevra toutes les alertes. Peut être une adresse personnelle ou un groupe de distribution." />
                                            <Step number={3} title="Personnaliser les modèles de messages" description="Quatre modèles sont disponibles, un pour chaque type d'alerte. Modifiez le texte selon vos besoins en utilisant les variables dynamiques." />
                                            <Step number={4} title="Tester chaque modèle" description="Cliquez sur le bouton « Tester » à côté de chaque modèle pour envoyer un email de test à l'adresse configurée et vérifier le bon fonctionnement." />
                                            <Step number={5} title="Enregistrer" description="Cliquez sur « Enregistrer les modifications » pour sauvegarder votre configuration." />
                                        </div>
                                    </SubSection>

                                    <SubSection title="Modèles de messages disponibles">
                                        <FieldTable fields={[
                                            { name: 'Critique Max', required: false, description: "Message envoyé quand une valeur dépasse le seuil maximum critique (ex : température trop élevée)" },
                                            { name: 'Critique Min', required: false, description: "Message envoyé quand une valeur passe sous le seuil minimum critique (ex : tension trop basse)" },
                                            { name: 'Avertissement Max', required: false, description: "Message envoyé quand une valeur dépasse le seuil maximum normal mais n'est pas encore critique" },
                                            { name: 'Avertissement Min', required: false, description: "Message envoyé quand une valeur passe sous le seuil minimum normal mais n'est pas encore critique" },
                                        ]} />
                                    </SubSection>

                                    <SubSection title="Variables dynamiques pour les modèles">
                                        <p>Utilisez ces variables dans vos modèles de messages. Elles seront remplacées par les valeurs réelles au moment de l'envoi :</p>
                                        <div className="overflow-hidden rounded-lg border border-white/10">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-white/10 bg-white/[0.03]">
                                                        <th className="px-4 py-2 text-left font-medium text-white">Variable</th>
                                                        <th className="px-4 py-2 text-left font-medium text-white">Remplacée par</th>
                                                        <th className="px-4 py-2 text-left font-medium text-white">Exemple</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {[
                                                        ['{sensor}', 'Nom du capteur', 'Température moteur'],
                                                        ['{value}', 'Valeur mesurée', '85.3'],
                                                        ['{unit}', 'Unité de mesure', '°C'],
                                                        ['{threshold}', 'Valeur du seuil dépassé', '40'],
                                                        ['{time}', "Heure de la lecture", '2025-02-20 14:30:00'],
                                                        ['{equipment}', "Nom de l'équipement", 'IRM Salle 3'],
                                                    ].map(([variable, desc, example]) => (
                                                        <tr key={variable}>
                                                            <td className="px-4 py-2 font-mono text-xs text-blue-300">{variable}</td>
                                                            <td className="px-4 py-2 text-slate-400">{desc}</td>
                                                            <td className="px-4 py-2 text-slate-500 italic">{example}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </SubSection>

                                    <SubSection title="Notifications dans l'interface">
                                        <p>En plus des emails, les notifications sont accessibles via la <strong className="text-white">cloche 🔔</strong> dans la barre supérieure :</p>
                                        <ul className="list-inside list-disc space-y-2 text-slate-400">
                                            <li>Un <strong className="text-white">badge rouge</strong> indique le nombre de notifications non lues</li>
                                            <li>Cliquez sur la cloche pour voir la liste des notifications récentes</li>
                                            <li>Cliquez sur « Marquer comme lu » sur une notification ou « Tout marquer comme lu »</li>
                                        </ul>
                                    </SubSection>
                                </Section>

                                {/* 10. ESP32 */}
                                <Section id="esp32" icon={<Wifi className="h-5 w-5" />} title="Intégration ESP32">
                                    <p>Les modules ESP32 sont les passerelles matérielles qui collectent les données physiques de vos capteurs et les transmettent à la plateforme via l'API REST.</p>

                                    <SubSection title="Procédure : Configurer l'ESP32">
                                        <div className="space-y-3">
                                            <Step number={1} title="Récupérer l'ESP32 Device ID" description="Allez sur la page de détails de l'appareil médical dans la plateforme. Copiez la valeur du champ « ESP32 Device ID ». C'est cette valeur que l'ESP32 enverra pour s'identifier." />
                                            <Step number={2} title="Configurer le WiFi" description="Dans le code Arduino/PlatformIO de l'ESP32, renseignez le SSID et le mot de passe de votre réseau WiFi pour que le module puisse se connecter à Internet." />
                                            <Step number={3} title="Configurer l'URL du serveur" description="Définissez l'URL de votre serveur dans le code ESP32. En développement : http://IP_DE_VOTRE_PC:8000/api/esp32/data — En production : https://votre-domaine.com/api/esp32/data" />
                                            <Step number={4} title="Programmer les lectures" description="Configurez la boucle de lecture pour lire les capteurs et envoyer les données toutes les 30 secondes (recommandé). Adaptez la fréquence selon vos besoins." />
                                            <Step number={5} title="Flasher et tester" description="Téléversez le programme sur l'ESP32. Ouvrez le moniteur série pour vérifier les logs. Sur la plateforme, la pastille de connexion devrait passer au vert." />
                                        </div>
                                    </SubSection>

                                    <SubSection title="Format de l'API (endpoint)">
                                        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 font-mono text-sm">
                                            <p className="text-slate-400 mb-1">POST /api/esp32/data</p>
                                            <p className="text-slate-400 mb-3">Content-Type: application/json</p>
                                            <pre className="text-blue-300">{`{
  "device_id": "votre_esp32_device_id",
  "sensors": [
    {
      "type": "temperature",
      "value": 36.5
    },
    {
      "type": "vibration",
      "value": 2.3
    },
    {
      "type": "voltage",
      "value": 220.5
    }
  ]
}`}</pre>
                                        </div>
                                    </SubSection>

                                    <SubSection title="Détails des champs API">
                                        <FieldTable fields={[
                                            { name: 'device_id', required: true, description: "L'ESP32 Device ID configuré dans la plateforme. Doit correspondre exactement." },
                                            { name: 'sensors', required: true, description: "Tableau contenant les données de chaque capteur." },
                                            { name: 'sensors[].type', required: true, description: "Type du capteur (temperature, humidity, pressure, vibration, voltage, current). Doit correspondre au type configuré dans la plateforme." },
                                            { name: 'sensors[].value', required: true, description: "Valeur numérique lue par le capteur (nombre décimal)." },
                                        ]} />
                                    </SubSection>

                                    <SubSection title="Bonnes pratiques">
                                        <ul className="list-inside list-disc space-y-2 text-slate-400">
                                            <li><strong className="text-white">Fréquence d'envoi</strong> — Envoyez les données toutes les 30 secondes pour un bon compromis entre réactivité et charge serveur</li>
                                            <li><strong className="text-white">Gestion des erreurs</strong> — Implémentez une logique de retry en cas d'échec de connexion au serveur</li>
                                            <li><strong className="text-white">Watchdog</strong> — Activez le watchdog timer de l'ESP32 pour redémarrer automatiquement en cas de blocage</li>
                                            <li><strong className="text-white">LED de statut</strong> — Utilisez une LED pour indiquer visuellement l'état de connexion WiFi et l'envoi des données</li>
                                            <li><strong className="text-white">last_sync_at</strong> — À chaque requête réussie, la plateforme met automatiquement à jour ce champ, qui détermine l'état connecté/déconnecté</li>
                                        </ul>
                                    </SubSection>
                                </Section>

                                {/* Footer */}
                                <div className="border-t border-white/10 pt-8 text-center text-sm text-slate-500">
                                    <p>© 2025 AI Fault Detection — Manuel d'utilisation v1.0</p>
                                    <Link href="/" className="mt-2 inline-block text-blue-400 hover:text-blue-300">← Retour à l'accueil</Link>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
