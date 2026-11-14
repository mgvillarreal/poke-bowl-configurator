import { motion } from 'motion/react'
import { useId, useState } from 'react'
import { useT } from '../../i18n/useLocale'
import { bowlTotals } from '../../lib/bowl'
import { formatMoney } from '../../lib/format'
import { useBowlStore } from '../../store/bowlStore'
import { AnimatedNumber } from '../ui/AnimatedNumber'

export function SummaryBar() {
  const t = useT()
  const size = useBowlStore((s) => s.size)
  const selection = useBowlStore((s) => s.selection)
  const notify = useBowlStore((s) => s.notify)
  const setStep = useBowlStore((s) => s.setStep)
  const addToCart = useBowlStore((s) => s.addToCart)
  const totals = bowlTotals({ size, selection })
  const [name, setName] = useState('')
  const nameId = useId()

  /** Antes de agregar al pedido, lleva al paso que falta */
  const handleAdd = () => {
    if (selection.base.length === 0) {
      setStep('base')
      notify({ type: 'needBase' })
    } else if (selection.protein.length === 0) {
      setStep('protein')
      notify({ type: 'needProtein' })
    } else {
      addToCart({ size, selection }, name)
      setName('')
    }
  }

  return (
    <div className="rounded-3xl border-2 border-nori bg-white p-4 shadow-sticker-lg">
      <label htmlFor={nameId} className="text-sm font-bold">
        {t.cart.forWhom}
      </label>
      <input
        id={nameId}
        value={name}
        maxLength={24}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        placeholder={t.cart.forWhomPlaceholder}
        autoComplete="off"
        className="mt-1 w-full rounded-xl border-2 border-nori/50 bg-rice px-3 py-2 text-nori placeholder:text-nori/60 focus:border-nori focus:outline-none"
      />

      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-nori/75 uppercase">{t.summary.total}</p>
          <p data-testid="bowl-total" className="font-display text-3xl leading-none">
            <AnimatedNumber value={totals.price} format={(v) => formatMoney(v, t.intl)} />
          </p>
          <p className="mt-1 text-xs text-nori/75">
            <AnimatedNumber value={totals.kcal} /> kcal · <AnimatedNumber value={totals.protein} /> {t.summary.protein}
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ y: 1, scale: 0.97 }}
          onClick={handleAdd}
          className="rounded-2xl border-2 border-nori bg-coral px-5 py-3 font-display text-nori shadow-sticker transition-colors hover:bg-coral-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori"
        >
          {t.summary.add}
        </motion.button>
      </div>
    </div>
  )
}
