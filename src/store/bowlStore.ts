import { create } from 'zustand'
import {
  CATEGORIES,
  DEFAULT_BOWL,
  EMPTY_SELECTION,
  INGREDIENT_BY_ID,
  SIZE_BY_ID,
  ingredientsOf,
  type BowlConfig,
  type CategoryId,
  type Selection,
  type SizeId,
} from '../data/menu'

/**
 * Los avisos se guardan como datos, no como texto:
 * el Toast los traduce al idioma activo al mostrarlos.
 */
export type NoticeMessage =
  | { type: 'limit'; category: CategoryId; limit: number; upsell: boolean }
  | { type: 'resized'; size: SizeId }
  | { type: 'surprise' }
  | { type: 'needBase' }
  | { type: 'needProtein' }

interface Notice {
  id: number
  message: NoticeMessage
}

interface BowlState extends BowlConfig {
  step: CategoryId
  notice: Notice | null
  checkoutOpen: boolean
  setStep: (step: CategoryId) => void
  setSize: (size: SizeId) => void
  toggle: (ingredientId: string) => void
  surprise: () => void
  clear: () => void
  notify: (message: NoticeMessage) => void
  dismissNotice: () => void
  openCheckout: () => void
  closeCheckout: () => void
}

let noticeId = 0
const makeNotice = (message: NoticeMessage): Notice => ({ id: ++noticeId, message })

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

export const countSelected = (selection: Selection) =>
  CATEGORIES.reduce((sum, c) => sum + selection[c.id].length, 0)

export const useBowlStore = create<BowlState>((set, get) => ({
  ...DEFAULT_BOWL,
  step: 'base',
  notice: null,
  checkoutOpen: false,

  setStep: (step) => set({ step }),

  setSize: (size) => {
    const { selection, trimmed } = fitToSize(get().selection, size)
    set({
      size,
      selection,
      notice: trimmed ? makeNotice({ type: 'resized', size }) : get().notice,
    })
  },

  toggle: (ingredientId) => {
    const { size, selection } = get()
    const category = INGREDIENT_BY_ID[ingredientId].category
    const current = selection[category]
    const limit = SIZE_BY_ID[size].limits[category]

    let next: string[]
    if (current.includes(ingredientId)) {
      // La base no se quita tocándola: se cambia por otra (o se vacía todo el bowl)
      if (category === 'base') return
      next = current.filter((id) => id !== ingredientId)
    } else if (limit === 1) {
      next = [ingredientId]
    } else if (current.length >= limit) {
      const upsell = size === 'regular' && SIZE_BY_ID.grande.limits[category] > limit
      set({ notice: makeNotice({ type: 'limit', category, limit, upsell }) })
      return
    } else {
      next = [...current, ingredientId]
    }

    set({ selection: { ...selection, [category]: next } })
  },

  surprise: () => {
    const limits = SIZE_BY_ID[get().size].limits
    const ids = (category: CategoryId, count: number) =>
      pickRandom(ingredientsOf(category), count).map((i) => i.id)

    set({
      selection: {
        base: ids('base', 1),
        protein: ids('protein', limits.protein),
        extra: ids('extra', limits.extra),
        sauce: ids('sauce', 1),
        topping: ids('topping', 2),
      },
      notice: makeNotice({ type: 'surprise' }),
    })
  },

  // Sin aviso: el bowl vacío ya lo dice visualmente
  clear: () => set({ selection: EMPTY_SELECTION, step: 'base', notice: null }),

  notify: (message) => set({ notice: makeNotice(message) }),
  dismissNotice: () => set({ notice: null }),

  openCheckout: () => set({ checkoutOpen: true, notice: null }),
  closeCheckout: () => set({ checkoutOpen: false }),
}))
