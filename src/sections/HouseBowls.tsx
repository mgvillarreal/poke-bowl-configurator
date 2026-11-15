import { motion } from 'motion/react'
import { Bowl } from '../components/bowl/Bowl'
import { DietChips } from '../components/ui/DietChips'
import { RenderWhenVisible } from '../components/ui/RenderWhenVisible'
import { HOUSE_BOWLS } from '../data/menu'
import { useT } from '../i18n/useLocale'
import { bowlTotals } from '../lib/bowl'
import { bowlDiet } from '../lib/diet'
import { formatMoney } from '../lib/format'
import { seigaiha } from '../lib/svg'
import { useBowlStore } from '../store/bowlStore'

/** Color de fondo de cada bowl, con las olas japonesas del armador encima */
const BACKDROPS = ['#ffc93c', '#ffe1db', '#7bc67e', '#fff6e9']
const WAVE_STROKE = 'rgba(31,42,90,0.08)'

/** Combinaciones listas: se piden tal cual o se cargan en el armador para personalizarlas */
export function HouseBowls() {
  const t = useT()
  const loadBowl = useBowlStore((s) => s.loadBowl)
  const addToCart = useBowlStore((s) => s.addToCart)

  const customize = (index: number) => {
    const bowl = HOUSE_BOWLS[index]
    loadBowl(bowl.config, bowl.name)
    document.getElementById('armar')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="bowls-de-la-casa" aria-labelledby="house-title" className="scroll-mt-20 border-b-2 border-nori bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-bold tracking-widest text-coral-ink uppercase">{t.houseBowls.eyebrow}</p>
        <h2 id="house-title" className="font-display text-4xl sm:text-5xl">
          {t.houseBowls.title}
        </h2>
        <p className="mt-3 text-lg text-nori/75">{t.houseBowls.lead}</p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOUSE_BOWLS.map((bowl, i) => {
            const diet = bowlDiet(bowl.config)
            return (
              <motion.li
                key={bowl.id}
                className="flex flex-col overflow-hidden rounded-[2rem] border-2 border-nori/15 bg-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <div
                  className="p-6"
                  style={{ backgroundImage: seigaiha(WAVE_STROKE, BACKDROPS[i % BACKDROPS.length]), backgroundSize: '60px 30px' }}
                >
                  <RenderWhenVisible className="mx-auto aspect-square max-w-52">
                    <Bowl config={bowl.config} imageWidth={208} />
                  </RenderWhenVisible>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl leading-tight">
                      {bowl.name.split(' ').map((word) => (
                        <span key={word} className="block">
                          {word}
                        </span>
                      ))}
                    </h3>
                    <p className="pt-0.5 font-bold">{formatMoney(bowlTotals(bowl.config).price, t.intl)}</p>
                  </div>
                  <p className="mt-1 text-sm text-nori/75">{t.houseBowls.descriptions[bowl.id]}</p>
                  <DietChips vegan={diet.vegan} glutenFree={diet.glutenFree} className="mt-2 justify-start" />

                  <div className="mt-auto flex flex-col gap-2 pt-5">
                    <button
                      type="button"
                      onClick={() => customize(i)}
                      className="w-full rounded-xl border-2 border-nori bg-white px-3 py-2 text-sm font-bold transition-colors hover:bg-rice focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
                    >
                      {t.houseBowls.customize}
                      {/* El nombre accesible incluye el texto visible + qué bowl es */}
                      <span className="sr-only"> ({bowl.name})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addToCart(bowl.config, '', bowl.name)}
                      className="w-full rounded-xl border-2 border-nori bg-coral px-3 py-2 text-sm font-bold text-nori transition-colors hover:bg-coral-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
                    >
                      {t.houseBowls.add}
                      <span className="sr-only"> ({bowl.name})</span>
                    </button>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
