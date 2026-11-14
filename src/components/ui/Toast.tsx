import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { useBowlStore } from '../../store/bowlStore'

/** Aviso flotante (límites, bowl agregado…). Se cierra solo. */
export function Toast() {
  const notice = useBowlStore((s) => s.notice)
  const dismiss = useBowlStore((s) => s.dismissNotice)

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(dismiss, 3500)
    return () => clearTimeout(timer)
  }, [notice, dismiss])

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-6 z-50 flex justify-center">
      <AnimatePresence mode="wait">
        {notice && (
          <motion.p
            key={notice.id}
            className="pointer-events-auto max-w-md rounded-2xl border-2 border-nori bg-mango px-5 py-3 text-center font-bold text-nori shadow-sticker"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            {notice.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
