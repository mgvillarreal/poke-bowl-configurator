import { motion } from 'motion/react'
import { CATEGORIES, SIZE_BY_ID } from '../../data/menu'
import { useT } from '../../i18n/useLocale'
import { useBowlStore } from '../../store/bowlStore'

export function StepTabs() {
  const t = useT()
  const active = useBowlStore((s) => s.step)
  const setStep = useBowlStore((s) => s.setStep)
  const size = useBowlStore((s) => s.size)
  const selection = useBowlStore((s) => s.selection)

  return (
    <div role="tablist" aria-label={t.builder.steps} className="flex flex-wrap gap-1">
      {CATEGORIES.map((c) => {
        const isActive = c.id === active
        const count = selection[c.id].length
        const limit = SIZE_BY_ID[size].limits[c.id]
        return (
          <button
            key={c.id}
            type="button"
            role="tab"
            id={`tab-${c.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${c.id}`}
            onClick={() => setStep(c.id)}
            className="relative shrink-0 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
          >
            {isActive && (
              <motion.span
                layoutId="step-pill"
                className="absolute inset-0 rounded-full bg-coral"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className={`relative flex items-center gap-2 ${isActive ? 'text-nori' : 'text-nori/70'}`}>
              <span>
                {c.step}. {t.categories[c.id].label}
              </span>
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${
                  isActive ? 'bg-white/40' : count > 0 ? 'bg-matcha/40 text-nori' : 'bg-nori/10'
                }`}
              >
                {count}/{limit}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
