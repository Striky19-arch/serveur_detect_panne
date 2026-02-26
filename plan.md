# Feuille de Route - Application de Prédiction de Pannes Matériel Médical

## Vue d'ensemble du Projet

**Objectif** : Développer une application web permettant de prédire les pannes futures sur du matériel médical à partir de données collectées par des capteurs ESP32, en utilisant différents providers d'IA (Cloud API, LLM Local, Modèles Python).

**Stack Technologique** :
- Backend: Laravel 12 (PHP 8.2+)
- Frontend: Vue.js 3 + TypeScript + Inertia.js 2.0
- UI: Tailwind CSS 4 + Composants UI Shadcn/Vue
- Build: Vite 7
- Authentification: Laravel Fortify

---

## Phase 1: Modélisation de la Base de Données et Architecture

### 1.1 Conception du Schéma de Base de Données

**Créer les migrations Laravel pour les tables suivantes** :

#### Table `medical_devices` (Appareils médicaux)
- `id` (PK)
- `name` (string, unique)
- `model` (string)
- `manufacturer` (string)
- `serial_number` (string, unique)
- `installation_date` (date)
- `location` (string)
- `status` (enum: active, inactive, maintenance, faulty)
- `description` (text, nullable)
- `esp32_device_id` (string, unique, nullable) - ID de l'ESP32 associé
- `last_sync_at` (timestamp, nullable)
- `created_at`, `updated_at`

#### Table `sensors` (Capteurs)
- `id` (PK)
- `medical_device_id` (FK → medical_devices)
- `name` (string)
- `type` (enum: temperature, pressure, vibration, humidity, current, voltage, etc.)
- `unit` (string) - ex: °C, Pa, Hz, %, A, V
- `min_normal_value` (decimal, nullable)
- `max_normal_value` (decimal, nullable)
- `critical_min_value` (decimal, nullable)
- `critical_max_value` (decimal, nullable)
- `is_active` (boolean, default: true)
- `pin_number` (integer) - Pin de l'ESP32
- `polling_interval` (integer) - Intervalle de lecture en secondes
- `description` (text, nullable)
- `created_at`, `updated_at`

#### Table `sensor_readings` (Relevés de capteurs)
- `id` (PK)
- `sensor_id` (FK → sensors)
- `value` (decimal)
- `status` (enum: normal, warning, critical)
- `recorded_at` (timestamp) - Moment du relevé
- `created_at`
- **Index** : `sensor_id`, `recorded_at` pour optimiser les requêtes de séries temporelles

#### Table `prediction_providers` (Fournisseurs de prédiction)
- `id` (PK)
- `name` (string, unique)
- `type` (enum: cloud_api, local_llm, python_model)
- `provider` (string) - ex: openrouter, huggingface, ollama, llm_studio, custom
- `is_active` (boolean, default: false)
- `is_default` (boolean, default: false)
- `priority` (integer, default: 0) - Ordre de tentative en cas d'échec
- `config` (json) - Configuration spécifique (API keys, endpoints, modèles)
- `last_tested_at` (timestamp, nullable)
- `last_test_status` (enum: success, failed, null)
- `last_test_response_time` (integer, nullable) - En ms
- `created_at`, `updated_at`

#### Table `predictions` (Prédictions)
- `id` (PK)
- `medical_device_id` (FK → medical_devices)
- `provider_id` (FK → prediction_providers)
- `analysis_period_start` (timestamp) - Début de la période analysée
- `analysis_period_end` (timestamp) - Fin de la période analysée
- `prediction_result` (json) - Résultat complet de la prédiction
- `failure_probability` (decimal) - Probabilité de panne (0-100)
- `predicted_failure_date` (timestamp, nullable)
- `risk_level` (enum: low, medium, high, critical)
- `recommendations` (json) - Actions recommandées
- `confidence_score` (decimal, nullable) - Score de confiance (0-100)
- `generation_time` (integer) - Temps de génération en ms
- `created_at`

