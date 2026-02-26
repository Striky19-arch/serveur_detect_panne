# Procédure de Traduction de l'Application (Internationalisation)

Ce document décrit les étapes techniques pour mettre en place et gérer le support multilingue (i18n) sur l'application Stack Laravel + Inertia + React.

## 1. Prérequis Backend (Laravel)

Laravel gère les traductions via des fichiers situés dans le dossier `lang`.

### Installation des fichiers de langue par défaut
Si le dossier `lang` n'existe pas encore à la racine du projet, publiez-le :
```bash
php artisan lang:publish
```

### Structure des fichiers
Il existe deux méthodes pour stocker les traductions :
1.  **Fichiers JSON** (Recommandé pour les applications SPA/React) : `lang/fr.json`, `lang/en.json`.
    *   Format : `"Clé ou phrase originale": "Traduction"`
2.  **Fichiers PHP** : `lang/fr/auth.php`, `lang/fr/validation.php`.

## 2. Intégration Frontend (React + Inertia)

Pour utiliser ces traductions dans React, nous recommandons la bibliothèque `laravel-react-i18n` qui facilite la synchronisation.

### A. Installation
```bash
npm install laravel-react-i18n
```

### B. Configuration (app.tsx)
Modifiez le fichier d'entrée `resources/js/app.tsx` pour envelopper l'application avec `LaravelReactI18nProvider`.

```tsx
import { LaravelReactI18nProvider } from 'laravel-react-i18n';

// ... dans createInertiaApp
setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
        <LaravelReactI18nProvider
            locale={'en'} // Ou récupérer depuis une prop Inertia partagée
            fallbackLocale={'en'}
            files={import.meta.glob('/lang/*.json', { eager: true })}
        >
            <App {...props} />
        </LaravelReactI18nProvider>
    );
},
```

### C. Partage de la locale actuelle
Dans `app/Http/Middleware/HandleInertiaRequests.php`, partagez la locale active :

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'locale' => app()->getLocale(),
    ];
}
```

## 3. Ajout d'une nouvelle langue (Exemple : Français)

1.  **Créer le fichier de traduction** :
    Créez `lang/fr.json` :
    ```json
    {
        "Dashboard": "Tableau de bord",
        "Medical Devices": "Équipements Médicaux",
        "Welcome back": "Bon retour"
    }
    ```

2.  **Configurer la locale** :
    Pour changer la langue, mettez à jour la configuration `app.locale` dans `config/app.php` ou changez dynamiquement via un Middleware qui lit la préférence utilisateur (Session ou DB).

## 4. Utilisation dans les composants React

Utilisez le hook `useLaravelReactI18n` ou la fonction hélper `t`.

```tsx
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function MyComponent() {
    const { t } = useLaravelReactI18n();

    return (
        <h1>{t('Medical Devices')}</h1>
    );
}
```

## 5. Workflow de traduction au quotidien

1.  **Identifier une chaîne** dans le code (ex: "Save Changes").
2.  **Remplacer** par `{t('Save Changes')}`.
3.  **Ajouter** la clé "Save Changes" dans `lang/fr.json` avec sa traduction.
4.  Si la clé n'existe pas dans le fichier JSON, la bibliothèque affichera la clé elle-même par défaut.

## 6. Outils recommandés

*   **Laravel-lang/common** : Pour avoir automatiquement les traductions des messages d'erreur de validation standards de Laravel.
    ```bash
    composer require laravel-lang/common --dev
    php artisan lang:update
    ```
