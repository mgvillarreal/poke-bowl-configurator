import { motion } from 'motion/react'
import { Bowl } from '../components/bowl/Bowl'
import { HERO_IMAGE, type BowlConfig } from '../data/menu'
import { useImage } from '../hooks/useImage'
import { useT } from '../i18n/useLocale'
import { seigaiha } from '../lib/svg'

/** Bowl de muestra para el hero (mientras no exista scene/hero.jpg) */
const FEATURED: BowlConfig = {
  size: 'grande',
  selection: {
    base: ['rice-white'],
    protein: ['tuna', 'salmon'],
    extra: ['avocado', 'mango', 'edamame', 'cucumber', 'red-onion', 'corn'],
    sauce: ['spicy-mayo'],
    topping: ['sesame-seeds', 'scallions'],
  },
}

const STICKER_STYLES = [
  { className: 'top-[6%] left-[2%] bg-mango -rotate-6', delay: 0 },
  { className: 'bottom-[10%] left-[-2%] bg-matcha rotate-3', delay: 0.6 },
  { className: 'top-[16%] right-[0%] bg-white rotate-6', delay: 1.2 },
]

export function Hero() {
  const t = useT()
  const hasPhoto = useImage(HERO_IMAGE)

  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b-2 border-nori"
      style={{ backgroundImage: seigaiha('rgba(255,255,255,0.16)', '#ff6b5a'), backgroundSize: '60px 30px' }}
    >
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block -rotate-2 rounded-full border-2 border-nori bg-rice px-3 py-1 text-sm font-bold shadow-sticker">
            {t.hero.badge}
          </span>
          <h1 className="mt-6 font-display text-6xl leading-[0.95] text-white sm:text-7xl">
            {t.hero.line1}
            <br />
            {t.hero.line2} <span className="text-nori">{t.hero.accent}</span>
          </h1>
          <p className="mt-6 max-w-md text-lg font-medium text-white/95">{t.hero.lead}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#armar"
              className="rounded-2xl border-2 border-nori bg-nori px-6 py-3 font-display text-rice shadow-[4px_4px_0_0_var(--color-mango)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mango"
            >
              {t.hero.ctaBuild}
            </a>
            <a
              href="#como-funciona"
              className="rounded-2xl border-2 border-white px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              {t.hero.ctaHow}
            </a>
          </div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-md">
          {hasPhoto ? (
            <img
              src={HERO_IMAGE}
              alt={t.hero.photoAlt}
              className="aspect-[4/5] w-full rounded-[2.5rem] border-2 border-nori object-cover shadow-sticker-lg"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.15 }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}>
                <Bowl config={FEATURED} />
              </motion.div>
            </motion.div>
          )}

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
