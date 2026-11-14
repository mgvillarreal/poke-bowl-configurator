import { useInView } from 'motion/react'
import { startTransition, useEffect, useRef, useState, type ReactNode } from 'react'

interface RenderWhenVisibleProps {
  children: ReactNode
  /** Clases del contenedor: definen el espacio reservado (p. ej. aspect-square) */
  className?: string
}

/**
 * Monta su contenido solo cuando está por entrar en pantalla (y ya no lo desmonta).
 * Mientras tanto reserva el mismo espacio, así no hay saltos de diseño.
 * El montaje es de baja prioridad (startTransition): si llegan clics o scroll,
 * React los atiende primero en lugar de congelar la página dibujando bowls.
 */
export function RenderWhenVisible({ children, className = '' }: RenderWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '200px 0px' })
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (inView) startTransition(() => setShow(true))
  }, [inView])

  return (
    <div ref={ref} className={className}>
      {show ? children : null}
    </div>
  )
}
