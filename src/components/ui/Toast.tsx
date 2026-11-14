import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useT } from '../../i18n/useLocale'
import { useBowlStore } from '../../store/bowlStore'

/** Tiempo suficiente para leer con calma (WCAG 2.2.1: tiempo ajustable) */
const DURATION_MS = 6000

/**
 * Aviso flotante (límites, bowl cargado…). Se traduce al mostrarse y se cierra solo,
 * pero se pausa mientras el mouse está encima o tiene el foco, y se puede cerrar a mano.
 */
export function Toast() {
  const t = useT()
  const notice = useBowlStore((s) => s.notice)
  const dismiss = useBowlStore((s) => s.dismissNotice)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!notice || paused) return
    const timer = setTimeout(dismiss, DURATION_MS)
    return () => clearTimeout(timer)
  }, [notice, paused, dismiss])

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-6 z-[60] flex justify-center">
      <AnimatePresence mode="wait" onExitComplete={() => setPaused(false)}>
        {notice && (
          <motion.div
            key={notice.id}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border-2 border-nori bg-mango py-2 pr-2 pl-5 text-nori shadow-sticker"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <p className="py-1 text-center font-bold">{t.notice(notice.message)}</p>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t.checkout.close}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/40 focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-nori"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
