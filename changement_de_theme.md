# Ajout de thèmes (multi-palettes) à l’application

Ce guide explique comment ajouter des thèmes (palettes de couleurs) en plus du mode light/dark déjà présent. Il s’appuie sur Tailwind v4 (tokens CSS) et le hook existant `use-appearance`.

Objectif
- Conserver le basculement light/dark (.dark sur <html>),
- Ajouter des thèmes nommés (ex: "ocean", "forest", "rose") qui modifient les variables CSS de la palette,
- Persister le choix (localStorage + cookie pour SSR),
- Exposer un hook et un composant pour changer de thème coté UI.

Prérequis
- Tailwind v4 et mapping des tokens déjà en place dans `resources/css/app.css`.
- Les composants consomment les tokens via les classes Tailwind (bg-background, text-foreground, etc.)

Étape 1 — Déclarer les palettes de thème dans le CSS
1) Ouvrez `resources/css/app.css`. Les tokens par défaut sont définis dans `:root` (et en dark dans `.dark`).
2) Ajoutez des variantes de thème via un attribut data-theme sur `<html>` en surchargeant uniquement les variables de couleur nécessaires.

Exemple (à coller en bas de `resources/css/app.css`):

```css
/* Thème Ocean */
:root[data-theme="ocean"] {
  --primary: oklch(0.60 0.12 220);
  --primary-foreground: oklch(0.98 0 0);
  --accent: oklch(0.85 0.07 230);
  --accent-foreground: oklch(0.22 0 0);
  --chart-1: oklch(0.64 0.22 230);
  --chart-2: oklch(0.60 0.12 184.7);
  --chart-3: oklch(0.40 0.07 227.4);
  --chart-4: oklch(0.83 0.19 84.4);
  --chart-5: oklch(0.77 0.19 70.1);
}

.dark[data-theme="ocean"] {
  --primary: oklch(0.85 0.05 230);
  --primary-foreground: oklch(0.22 0 0);
  --accent: oklch(0.40 0.07 230);
  --accent-foreground: oklch(0.98 0 0);
}

/* Thème Forest */
:root[data-theme="forest"] {
  --primary: oklch(0.55 0.14 150);
  --primary-foreground: oklch(0.98 0 0);
  --accent: oklch(0.90 0.05 145);
  --accent-foreground: oklch(0.22 0 0);
  --chart-1: oklch(0.64 0.20 150);
  --chart-2: oklch(0.58 0.12 175);
  --chart-3: oklch(0.42 0.06 200);
  --chart-4: oklch(0.70 0.18 90);
  --chart-5: oklch(0.75 0.18 60);
}

.dark[data-theme="forest"] {
  --primary: oklch(0.82 0.05 150);
  --primary-foreground: oklch(0.22 0 0);
  --accent: oklch(0.30 0.05 150);
  --accent-foreground: oklch(0.98 0 0);
}
```

Notes:
- On ne re-déclare pas toutes les variables, seulement celles à surcharger, le reste hérite de `:root` / `.dark`.
- `.dark[data-theme="…"]` permet d’ajuster le rendu pour le mode sombre au sein d’un thème.

Étape 2 — Appliquer un thème via l’attribut `data-theme`
- Le sélecteur CSS ci-dessus attend `document.documentElement.dataset.theme = "ocean"` (ou autre nom).
- L’ordre d’application reste: base -> thème -> dark. Le mode sombre est géré par la classe `.dark` déjà existante.

Étape 3 — Créer un hook `use-theme`
Créez `resources/js/hooks/use-theme.ts` (ou `.tsx` si vous préférez). Il gère l’état, la persistance et l’application de l’attribut.

