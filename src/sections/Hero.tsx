import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Bowl } from '../components/bowl/Bowl'
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
 * los ingredientes caen uno sobre otro: una mini demo del armador.
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

const STICKER_STYLES = [
  { className: 'top-[6%] left-[2%] bg-mango -rotate-6', delay: 0 },
  { className: 'bottom-[10%] left-[-2%] bg-matcha rotate-3', delay: 0.6 },
  { className: 'top-[16%] right-[0%] bg-white rotate-6', delay: 1.2 },
]

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
          <span className="inline-block -rotate-2 rounded-full border-2 border-nori bg-rice px-3 py-1 text-sm font-bold shadow-sticker">
            {t.hero.badge}
          </span>
          <h1 className="mt-6 font-display text-6xl leading-[0.95] text-nori sm:text-7xl">
            {t.hero.line1}
            <br />
            {t.hero.line2}{' '}
            <span className="mt-2 inline-block -rotate-2 rounded-2xl bg-nori px-3 pb-1 text-rice shadow-[4px_4px_0_0_var(--color-mango)]">
              {t.hero.accent}
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg font-medium text-nori">{t.hero.lead}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#armar"
              className="rounded-2xl border-2 border-nori bg-nori px-6 py-3 font-display text-rice shadow-[4px_4px_0_0_var(--color-mango)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
            >
              {t.hero.ctaBuild}
            </a>
            <a
              href="#como-funciona"
              className="rounded-2xl border-2 border-nori px-6 py-3 font-bold text-nori transition-colors hover:bg-white/25 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
            >
              {t.hero.ctaHow}
            </a>
          </div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-md">
          <motion.div
            initial={{ scale: 0.9, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.15 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}>
              <Bowl config={filled ? FEATURED : EMPTY_BOWL} imageWidth={448} mobileImageWidth={360} priority />
            </motion.div>
          </motion.div>

          {STICKER_STYLES.map((s, i) => (
            <motion.span
              key={i}
              className={`absolute rounded-full border-2 border-nori px-3 py-1.5 text-sm font-bold whitespace-nowrap shadow-sticker ${s.className}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { delay: 0.5 + s.delay * 0.3 },
                scale: { delay: 0.5 + s.delay * 0.3, type: 'spring' },
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: s.delay },
              }}
            >
              {t.hero.stickers[i]}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
