import { AnimatePresence, motion } from 'motion/react'
import { useT } from '../../i18n/useLocale'
import { AlertIcon, CheckIcon } from '../ui/Icons'
import { DIET_FILTERS, conflictsIn } from '../../lib/diet'
import { useBowlStore } from '../../store/bowlStore'

/** Preferencias de dieta: atenúan lo que no aplica y avisan si el bowl ya tiene algo incompatible */
export function DietFilters() {
  const t = useT()
  const filters = useBowlStore((s) => s.filters)
  const toggleFilter = useBowlStore((s) => s.toggleFilter)
  const removeConflicts = useBowlStore((s) => s.removeConflicts)
  const size = useBowlStore((s) => s.size)
  const selection = useBowlStore((s) => s.selection)
  const conflicts = conflictsIn({ size, selection }, filters).length

  return (
    <div>
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mb-2 text-sm font-bold">{t.diet.legend}</legend>
        {DIET_FILTERS.map((filter) => {
          const active = filters.includes(filter)
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={active}
              onClick={() => toggleFilter(filter)}
              className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm font-bold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori ${
                active ? 'border-nori bg-matcha text-nori' : 'border-nori/40 bg-white text-nori hover:border-nori'
              }`}
            >
              <span
                aria-hidden
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 border-nori ${active ? 'bg-nori text-rice' : ''}`}
              >
                {active && <CheckIcon size={11} strokeWidth={3.5} />}
              </span>
              {t.diet.filters[filter]}
            </button>
          )
        })}
      </fieldset>

      <div role="status">
        <AnimatePresence>
          {conflicts > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-coral-ink bg-sakura px-4 py-2 text-sm font-bold">
                <span className="flex items-center gap-2">
                  <AlertIcon size={16} className="shrink-0 text-coral-ink" />
                  {t.diet.conflicts(conflicts)}
                </span>
                <button
                  type="button"
                  onClick={removeConflicts}
                  className="rounded-full border-2 border-nori bg-white px-3 py-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
                >
                  {t.diet.removeConflicts}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
