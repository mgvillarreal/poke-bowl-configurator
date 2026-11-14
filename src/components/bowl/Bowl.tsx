import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { INGREDIENT_BY_ID, type BowlConfig } from '../../data/menu'
import { selectedIngredients } from '../../lib/bowl'
import { BowlArt, IngredientArt } from '../art/IngredientArt'

interface BowlProps {
  config: BowlConfig
  className?: string
}

/** Tamaño de cada montoncito (en % del bowl) según cuántos haya */
const itemSizeFor = (count: number) => (count <= 2 ? 44 : count <= 4 ? 38 : count <= 6 ? 34 : 31)

/**
 * El bowl visto desde arriba. Es una función de `config`:
 * base (disco) → montoncitos en círculo (proteínas y complementos) → salsas → toppings.
 */
export function Bowl({ config, className = '' }: BowlProps) {
  const { selection } = config
  const base = INGREDIENT_BY_ID[selection.base[0]]
  const ring = [...selection.protein, ...selection.extra].map((id) => INGREDIENT_BY_ID[id])
  const sauces = selection.sauce.map((id) => INGREDIENT_BY_ID[id])
  const toppings = selection.topping.map((id) => INGREDIENT_BY_ID[id])

  const size = itemSizeFor(ring.length)
  const radius = ring.length === 1 ? 0 : 24

  // Pequeño rebote del bowl cada vez que cambia algo
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const reduceMotion = useReducedMotion()
  const signature = selectedIngredients(config)
    .map((i) => i.id)
    .join()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (reduceMotion) return
    animate(scope.current, { scale: [1, 0.97, 1.015, 1] }, { duration: 0.45, ease: 'easeOut' })
  }, [signature, animate, scope, reduceMotion])

  return (
    <div ref={scope} className={`relative aspect-square w-full ${className}`}>
      <div className="absolute inset-0 drop-shadow-[0_18px_30px_rgba(20,26,58,0.35)]">
        <BowlArt />
      </div>

      {/* Base: llena el interior del bowl */}
      <AnimatePresence>
        {base && (
          <motion.div
            key={base.id}
            className="absolute top-[7%] left-[7%] h-[86%] w-[86%] overflow-hidden rounded-full"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <IngredientArt ingredient={base} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proteínas y complementos: en círculo, caen desde arriba */}
      <AnimatePresence>
        {ring.map((ingredient, i) => {
          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / ring.length
          const x = 50 + radius * Math.cos(angle)
          const y = 50 + radius * Math.sin(angle)
          return (
            <motion.div
              key={ingredient.id}
              className="absolute drop-shadow-[0_4px_5px_rgba(20,26,58,0.25)]"
              initial={{ opacity: 0, scale: 1.5, y: -90, left: `${x - size / 2}%`, top: `${y - size / 2}%`, width: `${size}%`, height: `${size}%` }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                left: `${x - size / 2}%`,
                top: `${y - size / 2}%`,
                width: `${size}%`,
                height: `${size}%`,
                rotate: (angle * 180) / Math.PI + 90,
              }}
              exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <IngredientArt ingredient={ingredient} />
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Salsas: se "dibujan" desde el centro hacia afuera */}
      <AnimatePresence>
        {sauces.map((sauce, i) => (
          <motion.div
            key={sauce.id}
            className="pointer-events-none absolute top-[9%] left-[9%] h-[82%] w-[82%]"
            style={{ rotate: i * 70 }}
            initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ opacity: 1, clipPath: 'circle(75% at 50% 50%)' }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <IngredientArt ingredient={sauce} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Toppings: caen espolvoreados */}
      <AnimatePresence>
        {toppings.map((topping, i) => (
          <motion.div
            key={topping.id}
            className="pointer-events-none absolute top-[9%] left-[9%] h-[82%] w-[82%]"
            style={{ rotate: i * 40 }}
            initial={{ opacity: 0, scale: 1.25 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          >
            <IngredientArt ingredient={topping} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
