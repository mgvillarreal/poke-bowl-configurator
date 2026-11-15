import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { INGREDIENT_BY_ID, type BowlConfig } from '../../data/menu'
import { selectedIngredients } from '../../lib/bowl'
import { BowlArt, IngredientArt } from '../art/IngredientArt'

interface BowlProps {
  config: BowlConfig
  /** Texto que aparece dentro del bowl cuando está vacío */
  emptyHint?: string
  /** Ancho máximo con que se dibuja el bowl (px CSS): define qué tamaño de foto se pide */
  imageWidth?: number
  /** Ancho máximo en pantallas chicas (≤ 640 px) */
  mobileImageWidth?: number
  /**
   * Bowl del contenido principal (hero): sus capas aparecen ya visibles (sin fundido),
   * para que cuenten como pintadas de inmediato (LCP).
   */
  priority?: boolean
  className?: string
}

/** Tamaño de cada montoncito (en % del bowl) según cuántos haya */
const itemSizeFor = (count: number) => (count <= 2 ? 44 : count <= 4 ? 38 : count <= 6 ? 34 : 31)

/**
 * Salsas y toppings van al centro y más chicos que el bowl, con bordes difuminados:
 * así decoran sin tapar la proteína ni los complementos del anillo.
 */
const SAUCE_SIZE = 62
/** Varios toppings: cada uno un poco más chico y desplazado, para que se vean todos */
const TOPPING_LAYOUT = [
  { size: 46, dx: 0, dy: 0 },
  { size: 40, dx: 7, dy: -6 },
  { size: 36, dx: -7, dy: 6 },
]
const SOFT_EDGE = 'radial-gradient(circle, #000 52%, transparent 71%)'

/** Posición centrada (en %) de una capa de cierto tamaño, con desplazamiento opcional */
const centered = (size: number, dx = 0, dy = 0) => ({
  left: `${50 - size / 2 + dx}%`,
  top: `${50 - size / 2 + dy}%`,
  width: `${size}%`,
  height: `${size}%`,
  maskImage: SOFT_EDGE,
  WebkitMaskImage: SOFT_EDGE,
})

/**
 * El bowl visto desde arriba. Es una función de `config`:
 * base (disco) → montoncitos en círculo (proteínas y complementos) → salsas → toppings.
 */
export function Bowl({
  config,
  emptyHint,
  imageWidth = 480,
  mobileImageWidth = imageWidth,
  priority = false,
  className = '',
}: BowlProps) {
  const { selection } = config
  const base = INGREDIENT_BY_ID[selection.base[0]]
  const ring = [...selection.protein, ...selection.extra].map((id) => INGREDIENT_BY_ID[id])
  const sauces = selection.sauce.map((id) => INGREDIENT_BY_ID[id])
  const toppings = selection.topping.map((id) => INGREDIENT_BY_ID[id])

  const size = itemSizeFor(ring.length)
  /** Ancho en pantalla de una capa que ocupa `percent` % del bowl */
  const px = (percent: number) => (imageWidth * percent) / 100
  const mobilePx = (percent: number) => (mobileImageWidth * percent) / 100
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
        <BowlArt width={imageWidth} mobileWidth={mobileImageWidth} />
      </div>

      <AnimatePresence initial={!priority}>
        {emptyHint && signature === '' && (
          <motion.p
            key="empty"
            className="absolute inset-0 flex items-center justify-center p-[24%] text-center font-display text-lg text-nori/75 sm:text-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.25 }}
          >
            {emptyHint}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Base: llena el interior del bowl */}
      <AnimatePresence initial={!priority}>
        {base && (
          <motion.div
            key={base.id}
            className="absolute top-[7%] left-[7%] h-[86%] w-[86%] overflow-hidden rounded-full"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <IngredientArt ingredient={base} width={px(86)} mobileWidth={mobilePx(86)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proteínas y complementos: en círculo, caen desde arriba */}
      <AnimatePresence initial={!priority}>
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
              <IngredientArt ingredient={ingredient} width={px(size)} mobileWidth={mobilePx(size)} />
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Salsas: se "dibujan" desde el centro hacia afuera */}
      <AnimatePresence initial={!priority}>
        {sauces.map((sauce, i) => (
          <motion.div
            key={sauce.id}
            className="pointer-events-none absolute"
            style={{ ...centered(SAUCE_SIZE), rotate: i * 80 }}
            initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ opacity: 1, clipPath: 'circle(75% at 50% 50%)' }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <IngredientArt ingredient={sauce} width={px(SAUCE_SIZE)} mobileWidth={mobilePx(SAUCE_SIZE)} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Toppings: caen espolvoreados */}
      <AnimatePresence initial={!priority}>
        {toppings.map((topping, i) => (
          <motion.div
            key={topping.id}
            className="pointer-events-none absolute"
            style={(() => {
              const { size, dx, dy } = TOPPING_LAYOUT[i % TOPPING_LAYOUT.length]
              return { ...centered(size, dx, dy), rotate: i * 55 }
            })()}
            initial={{ opacity: 0, scale: 1.25 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          >
            <IngredientArt ingredient={topping} width={px(TOPPING_LAYOUT[i % TOPPING_LAYOUT.length].size)} mobileWidth={mobilePx(TOPPING_LAYOUT[i % TOPPING_LAYOUT.length].size)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
