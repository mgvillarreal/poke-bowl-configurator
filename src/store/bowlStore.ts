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
import { conflictsIn, failedFilters, type DietFilter } from '../lib/diet'

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
  | { type: 'loaded'; name: string }
  | { type: 'notSuitable'; ingredientId: string; filters: DietFilter[] }
  | { type: 'conflictsRemoved'; count: number }

interface Notice {
  id: number
  message: NoticeMessage
}

export interface CartItem {
  id: string
  /** Para quién es el bowl (opcional) */
  name: string
  /** Nombre del bowl de la casa, si vino de ahí sin cambios */
  title?: string
  config: BowlConfig
  quantity: number
}

interface BowlState extends BowlConfig {
  step: CategoryId
  notice: Notice | null
  checkoutOpen: boolean
  filters: DietFilter[]
  cart: CartItem[]

  setStep: (step: CategoryId) => void
  setSize: (size: SizeId) => void
  toggle: (ingredientId: string) => void
  surprise: () => void
  clear: () => void
  loadBowl: (config: BowlConfig, name: string) => void

  toggleFilter: (filter: DietFilter) => void
  removeConflicts: () => void

  addToCart: (config: BowlConfig, name: string, title?: string) => void
  updateCartItem: (id: string, patch: Partial<Pick<CartItem, 'name' | 'quantity'>>) => void
  removeCartItem: (id: string) => void
  clearCart: () => void

  notify: (message: NoticeMessage) => void
  dismissNotice: () => void
  openCheckout: () => void
  closeCheckout: () => void
}

let noticeId = 0
const makeNotice = (message: NoticeMessage): Notice => ({ id: ++noticeId, message })

let cartId = 0

/** Copia profunda de una selección (los bowls de la casa no se deben mutar) */
const copySelection = (selection: Selection): Selection =>
  Object.fromEntries(CATEGORIES.map((c) => [c.id, [...selection[c.id]]])) as Selection

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
  filters: [],
  cart: [],

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
    const { size, selection, filters } = get()
    const ingredient = INGREDIENT_BY_ID[ingredientId]
    const category = ingredient.category
    const current = selection[category]
    const limit = SIZE_BY_ID[size].limits[category]

    let next: string[]
    if (current.includes(ingredientId)) {
      // La base no se quita tocándola: se cambia por otra (o se vacía todo el bowl)
      if (category === 'base') return
      next = current.filter((id) => id !== ingredientId)
    } else {
      // Respeta las preferencias de dieta activas
      const failed = failedFilters(ingredient, filters)
      if (failed.length > 0) {
        set({ notice: makeNotice({ type: 'notSuitable', ingredientId, filters: failed }) })
        return
      }
      if (limit === 1) {
        next = [ingredientId]
      } else if (current.length >= limit) {
        const upsell = size === 'regular' && SIZE_BY_ID.grande.limits[category] > limit
        set({ notice: makeNotice({ type: 'limit', category, limit, upsell }) })
        return
      } else {
        next = [...current, ingredientId]
      }
    }

    set({ selection: { ...selection, [category]: next } })
  },

  surprise: () => {
    const { size, filters } = get()
    const limits = SIZE_BY_ID[size].limits
    // Solo ingredientes que cumplen las preferencias activas
    const ids = (category: CategoryId, count: number) =>
      pickRandom(
        ingredientsOf(category).filter((i) => failedFilters(i, filters).length === 0),
        count,
      ).map((i) => i.id)

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

  loadBowl: (config, name) =>
    set({
      size: config.size,
      selection: copySelection(config.selection),
      step: 'base',
      notice: makeNotice({ type: 'loaded', name }),
    }),

  toggleFilter: (filter) => {
    const { filters } = get()
    set({ filters: filters.includes(filter) ? filters.filter((f) => f !== filter) : [...filters, filter] })
  },

  removeConflicts: () => {
    const { size, selection, filters } = get()
    const conflicts = new Set(conflictsIn({ size, selection }, filters).map((i) => i.id))
    if (conflicts.size === 0) return
    const next = Object.fromEntries(
      CATEGORIES.map((c) => [c.id, selection[c.id].filter((id) => !conflicts.has(id))]),
    ) as Selection
    set({ selection: next, notice: makeNotice({ type: 'conflictsRemoved', count: conflicts.size }) })
  },

  addToCart: (config, name, title) =>
    set((state) => ({
      cart: [
        ...state.cart,
        {
          id: `bowl-${++cartId}`,
          name: name.trim(),
          title,
          config: { size: config.size, selection: copySelection(config.selection) },
          quantity: 1,
        },
      ],
      checkoutOpen: true,
      notice: null,
    })),

  updateCartItem: (id, patch) =>
    set((state) => ({ cart: state.cart.map((item) => (item.id === id ? { ...item, ...patch } : item)) })),

  removeCartItem: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),

  clearCart: () => set({ cart: [] }),

  notify: (message) => set({ notice: makeNotice(message) }),
  dismissNotice: () => set({ notice: null }),

  openCheckout: () => set({ checkoutOpen: true, notice: null }),
  closeCheckout: () => set({ checkoutOpen: false }),
}))
