'use client'

import { useTheme } from '@/hooks/use-theme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ThemeSelector({ className = '' }: { className?: string }) {
  const { themeName, updateThemeName } = useTheme();

  return (
    <div className={className}>
      <Select value={themeName} onValueChange={(v) => updateThemeName(v as any)}>
        <SelectTrigger className="w-36">
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
