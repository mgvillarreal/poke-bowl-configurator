import { AnimatePresence, motion } from 'motion/react'
import { CATEGORIES, SIZE_BY_ID, ingredientsOf } from '../../data/menu'
import { useT } from '../../i18n/useLocale'
import { bowlName } from '../../lib/bowl'
import { failedFilters } from '../../lib/diet'
import { seigaiha } from '../../lib/svg'
import { countSelected, useBowlStore } from '../../store/bowlStore'
import { Bowl } from '../bowl/Bowl'
import { RenderWhenVisible } from '../ui/RenderWhenVisible'
import { DietFilters } from './DietFilters'
import { IngredientCard } from './IngredientCard'
import { SizeToggle } from './SizeToggle'
import { StepTabs } from './StepTabs'
import { SummaryBar } from './SummaryBar'

export function Builder() {
  const t = useT()
  const step = useBowlStore((s) => s.step)
  const setStep = useBowlStore((s) => s.setStep)
  const size = useBowlStore((s) => s.size)
  const selection = useBowlStore((s) => s.selection)
  const toggle = useBowlStore((s) => s.toggle)
  const surprise = useBowlStore((s) => s.surprise)
  const clear = useBowlStore((s) => s.clear)
  const filters = useBowlStore((s) => s.filters)

  const config = { size, selection }
  const hasItems = countSelected(selection) > 0
  const category = t.categories[step]
  const limit = SIZE_BY_ID[size].limits[step]
  const chosen = selection[step]
  const index = CATEGORIES.findIndex((c) => c.id === step)
  const prev = CATEGORIES[index - 1]
  const next = CATEGORIES[index + 1]
  const name = bowlName(config, t)

  return (
    <section id="armar" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold tracking-widest text-coral-ink uppercase">{t.builder.eyebrow}</p>
            <h2 className="font-display text-4xl sm:text-5xl">{t.builder.title}</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Solo existe cuando hay algo que vaciar */}
            <AnimatePresence mode="popLayout">
              {hasItems && (
                <motion.button
                  key="clear"
                  layout
                  type="button"
                  onClick={clear}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-2xl border-2 border-nori bg-white px-4 py-2 font-bold shadow-sticker focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
                    <path
                      d="M4 6h12M8 6V4h4v2m-6 0 .7 10h6.6L14 6M8.5 9v4.5M11.5 9v4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t.builder.clear}
                </motion.button>
              )}
            </AnimatePresence>
            <motion.button
              layout
              type="button"
              onClick={surprise}
              whileHover={{ rotate: -2, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl border-2 border-nori bg-mango px-4 py-2 font-bold shadow-sticker focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
            >
              {t.builder.surprise}
            </motion.button>
          </div>
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
              <RenderWhenVisible className="mx-auto aspect-square max-w-[480px]">
                <Bowl config={config} emptyHint={t.builder.emptyHint} imageWidth={480} mobileImageWidth={310} />
              </RenderWhenVisible>
              <div className="mt-6 text-center">
                <p className="text-xs font-bold tracking-widest text-mango uppercase">
                  {t.builder.yourBowl(t.sizes[size].label)}
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={name}
                    className="font-display text-xl text-rice sm:text-2xl"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {name}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Panel de opciones */}
          <div className="flex min-w-0 flex-col gap-6">
            <SizeToggle />
            <DietFilters />
            <StepTabs />

            <div role="tabpanel" id={`panel-${step}`} aria-labelledby={`tab-${step}`}>
              <div className="mb-4 flex items-baseline justify-between gap-2">
                <h3 className="font-display text-2xl">{category.title}</h3>
                <p className="text-sm text-nori/75">
                  {limit === 1 ? t.builder.chooseOne : t.builder.upTo(limit)} · {t.builder.chosen(chosen.length)}
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
                      blockedBy={failedFilters(ingredient, filters)}
                      onToggle={() => toggle(ingredient.id)}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex justify-between">
                {prev ? (
                  <button type="button" onClick={() => setStep(prev.id)} className="font-bold text-nori/70 hover:text-nori">
                    ← {t.categories[prev.id].label}
                  </button>
                ) : (
                  <span />
                )}
                {next && (
                  <button type="button" onClick={() => setStep(next.id)} className="font-bold text-coral-ink hover:text-nori">
                    {t.builder.next(t.categories[next.id].label)}
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