```ts
import { useCallback, useEffect, useState } from 'react';

export type ThemeName = 'default' | 'ocean' | 'forest';

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyThemeName = (theme: ThemeName) => {
  const t = theme === 'default' ? '' : theme;
  if (t) {
    document.documentElement.setAttribute('data-theme', t);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
};

export function initializeThemeName() {
  const saved = (localStorage.getItem('themeName') as ThemeName) || 'default';
  applyThemeName(saved);
}

export function useTheme() {
  const [themeName, setThemeName] = useState<ThemeName>('default');

  const updateThemeName = useCallback((t: ThemeName) => {
    setThemeName(t);
    localStorage.setItem('themeName', t);
    setCookie('themeName', t);
    applyThemeName(t);
  }, []);

  useEffect(() => {
    const saved = (localStorage.getItem('themeName') as ThemeName) || 'default';
    // eslint-disable-next-line react-hooks/exhaustive-deps
    updateThemeName(saved);
  }, [updateThemeName]);

  return { themeName, updateThemeName } as const;
}
```

Étape 4 — Initialisation au chargement (en plus de `initializeTheme`)
Dans `resources/js/app.tsx`, importez et appelez l’initialisation du thème au même endroit que `initializeTheme()` (après l’inertie si besoin, mais idéalement le plus tôt possible pour éviter le FOUC).

```ts
import { initializeTheme } from './hooks/use-appearance';
import { initializeThemeName } from './hooks/use-theme';

// ... après createInertiaApp(...)
initializeTheme();
initializeThemeName();
```

Étape 5 — Composant sélecteur de thème
Créez un petit composant pour permettre à l’utilisateur de choisir le thème.

`resources/js/components/theme-selector.tsx`
```tsx
import { useTheme } from '@/hooks/use-theme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ThemeSelector({ className = '' }: { className?: string }) {
  const { themeName, updateThemeName } = useTheme();

  return (
    <div className={className}>
      <Select value={themeName} onValueChange={(v) => updateThemeName(v as any)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Thème" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Par défaut</SelectItem>
          <SelectItem value="ocean">Ocean</SelectItem>
          <SelectItem value="forest">Forest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

Astuce: vous pouvez aussi proposer des boutons (similaire à `appearance-tabs`) au lieu d’un Select.

Étape 6 — Emplacement dans l’UI
- Ajoutez `ThemeSelector` dans une zone de préférences (header, menu utilisateur, page paramètres) selon votre UX.
- Le composant peut cohabiter avec `AppearanceToggleDropdown`/`AppearanceToggleTab` pour gérer indépendamment “mode” (light/dark/system) et “thème” (palette).

Étape 7 — SSR (facultatif mais recommandé)
- Le cookie `themeName` est posé par le hook. Si vous faites du SSR avec Inertia, lisez ce cookie côté serveur et injectez-le dans la réponse (ou servez un script inline minimal) pour appliquer `data-theme` au plus tôt.
- Variante rapide: Ajouter dans `resources/views/app.blade.php` un script qui lit `document.cookie` pour appliquer `data-theme` avant le chargement principal.

Exemple minimal (Blade):
```html
<script>
  (function(){
    try {
      var match = document.cookie.match(/(?:^|; )themeName=([^;]*)/);
      var value = match ? decodeURIComponent(match[1]) : '';
      if (value && value !== 'default') {
        document.documentElement.setAttribute('data-theme', value);
      }
    } catch (e) {}
  })();
</script>
```

Bonnes pratiques
- Ne mixez pas tokens et couleurs directes dans les composants: utilisez les classes Tailwind mappées (bg-background, text-foreground, etc.).
- Limitez les variables redéfinies par thème au strict nécessaire pour garder une identité visuelle cohérente.
- Testez chaque thème en light et dark.

Vérification rapide
- Changer le thème dans le sélecteur modifie les couleurs sans recharger la page.
- Le rechargement de la page conserve le thème sélectionné.
- Le passage Light/Dark (existants) fonctionne dans chaque thème.

Aller plus loin
- Exposez les thèmes disponibles depuis le backend (settings) pour les éditer dynamiquement.
- Permettez à l’utilisateur d’exporter/importer une palette (JSON -> variables CSS).
