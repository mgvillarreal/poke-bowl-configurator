import { Logo } from '../components/ui/Logo'
import { useT } from '../i18n/useLocale'

const AUTHOR = 'Gabriela Villarreal'

export function Footer() {
  const t = useT()

  return (
    <footer className="bg-nori pt-12 pb-8 text-rice">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Logo label={t.header.home} light />
          <p className="mt-3 max-w-sm text-sm text-rice/70">{t.footer.tagline}</p>
        </div>
        <p className="max-w-sm text-xs text-rice/60 sm:text-right">{t.footer.disclaimer}</p>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
        <p className="border-t border-rice/15 pt-6 text-center text-sm text-rice/80">
          {t.footer.madeWith} <span className="font-bold text-rice">{AUTHOR}</span>
        </p>
      </div>
    </footer>
  )
}
