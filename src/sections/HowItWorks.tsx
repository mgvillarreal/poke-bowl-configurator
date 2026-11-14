import { motion } from 'motion/react'
import { useT } from '../i18n/useLocale'

/** Decoración japonesa de cada paso: elegir, mezclar, comer */
const DECOR = [
  { n: '01', jp: 'えらぶ', bg: 'bg-mango' },
  { n: '02', jp: 'まぜる', bg: 'bg-matcha' },
  { n: '03', jp: 'たべる', bg: 'bg-sakura' },
]

export function HowItWorks() {
  const t = useT()

  return (
    <section id="como-funciona" className="scroll-mt-20 border-t-2 border-nori bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-bold tracking-widest text-coral-ink uppercase">{t.how.eyebrow}</p>
        <h2 className="font-display text-4xl sm:text-5xl">{t.how.title}</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {DECOR.map((decor, i) => (
            <motion.article
              key={decor.n}
              className={`relative overflow-hidden rounded-[2rem] border-2 border-nori p-6 shadow-sticker-lg ${decor.bg}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <span aria-hidden className="absolute top-4 right-5 font-display text-sm text-nori/75">
                {decor.jp}
              </span>
              <p className="font-display text-6xl">{decor.n}</p>
              <h3 className="mt-4 font-display text-2xl">{t.how.steps[i].title}</h3>
              <p className="mt-2 font-medium text-nori/80">{t.how.steps[i].text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