#### Table `alerts` (Alertes)
- `id` (PK)
- `medical_device_id` (FK → medical_devices)
- `sensor_id` (FK → sensors, nullable)
- `prediction_id` (FK → predictions, nullable)
- `type` (enum: sensor_critical, sensor_warning, prediction_high_risk, device_offline)
- `severity` (enum: info, warning, critical)
- `title` (string)
- `message` (text)
- `is_read` (boolean, default: false)
- `acknowledged_by` (FK → users, nullable)
- `acknowledged_at` (timestamp, nullable)
- `created_at`

### 1.2 Créer les Modèles Eloquent
- Créer les modèles avec relations appropriées
- Définir les casts (json, enum, dates)
- Créer les accessors/mutators si nécessaire
- Implémenter les scopes utiles (active, recent, critical, etc.)

### 1.3 Seeders et Factories
- Créer des factories pour chaque modèle
- Créer un seeder de démonstration avec :
  - 5-10 appareils médicaux
  - 3-5 capteurs par appareil
  - Données historiques de relevés (30 derniers jours)
  - 2-3 providers configurés

---

## Phase 2: Backend - API et Logique Métier

### 2.1 Ressources et Contrôleurs API

**Créer les contrôleurs suivants** :

#### `MedicalDeviceController`
- `index()` - Liste des appareils avec pagination et filtres
- `store()` - Créer un appareil
- `show($id)` - Détails d'un appareil avec capteurs et statistiques
- `update($id)` - Modifier un appareil
- `destroy($id)` - Supprimer un appareil (soft delete recommandé)
- `syncStatus()` - Vérifier l'état de synchronisation ESP32

#### `SensorController`
- `index($deviceId)` - Liste des capteurs d'un appareil
- `store($deviceId)` - Ajouter un capteur à un appareil
- `update($id)` - Modifier configuration capteur
- `destroy($id)` - Supprimer un capteur
- `activate($id)` - Activer/désactiver un capteur
- `testReading($id)` - Test de lecture capteur

#### `SensorReadingController`
- `index($sensorId)` - Historique des relevés (avec pagination et filtrage par date)
- `store()` - **Route publique pour ESP32** (authentification via token)
- `bulkStore()` - Import de plusieurs relevés simultanément
- `stats($sensorId)` - Statistiques (min, max, moyenne, écart-type)
- `chart($sensorId)` - Données formatées pour graphiques

#### `PredictionProviderController`
- `index()` - Liste des providers configurés
- `store()` - Créer un provider
- `update($id)` - Modifier configuration provider
- `destroy($id)` - Supprimer provider
- `test($id)` - Tester la connexion et réponse du provider
- `setDefault($id)` - Définir provider par défaut
- `reorderPriority()` - Réorganiser l'ordre de priorité

#### `PredictionController`
- `index($deviceId)` - Historique des prédictions pour un appareil
- `generate($deviceId)` - Générer une nouvelle prédiction
- `show($id)` - Détails d'une prédiction
- `regenerate($id)` - Régénérer avec un autre provider
- `compare($deviceId)` - Comparer prédictions de différents providers

#### `AlertController`
- `index()` - Liste des alertes (filtres: read/unread, severity)
- `markAsRead($id)` - Marquer comme lu
- `acknowledge($id)` - Accuser réception
- `dismiss($id)` - Ignorer une alerte

### 2.2 Services Métier

**Créer les services suivants dans `app/Services`** :

#### `PredictionService`
- `generatePrediction(MedicalDevice $device, ?PredictionProvider $provider)` - Orchestrer la génération
- `gatherAnalysisData(MedicalDevice $device, $period)` - Collecter et formater les données
- `callProvider(PredictionProvider $provider, array $data)` - Appeler le provider
- `parseResponse($rawResponse, $provider)` - Parser la réponse
- `storePrediction(...)` - Enregistrer la prédiction

#### `ProviderAdapterService`
- `getAdapter(PredictionProvider $provider)` - Factory pour adapter
- Interface `ProviderAdapterInterface` :
  - `test()` - Tester la connexion
  - `predict(array $data)` - Générer prédiction
  - `validateConfig(array $config)` - Valider config

