import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { CATEGORIES, CATEGORY_BY_ID, SIZE_BY_ID, ingredientsOf, type CategoryId } from '../../data/menu'
import { bowlName } from '../../lib/bowl'
import { seigaiha } from '../../lib/svg'
import { useBowlStore } from '../../store/bowlStore'
import { Bowl } from '../bowl/Bowl'
import { IngredientCard } from './IngredientCard'
import { SizeToggle } from './SizeToggle'
import { StepTabs } from './StepTabs'
import { SummaryBar } from './SummaryBar'

export function Builder() {
  const [step, setStep] = useState<CategoryId>('base')
  const size = useBowlStore((s) => s.size)
  const selection = useBowlStore((s) => s.selection)
  const toggle = useBowlStore((s) => s.toggle)
  const surprise = useBowlStore((s) => s.surprise)

  const category = CATEGORY_BY_ID[step]
  const limit = SIZE_BY_ID[size].limits[step]
  const chosen = selection[step]
  const index = CATEGORIES.findIndex((c) => c.id === step)
  const prev = CATEGORIES[index - 1]
  const next = CATEGORIES[index + 1]

  return (
    <section id="armar" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold tracking-widest text-coral uppercase">Paso a paso</p>
            <h2 className="font-display text-4xl sm:text-5xl">Arma tu bowl</h2>
          </div>
          <motion.button
            type="button"
            onClick={surprise}
            whileHover={{ rotate: -2, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-2xl border-2 border-nori bg-mango px-4 py-2 font-bold shadow-sticker focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-coral"
          >
            🎲 Sorpréndeme
          </motion.button>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* Escenario del bowl */}
          <div className="lg:sticky lg:top-24">
            <div
              className="relative overflow-hidden rounded-[2.5rem] border-2 border-nori p-6 shadow-sticker-lg sm:p-10"
              style={{ backgroundImage: seigaiha('rgba(255,246,233,0.07)', '#1f2a5a'), backgroundSize: '60px 30px' }}
            >
              <span aria-hidden className="pointer-events-none absolute -top-4 -right-2 font-display text-8xl text-white/5 select-none">
                ナミ
              </span>
              <Bowl config={{ size, selection }} className="mx-auto max-w-[480px]" />
              <div className="mt-6 text-center">
                <p className="text-xs font-bold tracking-widest text-mango uppercase">Tu bowl · {SIZE_BY_ID[size].label}</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={bowlName({ size, selection })}
                    className="font-display text-xl text-rice sm:text-2xl"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {bowlName({ size, selection })}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Panel de opciones */}
          <div className="flex min-w-0 flex-col gap-6">
            <SizeToggle />
            <StepTabs active={step} onChange={setStep} />

            <div role="tabpanel" id={`panel-${step}`} aria-labelledby={`tab-${step}`}>
              <div className="mb-4 flex items-baseline justify-between gap-2">
                <h3 className="font-display text-2xl">{category.title}</h3>
                <p className="text-sm text-nori/60">
                  {limit === 1 ? 'Elige 1' : `Hasta ${limit}`} · {chosen.length} elegid{chosen.length === 1 ? 'o' : 'os'}
                </p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  {ingredientsOf(step).map((ingredient) => (
                    <IngredientCard
                      key={ingredient.id}
                      ingredient={ingredient}
                      selected={chosen.includes(ingredient.id)}
                      dimmed={limit > 1 && chosen.length >= limit}
                      onToggle={() => toggle(ingredient.id)}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex justify-between">
                {prev ? (
                  <button type="button" onClick={() => setStep(prev.id)} className="font-bold text-nori/70 hover:text-nori">
                    ← {prev.label}
                  </button>
                ) : (
                  <span />
                )}
                {next && (
                  <button type="button" onClick={() => setStep(next.id)} className="font-bold text-coral hover:text-coral-dark">
                    Siguiente: {next.label} →
                  </button>
                )}
              </div>
            </div>

            <SummaryBar />
          </div>
        </div>
      </div>
    </section>
  )
}
