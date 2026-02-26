import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePage, router } from "@inertiajs/react"
import { Languages } from "lucide-react"
import { SharedData } from "@/types"
import { update } from "@/actions/App/Http/Controllers/LocaleController"

export function LanguageSwitcher() {
    const { locale } = usePage<SharedData>().props

    const switchLanguage = (newLocale: string) => {
        router.post(update.url(), { locale: newLocale }, {
            preserveScroll: true,
            // Force a hard reload to ensure provider update picks up (sometimes needed if provider doesn't react deep enough)
            // actually Inertia reload should be enough if the prop changes.
            onSuccess: () => window.location.reload()
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="Switch Language">
                    <Languages className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchLanguage("fr")} disabled={locale === 'fr'}>
                    Français {locale === 'fr' && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLanguage("en")} disabled={locale === 'en'}>
                    English {locale === 'en' && "✓"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
