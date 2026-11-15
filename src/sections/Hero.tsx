import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Bowl } from '../components/bowl/Bowl'
import { ArrowRightIcon } from '../components/ui/Icons'
import { EMPTY_SELECTION, type BowlConfig } from '../data/menu'
import { useT } from '../i18n/useLocale'
import { seigaiha } from '../lib/svg'

/** Bowl de muestra del hero: Regular, para cargar menos fotos en la primera vista */
const FEATURED: BowlConfig = {
  size: 'regular',
  selection: {
    base: ['rice-white'],
    protein: ['salmon'],
    extra: ['avocado', 'mango', 'edamame', 'cucumber'],
    sauce: ['spicy-mayo'],
    topping: ['sesame-seeds'],
  },
}

const EMPTY_BOWL: BowlConfig = { size: 'regular', selection: EMPTY_SELECTION }

/**
 * El hero muestra primero el bowl vacío y, cuando la página terminó de cargar,
 * los ingredientes caen al bowl: una mini demo del armador.
 * Así la foto principal (el bowl) llega sola y rápido, y el resto después.
 */
function useFilledAfterLoad(delay = 250) {
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const fill = () => {
      timer = setTimeout(() => setFilled(true), delay)
    }
    if (document.readyState === 'complete') fill()
    else window.addEventListener('load', fill, { once: true })
    return () => {
      window.removeEventListener('load', fill)
      clearTimeout(timer)
    }
  }, [delay])

  return filled
}

export function Hero() {
  const t = useT()
  const filled = useFilledAfterLoad()

  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b-2 border-nori"
      style={{ backgroundImage: seigaiha('rgba(255,255,255,0.16)', '#ff6b5a'), backgroundSize: '60px 30px' }}
    >
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        {/* Sin fundido de opacidad: el texto principal se pinta de inmediato (mejor LCP); solo se desliza */}
        <motion.div initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
          <span className="inline-block -rotate-2 rounded-full border-2 border-nori bg-rice px-3 py-1 text-sm font-bold">
            {t.hero.badge}
          </span>
          <h1 className="mt-6 font-display text-6xl leading-[0.95] text-nori sm:text-7xl">
            {t.hero.line1}
            <br />
            {t.hero.line2}{' '}
            <span className="mt-2 inline-block -rotate-2 rounded-2xl bg-nori px-3 pb-1 text-rice">{t.hero.accent}</span>
          </h1>
          <p className="mt-6 max-w-md text-lg font-medium text-nori">{t.hero.lead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href="#armar"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-nori bg-nori px-6 py-3 font-display text-rice shadow-[4px_4px_0_0_var(--color-mango)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
            >
              {t.hero.ctaBuild}
              <ArrowRightIcon size={20} />
            </a>
            <a
              href="#bowls-de-la-casa"
              className="font-bold text-nori underline decoration-2 underline-offset-4 hover:decoration-nori/50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
            >
              {t.hero.ctaHouse}
            </a>
          </div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-md">
          <motion.div
            initial={{ scale: 0.9, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.15 }}
          >
            {/* El plato gira lento y sin fin (se detiene si el sistema pide menos movimiento) */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}>
              <Bowl config={filled ? FEATURED : EMPTY_BOWL} imageWidth={448} mobileImageWidth={360} priority />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
