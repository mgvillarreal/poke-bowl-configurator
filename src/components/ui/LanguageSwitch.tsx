import { motion } from 'motion/react'
import type { Locale } from '../../i18n/messages'
import { useLocaleStore, useT } from '../../i18n/useLocale'
import { UsaFlag, VenezuelaFlag } from './Flags'

const OPTIONS: { locale: Locale; label: string; Flag: typeof VenezuelaFlag }[] = [
  { locale: 'es', label: 'Español', Flag: VenezuelaFlag },
  { locale: 'en', label: 'English', Flag: UsaFlag },
]

/** Cambio de idioma tocando solo la bandera (pensado para la barra índigo superior) */
export function LanguageSwitch() {
  const t = useT()
  const locale = useLocaleStore((s) => s.locale)
  const setLocale = useLocaleStore((s) => s.setLocale)

  return (
    <div role="group" aria-label={t.header.language} className="flex shrink-0 items-center gap-0.5 rounded-full bg-white/10 p-0.5">
      {OPTIONS.map(({ locale: option, label, Flag }) => {
        const active = option === locale
        return (
          <button
            key={option}
            type="button"
            lang={option}
            aria-label={label}
            aria-pressed={active}
            title={label}
            onClick={() => setLocale(option)}
            className="relative flex h-7 w-9 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-mango"
          >
            {active && (
              <motion.span
                layoutId="locale-pill"
                className="absolute inset-0 rounded-full bg-white/25"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Flag
              className={`relative h-4 w-6 rounded-[3px] transition-[filter,opacity] ${
                active ? '' : 'opacity-50 grayscale-[60%] hover:opacity-100 hover:grayscale-0'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
