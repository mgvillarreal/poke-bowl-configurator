import { CATEGORIES, INGREDIENT_BY_ID, SIZE_BY_ID, type BowlConfig, type Ingredient } from '../data/menu'

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

/** Nombre corto del bowl a partir de sus proteínas y la salsa */
export function bowlName(config: BowlConfig): string {
  const proteins = config.selection.protein.map((id) => INGREDIENT_BY_ID[id].name)
  const sauce = config.selection.sauce[0]
  const main = proteins.length ? proteins.join(' + ') : 'Veggie'
  return sauce ? `${main} · ${INGREDIENT_BY_ID[sauce].name}` : main
}