**Implémenter des adapters concrets** :
- `OpenRouterAdapter`
- `HuggingFaceAdapter`
- `OllamaAdapter`
- `LLMStudioAdapter`
- `PythonModelAdapter` (communication via HTTP ou script)

#### `AlertService`
- `checkSensorThresholds(SensorReading $reading)` - Vérifier seuils
- `createAlert(...)` - Créer alerte
- `checkDeviceStatus(MedicalDevice $device)` - Vérifier connectivité
- `checkPredictionRisk(Prediction $prediction)` - Vérifier niveau de risque

#### `ESP32Service`
- `validateToken(string $token)` - Authentifier ESP32
- `processIncomingData(array $data)` - Traiter données reçues
- `getDeviceConfig(string $esp32DeviceId)` - Config pour ESP32

### 2.3 Validation et Form Requests
- Créer des Form Requests pour chaque action de création/modification
- Validation stricte des données entrantes

### 2.4 Jobs et Queues
**Créer des Jobs asynchrones** :

- `GeneratePredictionJob` - Génération asynchrone de prédictions
- `ProcessSensorReadingJob` - Traitement différé des relevés
- `TestProviderConnectionJob` - Test asynchrone de providers
- `CleanOldReadingsJob` - Nettoyage des anciennes données (> 1 an)
- `SendAlertNotificationJob` - Envoi de notifications

### 2.5 Middleware et Policies
- `EnsureDeviceOwnership` - Vérifier propriété de l'appareil
- Policies pour autorisation fine (MedicalDevicePolicy, etc.)

---

## Phase 3: Frontend - Pages et Composants

### 3.1 Pages Principales (dans `resources/js/pages`)

#### `Auth/Login.vue` ✅ (Déjà en place avec Fortify)
- Interface de connexion

#### `Dashboard.vue` (Tableau de bord)
**Sections** :
- Carte de résumé : Nombre d'appareils, capteurs actifs, alertes actives
- Liste des alertes récentes (cliquable)
- Graphique : Évolution du nombre d'alertes (7 derniers jours)
- Liste des appareils avec statut temps réel
- Dernières prédictions générées

#### `Devices/Index.vue` (Liste des appareils)
- Table avec filtres (statut, localisation, fabricant)
- Recherche par nom/numéro de série
- Bouton "Ajouter appareil"
- Indicateurs visuels de statut
- Actions : Voir détails, Configurer, Supprimer

#### `Devices/Show.vue` (Détails appareil)
**Onglets** :
1. **Informations** : Détails de l'appareil, ESP32 connecté, statut
2. **Capteurs** : Liste des capteurs avec lectures récentes
3. **Graphiques** : Visualisation temps réel des données capteurs
4. **Prédictions** : Historique et dernière prédiction
5. **Alertes** : Alertes liées à cet appareil

#### `Devices/Create.vue` & `Edit.vue`
- Formulaire de création/édition
- Validation côté client

#### `Sensors/Configure.vue` (Configuration capteurs d'un appareil)
- Liste des capteurs existants (éditable inline)
- Formulaire d'ajout de nouveau capteur
- Configuration : type, unité, seuils, pin ESP32, intervalle
- Activation/désactivation rapide
- Test de lecture en temps réel

#### `Predictions/Index.vue` (Historique prédictions)
- Filtres par appareil, provider, niveau de risque, date
- Table avec colonnes : Appareil, Date, Provider, Risque, Probabilité
- Possibilité de comparer les prédictions

#### `Predictions/Show.vue` (Détail prédiction)
- Résultat complet de la prédiction (formaté)
- Graphiques de probabilité
- Recommandations affichées clairement
- Données analysées (période, capteurs)
- Bouton "Régénérer avec un autre provider"

#### `Predictions/Generate.vue` (Générer prédiction)
- Sélection de l'appareil
- Sélection du provider (ou utiliser défaut)
- Sélection de la période d'analyse
- Bouton "Générer" (avec loader)
- Affichage résultat après génération

