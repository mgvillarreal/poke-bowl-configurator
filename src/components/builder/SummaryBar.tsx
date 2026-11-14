import { motion } from 'motion/react'
import { bowlTotals } from '../../lib/bowl'
import { formatMoney } from '../../lib/format'
import { useBowlStore } from '../../store/bowlStore'
import { AnimatedNumber } from '../ui/AnimatedNumber'

export function SummaryBar() {
  const size = useBowlStore((s) => s.size)
  const selection = useBowlStore((s) => s.selection)
  const notify = useBowlStore((s) => s.notify)
  const totals = bowlTotals({ size, selection })
  const missingProtein = selection.protein.length === 0

  return (
    <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-3xl border-2 border-nori bg-white p-4 shadow-sticker-lg">
      <div>
        <p className="text-xs font-bold tracking-widest text-nori/60 uppercase">Total</p>
        <p className="font-display text-3xl leading-none">
          <AnimatedNumber value={totals.price} format={formatMoney} />
        </p>
        <p className="mt-1 text-xs text-nori/70">
          <AnimatedNumber value={totals.kcal} /> kcal · <AnimatedNumber value={totals.protein} /> g proteína
        </p>
      </div>

      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ y: 1, scale: 0.97 }}
        onClick={() =>
          notify(
            missingProtein
              ? 'Elige al menos una proteína (o tofu) para tu bowl.'
              : '¡Bowl agregado! Es una demo: no se hace ningún pedido real.',
          )
        }
        className="rounded-2xl border-2 border-nori bg-coral px-5 py-3 font-display text-white shadow-sticker transition-colors hover:bg-coral-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mango"
      >
        Agregar al pedido
      </motion.button>
    </div>
  )
}
