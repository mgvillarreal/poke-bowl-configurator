import { CATEGORIES, INGREDIENT_BY_ID, SIZE_BY_ID, type BowlConfig, type Ingredient } from '../data/menu'
import type { Messages } from '../i18n/messages'

/** Todos los ingredientes elegidos, en orden de categoría */
export function selectedIngredients(config: BowlConfig): Ingredient[] {
  return CATEGORIES.flatMap((c) => config.selection[c.id].map((id) => INGREDIENT_BY_ID[id]))
}

/** Precio y nutrición: siempre se calculan, nunca se guardan */
export function bowlTotals(config: BowlConfig) {
  const items = selectedIngredients(config)
  return {
    price: SIZE_BY_ID[config.size].price + items.reduce((sum, i) => sum + i.price, 0),
    kcal: items.reduce((sum, i) => sum + i.kcal, 0),
    protein: items.reduce((sum, i) => sum + i.protein, 0),
  }
}

/** Ingredientes con costo extra, para el desglose del checkout */
export const premiumIngredients = (config: BowlConfig) => selectedIngredients(config).filter((i) => i.price > 0)

export const ingredientName = (t: Messages, id: string) => t.ingredients[id] ?? id

/** Nombre corto del bowl a partir de sus proteínas y la salsa */
export function bowlName(config: BowlConfig, t: Messages): string {
  const { protein, sauce } = config.selection
  if (selectedIngredients(config).length === 0) return t.builder.emptyName
  const main = protein.length ? protein.map((id) => ingredientName(t, id)).join(' + ') : t.builder.veggie
  return sauce[0] ? `${main} · ${ingredientName(t, sauce[0])}` : main
}
