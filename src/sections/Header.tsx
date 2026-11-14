import { LanguageSwitch } from '../components/ui/LanguageSwitch'
import { Logo } from '../components/ui/Logo'
import { useT } from '../i18n/useLocale'

/** Barra fina de anuncios con el cambio de idioma */
export function TopBar() {
  const t = useT()

  return (
    <div className="bg-nori text-rice">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 sm:px-6">
        <p className="truncate text-xs font-medium sm:text-sm">{t.topBar}</p>
        <LanguageSwitch />
      </div>
    </div>
  )
}

export function Header() {
  const t = useT()

  return (
    <header className="sticky top-0 z-40 border-b-2 border-nori bg-rice/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo label={t.header.home} />
        <nav aria-label={t.header.nav} className="hidden items-center gap-8 font-bold md:flex">
          <a href="#armar" className="hover:text-coral">
            {t.header.build}
          </a>
          <a href="#como-funciona" className="hover:text-coral">
            {t.header.how}
          </a>
        </nav>
        <a
          href="#armar"
          className="rounded-xl border-2 border-nori bg-coral px-4 py-2 text-sm font-bold text-white shadow-sticker transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mango"
        >
          {t.header.order}
        </a>
      </div>
    </header>
  )
}
