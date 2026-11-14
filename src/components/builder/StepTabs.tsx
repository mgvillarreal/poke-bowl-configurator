import { motion } from 'motion/react'
import { CATEGORIES, SIZE_BY_ID, type CategoryId } from '../../data/menu'
import { useBowlStore } from '../../store/bowlStore'

interface StepTabsProps {
  active: CategoryId
  onChange: (id: CategoryId) => void
}

export function StepTabs({ active, onChange }: StepTabsProps) {
  const size = useBowlStore((s) => s.size)
  const selection = useBowlStore((s) => s.selection)

  return (
    <div role="tablist" aria-label="Pasos para armar tu bowl" className="flex flex-wrap gap-1">
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
            onClick={() => onChange(c.id)}
            className="relative shrink-0 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-coral"
          >
            {isActive && (
              <motion.span
                layoutId="step-pill"
                className="absolute inset-0 rounded-full bg-coral"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className={`relative flex items-center gap-2 ${isActive ? 'text-white' : 'text-nori/70'}`}>
              <span>
                {c.step}. {c.label}
              </span>
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${
                  isActive ? 'bg-white/25' : count > 0 ? 'bg-matcha/40 text-nori' : 'bg-nori/10'
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
