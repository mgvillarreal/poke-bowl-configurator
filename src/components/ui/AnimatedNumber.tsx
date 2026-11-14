import { motion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

interface AnimatedNumberProps {
  value: number
  format?: (value: number) => string
  className?: string
}

/** Número que "rueda" hasta su nuevo valor */
export function AnimatedNumber({ value, format = String, className }: AnimatedNumberProps) {
  const spring = useSpring(value, { stiffness: 140, damping: 22 })
  const text = useTransform(spring, (v) => format(Math.round(v)))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span className={`tabular-nums ${className ?? ''}`}>{text}</motion.span>
}
