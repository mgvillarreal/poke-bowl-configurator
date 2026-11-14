import { create } from 'zustand'
import {
  CATEGORIES,
  CATEGORY_BY_ID,
  DEFAULT_BOWL,
  INGREDIENT_BY_ID,
  SIZE_BY_ID,
  ingredientsOf,
  type BowlConfig,
  type Selection,
  type SizeId,
} from '../data/menu'

interface Notice {
  id: number
  text: string
}

interface BowlState extends BowlConfig {
  notice: Notice | null
  setSize: (size: SizeId) => void
  toggle: (ingredientId: string) => void
  surprise: () => void
  notify: (text: string) => void
  dismissNotice: () => void
}

let noticeId = 0
const makeNotice = (text: string): Notice => ({ id: ++noticeId, text })

/** Recorta cada categoría al límite del tamaño. Devuelve si hubo que quitar algo. */
function fitToSize(selection: Selection, size: SizeId): { selection: Selection; trimmed: boolean } {
  const limits = SIZE_BY_ID[size].limits
  let trimmed = false
  const next = { ...selection }
  for (const c of CATEGORIES) {
    if (next[c.id].length > limits[c.id]) {
      next[c.id] = next[c.id].slice(0, limits[c.id])
      trimmed = true
    }
  }
  return { selection: next, trimmed }
}

function pickRandom<T>(list: T[], count: number): T[] {
  return [...list].sort(() => Math.random() - 0.5).slice(0, count)
}

export const useBowlStore = create<BowlState>((set, get) => ({
  ...DEFAULT_BOWL,
  notice: null,

  setSize: (size) => {
    const { selection, trimmed } = fitToSize(get().selection, size)
    set({
      size,
      selection,
      notice: trimmed ? makeNotice(`Ajustamos tu bowl al tamaño ${SIZE_BY_ID[size].label}.`) : get().notice,
    })
  },

  toggle: (ingredientId) => {
    const { size, selection } = get()
    const ingredient = INGREDIENT_BY_ID[ingredientId]
    const category = CATEGORY_BY_ID[ingredient.category]
    const current = selection[category.id]
    const limit = SIZE_BY_ID[size].limits[category.id]

    let next: string[]
    if (current.includes(ingredientId)) {
      // La base es obligatoria: no se puede quedar vacía
      if (category.id === 'base') return
      next = current.filter((id) => id !== ingredientId)
    } else if (limit === 1) {
      next = [ingredientId]
    } else if (current.length >= limit) {
      const [one, many] = category.noun
      const upsell = size === 'regular' && SIZE_BY_ID.grande.limits[category.id] > limit
      set({
        notice: makeNotice(
          upsell
            ? `El Regular lleva hasta ${limit} ${limit === 1 ? one : many}. ¡Cámbiate a Grande para más!`
            : `Máximo ${limit} ${limit === 1 ? one : many}. Quita uno para cambiarlo.`,
        ),
      })
      return
    } else {
      next = [...current, ingredientId]
    }

    set({ selection: { ...selection, [category.id]: next } })
  },

  surprise: () => {
    const limits = SIZE_BY_ID[get().size].limits
    const ids = (category: keyof Selection, count: number) =>
      pickRandom(ingredientsOf(category), count).map((i) => i.id)

    set({
      selection: {
        base: ids('base', 1),
        protein: ids('protein', limits.protein),
        extra: ids('extra', limits.extra),
        sauce: ids('sauce', 1),
        topping: ids('topping', 2),
      },
      notice: makeNotice('🎲 ¡Bowl sorpresa! Ajústalo a tu gusto.'),
    })
  },

  notify: (text) => set({ notice: makeNotice(text) }),
  dismissNotice: () => set({ notice: null }),
}))