#### `Providers/Index.vue` (Configuration providers)
- Liste des providers configurés
- Indicateurs : Actif, Défaut, Dernier test
- Drag & drop pour réordonner priorité
- Boutons : Tester, Éditer, Supprimer
- Bouton "Ajouter provider"

#### `Providers/Create.vue` & `Edit.vue`
- Formulaire avec champs dynamiques selon le type
- **Type Cloud API** : URL, API Key, Modèle
- **Type Local LLM** : URL locale, Modèle
- **Type Python Model** : Chemin script, paramètres
- Bouton "Tester la connexion"
- Validation en temps réel

#### `Providers/Test.vue` (Test de provider)
- Interface de test avec données factices
- Visualisation requête/réponse
- Mesure du temps de réponse
- Validation du format de réponse

#### `Alerts/Index.vue` (Liste des alertes)
- Filtres : Sévérité, Type, Lu/Non lu, Date
- Groupage par appareil
- Actions : Marquer comme lu, Accuser réception, Ignorer
- Liens vers appareil/capteur/prédiction concerné

### 3.2 Composants Réutilisables (dans `resources/js/components`)

**Spécifiques au projet** :

#### `DeviceCard.vue`
- Carte affichant infos appareil
- Statut visuel (pastille colorée)
- Nombre de capteurs actifs
- Dernière synchronisation

#### `SensorReadingChart.vue`
- Graphique ligne pour historique relevés
- Seuils affichés (zones colorées)
- Zoom et navigation temporelle
- Support multi-capteurs

#### `SensorStatusBadge.vue`
- Badge coloré selon statut (normal, warning, critical)

#### `PredictionRiskIndicator.vue`
- Indicateur visuel du niveau de risque
- Jauge ou progress bar
- Couleur adaptative

#### `ProviderStatusDot.vue`
- Point coloré indiquant statut provider
- Tooltip avec détails

#### `AlertNotification.vue`
- Composant de notification toast
- Icônes selon sévérité
- Actions rapides

#### `ConfigForm/`
- Composants de formulaire génériques
- `ThresholdInput.vue` - Double input pour min/max
- `UnitSelector.vue` - Sélection d'unité
- `SensorTypeSelector.vue` - Sélection type capteur

**Composants UI génériques** (si pas déjà présents) :
- `DataTable.vue` - Table avec tri, pagination, filtres
- `LineChart.vue` - Graphique ligne (Chart.js ou similaire)
- `LoadingSpinner.vue`
- `EmptyState.vue`
- `ConfirmDialog.vue`

### 3.3 Composables Vue (dans `resources/js/composables`)

#### `useDevices.ts`
```typescript
export function useDevices() {
  const devices = ref([])
  const loading = ref(false)
  
  async function fetchDevices(filters = {}) { ... }
  async function createDevice(data) { ... }
  async function updateDevice(id, data) { ... }
  async function deleteDevice(id) { ... }
  
  return { devices, loading, fetchDevices, createDevice, updateDevice, deleteDevice }
}
```

Créer également :
- `useSensors.ts`
- `usePredictions.ts`
- `useProviders.ts`
- `useAlerts.ts`
- `useRealTimeData.ts` - Pour WebSocket si implémenté

### 3.4 Types TypeScript (dans `resources/js/types`)

Créer des interfaces TypeScript pour :
- `MedicalDevice`
- `Sensor`
- `SensorReading`
- `PredictionProvider`
- `Prediction`
- `Alert`
- `ProviderConfig` (union types pour différents providers)

---

## Phase 4: Intégration ESP32

### 4.1 Authentification ESP32
- Créer un système de tokens pour chaque appareil
- Migration pour ajouter `api_token` à `medical_devices`
- Middleware `AuthenticateESP32` pour valider token

### 4.2 Endpoint de Réception
**Route publique** : `POST /api/esp32/readings`

**Format attendu** :
```json
{
  "device_id": "ESP32_UNIQUE_ID",
  "token": "SECRET_TOKEN",
  "timestamp": "2025-12-11T18:00:00Z",
  "readings": [
    {
      "sensor_pin": 5,
      "value": 36.5
    },
    {
      "sensor_pin": 6,
      "value": 101.3
    }
  ]
}
```

