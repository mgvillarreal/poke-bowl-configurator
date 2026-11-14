import { motion } from 'motion/react'
import { SIZES } from '../../data/menu'
import { useT } from '../../i18n/useLocale'
import { formatMoney } from '../../lib/format'
import { useBowlStore } from '../../store/bowlStore'

export function SizeToggle() {
  const t = useT()
  const size = useBowlStore((s) => s.size)
  const setSize = useBowlStore((s) => s.setSize)

  return (
    <div role="radiogroup" aria-label={t.builder.sizeGroup} className="grid grid-cols-2 gap-1 rounded-2xl border-2 border-nori bg-white p-1">
      {SIZES.map((s) => {
        const active = s.id === size
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setSize(s.id)}
            className="relative rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
          >
            {active && (
              <motion.span
                layoutId="size-pill"
                className="absolute inset-0 rounded-xl bg-nori"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className={`relative block ${active ? 'text-rice' : 'text-nori'}`}>
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-display text-lg">{t.sizes[s.id].label}</span>
                <span className="font-bold">{formatMoney(s.price, t.intl)}</span>
              </span>
              <span className={`text-xs ${active ? 'text-rice/75' : 'text-nori/75'}`}>{t.sizes[s.id].description}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
