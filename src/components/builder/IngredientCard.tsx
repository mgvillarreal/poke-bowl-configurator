import { AnimatePresence, motion } from 'motion/react'
import type { Ingredient, Tag } from '../../data/menu'
import { useT } from '../../i18n/useLocale'
import { ingredientName } from '../../lib/bowl'
import { dietLabels, type DietFilter } from '../../lib/diet'
import { formatMoney } from '../../lib/format'
import { DietChips } from '../ui/DietChips'
import { RenderWhenVisible } from '../ui/RenderWhenVisible'
import { IngredientArt } from '../art/IngredientArt'

interface IngredientCardProps {
  ingredient: Ingredient
  selected: boolean
  /** Ya se alcanzó el límite de la categoría (se atenúa, pero sigue avisando al tocarla) */
  dimmed: boolean
  /** Preferencias de dieta activas que este ingrediente no cumple */
  blockedBy: DietFilter[]
  onToggle: () => void
}

const TAG_STYLES: Record<Tag, string> = {
  popular: 'bg-mango',
  spicy: 'bg-coral',
  new: 'bg-matcha',
}

export function IngredientCard({ ingredient, selected, dimmed, blockedBy, onToggle }: IngredientCardProps) {
  const t = useT()
  const blocked = blockedBy.length > 0
  // Un ingrediente no apto que ya está elegido se puede quitar; si no está elegido, no se puede agregar
  const unavailable = blocked && !selected

  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      aria-disabled={unavailable || undefined}
      onClick={onToggle}
      whileTap={unavailable ? undefined : { scale: 0.95 }}
      className={`group relative flex flex-col items-center rounded-3xl border-2 p-3 text-center transition-[background-color,border-color,box-shadow] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-nori ${
        selected
          ? blocked
            ? 'border-coral-ink bg-sakura shadow-sticker'
            : 'border-nori bg-sakura shadow-sticker'
          : unavailable
            ? 'cursor-not-allowed border-dashed border-nori/40 bg-white'
            : 'border-nori/10 bg-white hover:border-nori/40'
      }`}
    >
      {ingredient.tag && (
        <span
          className={`absolute -top-2 left-3 z-10 rotate-[-4deg] rounded-full border-2 border-nori px-2 text-[11px] font-bold ${TAG_STYLES[ingredient.tag]}`}
        >
          {t.tags[ingredient.tag]}
        </span>
      )}

      <AnimatePresence>
        {selected && (
          <motion.span
            className="absolute -top-2 -right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-nori bg-coral text-nori"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            aria-hidden
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4">
              <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>

      {/* Al llegar al límite o no ser apto, solo se atenúa la imagen: el texto mantiene su contraste */}
      <span
        className={`mb-2 block aspect-square w-full max-w-28 rounded-full bg-rice p-1.5 transition-[transform,opacity,filter] duration-300 ${
          unavailable ? 'opacity-35 grayscale' : 'group-hover:scale-105 group-hover:rotate-6'
        } ${dimmed && !selected && !unavailable ? 'opacity-40 grayscale' : ''}`}
      >
        <RenderWhenVisible className="h-full w-full">
          <IngredientArt ingredient={ingredient} />
        </RenderWhenVisible>
      </span>
      <span className="text-sm leading-tight font-bold">{ingredientName(t, ingredient.id)}</span>
      <span className="mt-0.5 text-xs text-nori/75">
        {ingredient.price > 0 ? `+${formatMoney(ingredient.price, t.intl)}` : t.card.included} · {ingredient.kcal} kcal
      </span>

      {blocked ? (
        <span className="mt-1.5 text-[11px] leading-tight font-bold text-coral-ink">
          ⚠ {blockedBy.map((f) => t.diet.reasons[f]).join(' · ')}
        </span>
      ) : (
        <DietChips {...dietLabels(ingredient)} className="mt-1.5" />
      )}
    </motion.button>
  )
}