**Traitement** :
1. Vérifier token
2. Identifier appareil via `esp32_device_id`
3. Mapper pins → sensors
4. Créer SensorReading pour chaque relevé
5. Vérifier seuils et créer alertes si nécessaire
6. Répondre avec confirmation

### 4.3 Configuration ESP32
**Endpoint** : `GET /api/esp32/config/{device_id}?token={token}`

**Réponse** :
```json
{
  "device_id": "ESP32_001",
  "polling_interval": 60,
  "sensors": [
    {
      "pin": 5,
      "type": "temperature",
      "unit": "celsius",
      "interval": 60
    }
  ],
  "server_url": "https://yourapp.com/api/esp32/readings"
}
```

### 4.4 Documentation API ESP32
- Créer un fichier `docs/ESP32_API.md` avec :
  - Endpoints disponibles
  - Format des requêtes/réponses
  - Codes d'erreur
  - Exemples Arduino/PlatformIO

### 4.5 Code Exemple ESP32 (Référence)
Créer `resources/esp32/example.ino` :
```cpp
// Exemple de code pour ESP32
// Lecture capteurs + Envoi HTTP
```

---

## Phase 5: Système de Prédiction IA

### 5.1 Prompts et Templates

**Créer** `app/Services/Prompts/PredictionPromptBuilder.php`

**Template de prompt** :
```
You are an expert in predictive maintenance for medical equipment.

Equipment: {device_name} ({model})
Analysis Period: {start_date} to {end_date}

Sensor Data Summary:
{sensor_data_summary}

Recent Alerts:
{alerts_summary}

Historical Patterns:
{patterns}

Task: Analyze this data and provide:
1. Failure probability (0-100%)
2. Predicted failure date (if applicable)
3. Risk level (low/medium/high/critical)
4. Specific failure modes identified
5. Maintenance recommendations

Format your response as JSON:
{
  "failure_probability": number,
  "predicted_failure_date": "ISO 8601 or null",
  "risk_level": "low|medium|high|critical",
  "failure_modes": ["mode1", "mode2"],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "action": "description",
      "urgency_days": number
    }
  ],
  "confidence_score": number,
  "analysis": "detailed explanation"
}
```

### 5.2 Adapters Détaillés

#### `OpenRouterAdapter`
- Endpoint : `https://openrouter.ai/api/v1/chat/completions`
- Headers : `Authorization: Bearer {api_key}`
- Modèles suggérés : `gpt-4`, `claude-3-opus`, etc.

#### `HuggingFaceAdapter`
- Endpoint : `https://api-inference.huggingface.co/models/{model_id}`
- Modèles suggérés : Modèles de text-generation ou conversational

#### `OllamaAdapter`
- Endpoint : `http://localhost:11434/api/generate`
- Modèles : `llama2`, `mistral`, etc.

#### `PythonModelAdapter`
- Deux approches :
  1. **API Flask/FastAPI** : Appel HTTP vers serveur Python local
  2. **Exécution directe** : `exec('python predict.py')` avec communication via fichiers JSON

**Fichier Python exemple** : `resources/python/predict.py`
```python
import json
import sys
from sklearn.ensemble import RandomForestClassifier
# Charger modèle pré-entraîné
# Analyser données
# Retourner prédiction JSON
```

### 5.3 Gestion des Erreurs et Fallback
- Si provider échoue, essayer le suivant selon priorité
- Logger toutes les tentatives
- Retourner erreur claire si tous échouent

### 5.4 Cache et Optimisation
- Mettre en cache les prédictions récentes (1h)
- Éviter de générer plusieurs fois pour mêmes données

---

## Phase 6: Temps Réel et Notifications

### 6.1 WebSockets (Optionnel mais recommandé)

**Installation** :
```bash
composer require beyondcode/laravel-websockets
php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider"
```

**Events à broadcaster** :
- `NewSensorReading` - Nouveau relevé capteur
- `NewAlert` - Nouvelle alerte
- `PredictionGenerated` - Prédiction terminée
- `DeviceStatusChanged` - Changement statut appareil

