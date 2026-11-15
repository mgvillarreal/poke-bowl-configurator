import { AnimatePresence, motion } from 'motion/react'
import { BagIcon, ScooterIcon } from '../components/ui/Icons'
import { LanguageSwitch } from '../components/ui/LanguageSwitch'
import { Logo } from '../components/ui/Logo'
import { useT } from '../i18n/useLocale'
import { useBowlStore } from '../store/bowlStore'

/** Barra fina de anuncios con el cambio de idioma */
export function TopBar() {
  const t = useT()

  return (
    <div className="bg-nori text-rice">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 sm:px-6">
        <p className="flex min-w-0 items-center gap-2 text-xs font-medium sm:text-sm">
          <ScooterIcon size={18} className="shrink-0 text-mango" />
          <span className="truncate">{t.topBar}</span>
        </p>
        <LanguageSwitch />
      </div>
    </div>
  )
}

export function Header() {
  const t = useT()
  const bowls = useBowlStore((s) => s.cart.reduce((sum, item) => sum + item.quantity, 0))
  const openCheckout = useBowlStore((s) => s.openCheckout)

  return (
    <header className="sticky top-0 z-40 border-b-2 border-nori bg-rice/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo label={t.header.home} />
        <nav aria-label={t.header.nav} className="hidden items-center gap-8 font-bold md:flex">
          <a href="#bowls-de-la-casa" className="hover:text-coral-ink">
            {t.header.house}
          </a>
          <a href="#armar" className="hover:text-coral-ink">
            {t.header.build}
          </a>
          <a href="#como-funciona" className="hover:text-coral-ink">
            {t.header.how}
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {/* El pedido solo aparece cuando tiene algo */}
          <AnimatePresence>
            {bowls > 0 && (
              <motion.button
                type="button"
                onClick={openCheckout}
                aria-label={t.cart.buttonLabel(bowls)}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                className="flex items-center gap-1.5 rounded-xl border-2 border-nori bg-white px-3 py-2 text-sm font-bold transition-colors hover:bg-rice focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
              >
                <BagIcon size={17} />
                <motion.span key={bowls} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="tabular-nums">
                  {t.cart.button(bowls)}
                </motion.span>
              </motion.button>
            )}
          </AnimatePresence>
          <a
            href="#armar"
            className="rounded-xl border-2 border-nori bg-coral px-4 py-2 text-sm font-bold text-nori shadow-sticker transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
          >
            {t.header.order}
          </a>
        </div>
      </div>
    </header>
  )
}