**Configuration frontend** :
- Utiliser Laravel Echo + Pusher
- Listeners dans composants Vue

### 6.2 Notifications Navigateur
- Notifications push navigateur pour alertes critiques
- Permission demandée au login

### 6.3 Email/SMS (Phase future)
- Mail pour alertes critiques
- SMS pour urgences (via Twilio/Nexmo)

---

## Phase 7: Tests et Qualité

### 7.1 Tests Backend (PHPUnit)

**Tests à créer dans `tests/Feature`** :
- `MedicalDeviceTest` - CRUD appareils
- `SensorTest` - CRUD capteurs
- `SensorReadingTest` - Stockage relevés, vérification seuils
- `PredictionTest` - Génération prédictions
- `ProviderTest` - Test des adapters
- `AlertTest` - Création alertes
- `ESP32ApiTest` - Endpoints ESP32

**Tests Unitaires** :
- Services (PredictionService, AlertService)
- Adapters (mock des appels HTTP)

### 7.2 Tests Frontend (Vitest + Vue Test Utils)
- Tests unitaires composants
- Tests d'intégration pages

### 7.3 Validation et Linting
```bash
# PHP
composer test
./vendor/bin/pint # Laravel Pint pour code style

# JavaScript
npm run lint
npm run format:check
```

---

## Phase 8: Sécurité et Performance

### 8.1 Sécurité

**Mesures à implémenter** :
- ✅ CSRF protection (déjà Laravel)
- Rate limiting sur API ESP32 (éviter spam)
- Validation stricte de toutes les entrées
- Encryption des API keys dans base de données
- HTTPS obligatoire en production
- Logs d'audit pour actions sensibles
- Permissions granulaires (Spatie Permission)

### 8.2 Performance

**Optimisations** :
- Index base de données sur colonnes fréquemment requêtées
- Eager loading pour éviter N+1
- Cache des statistiques (Redis)
- Pagination systématique
- Lazy loading images/graphs
- CDN pour assets statiques
- Queue pour jobs lourds

**Monitoring** :
- Laravel Telescope (dev)
- Laravel Horizon (queues)
- Logs structurés

---

## Phase 9: Déploiement et DevOps

### 9.1 Configuration Environnement

**Variables d'environnement** (`.env`) :
```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=detect_panne
DB_USERNAME=root
DB_PASSWORD=

# Queue
QUEUE_CONNECTION=database # ou redis en production

# WebSockets
BROADCAST_DRIVER=pusher # ou redis

# Providers (chiffrés en BDD, mais valeurs de test ici)
OPENROUTER_API_KEY=
HUGGINGFACE_API_KEY=
OLLAMA_ENDPOINT=http://localhost:11434
PYTHON_MODEL_ENDPOINT=http://localhost:5000

# ESP32
ESP32_TOKEN_EXPIRATION_DAYS=365
```

### 9.2 Déploiement Production

**Checklist** :
1. Configurer serveur (LAMP/LEMP)
2. Cloner repository
3. `composer install --no-dev`
4. `npm install && npm run build`
5. `php artisan migrate --force`
6. `php artisan config:cache`
7. `php artisan route:cache`
8. `php artisan view:cache`
9. Configurer supervisor pour queues
10. Configurer cron pour scheduled tasks
11. SSL/TLS (Let's Encrypt)

**Cron** (`crontab -e`) :
```
* * * * * cd /path-to-app && php artisan schedule:run >> /dev/null 2>&1
```

**Supervisor** (`/etc/supervisor/conf.d/laravel-worker.conf`) :
```ini
[program:laravel-worker]
command=php /path-to-app/artisan queue:work --tries=3
autostart=true
autorestart=true
```

### 9.3 CI/CD (Optionnel)

**GitHub Actions (`.github/workflows/deploy.yml`)** :
- Tests automatiques sur push
- Déploiement auto sur main

---

## Phase 10: Documentation et Formation

### 10.1 Documentation Utilisateur
- Guide d'installation
- Manuel d'utilisation avec captures d'écran
- FAQ
- Tutoriels vidéo (optionnel)

### 10.2 Documentation Développeur
- Architecture du système
- Guide de contribution
- API Reference
- Guide ESP32

### 10.3 Documentation API
- Génération avec Scribe :
```bash
composer require --dev knuckleswtf/scribe
php artisan scribe:generate
```

---

## Planning de Développement Suggéré

### Semaine 1-2 : Fondations
- Phase 1 : Base de données
- Phase 2.1-2.3 : Contrôleurs et services de base

### Semaine 3-4 : Backend Core
- Phase 2.4-2.5 : Jobs, middleware, policies
- Phase 4 : Intégration ESP32
- Tests backend basiques

### Semaine 5-6 : Frontend Core
- Phase 3.1 : Pages principales (Dashboard, Devices)
- Phase 3.2 : Composants de base
- Intégration avec backend

### Semaine 7-8 : Configuration et Prédiction
- Phase 3.1 : Pages Sensors, Providers
- Phase 5 : Système de prédiction (adapters)
- Tests des providers

### Semaine 9-10 : Prédictions et Alertes
- Phase 3.1 : Pages Predictions, Alerts
- Phase 5 : Finalisation prédictions
- Système d'alertes complet

### Semaine 11 : Temps Réel
- Phase 6 : WebSockets
- Notifications

### Semaine 12-13 : Polish et Tests
- Phase 7 : Tests complets
- Phase 8 : Sécurité et optimisations
- Corrections bugs

### Semaine 14 : Déploiement
- Phase 9 : Déploiement production
- Phase 10 : Documentation
- Formation utilisateurs

---

## Critères de Succès

✅ **Fonctionnalités** :
- [ ] Gestion complète des appareils médicaux
- [ ] Configuration flexible des capteurs
- [ ] Réception données ESP32 en temps réel
- [ ] Prédictions via multiples providers
- [ ] Interface de test des providers
- [ ] Système d'alertes opérationnel
- [ ] Tableau de bord informatif

✅ **Performance** :
- [ ] Temps de réponse < 200ms pour pages standards
- [ ] Prédictions générées en < 10s
- [ ] Support 1000+ relevés/heure

✅ **Qualité** :
- [ ] Couverture tests > 70%
- [ ] 0 erreur critique
- [ ] Code lint-free
- [ ] Documentation complète

---

## Technologies et Packages Additionnels Recommandés

### Backend
```bash
composer require spatie/laravel-permission # Gestion permissions
composer require spatie/laravel-activitylog # Logs d'activité
composer require guzzlehttp/guzzle # HTTP client (déjà inclus)
```

### Frontend
```bash
npm install chart.js vue-chartjs # Graphiques
npm install date-fns # Manipulation dates
npm install @vueuse/core # Utilities Vue (déjà installé ✅)
npm install zod # Validation TypeScript
npm install axios # HTTP (ou utiliser Inertia)
```

---

## Notes Importantes

1. **Sécurité ESP32** : Utiliser HTTPS et tokens forts. Envisager mTLS pour production.

2. **Scalabilité** : Prévoir archivage des anciennes données (> 1 an) dans table séparée.

3. **Coûts API** : Monitorer utilisation APIs cloud. Privilégier local LLM pour développement.

4. **Backup** : Sauvegardes automatiques quotidiennes de la base de données.

5. **RGPD/Conformité** : Si données médicales sensibles, vérifier conformité RGPD/HIPAA.

6. **Multilangue** : Prévoir i18n si déploiement international (Laravel Lang).

---

**Prochaine étape recommandée** : Commencer par Phase 1 (migrations et modèles) pour établir une fondation solide.


Créer les composants réutilisables (DeviceCard, Charts, etc.)
Créer les pages principales (Dashboard, Devices, etc.)
Installer les packages et configurer les formulaires
Autre chose ?

Crée les layouts (AppLayout avec navigation)
Crée les pages manquantes
Configure les routes Laravel
Autre chose ?