import type { BowlConfig, Contains, Ingredient } from '../data/menu'
import { selectedIngredients } from './bowl'

export type DietFilter = 'vegan' | 'glutenFree' | 'noSeafood'
export const DIET_FILTERS: DietFilter[] = ['vegan', 'glutenFree', 'noSeafood']

/** Qué contenidos excluye cada filtro */
const EXCLUDES: Record<DietFilter, Contains[]> = {
  vegan: ['fish', 'shellfish', 'meat', 'egg'],
  glutenFree: ['gluten'],
  noSeafood: ['fish', 'shellfish'],
}

const has = (ingredient: Ingredient, items: Contains[]) => (ingredient.contains ?? []).some((c) => items.includes(c))

export const fits = (ingredient: Ingredient, filter: DietFilter) => !has(ingredient, EXCLUDES[filter])

/** Filtros activos que el ingrediente NO cumple (vacío = apto) */
export const failedFilters = (ingredient: Ingredient, active: DietFilter[]) => active.filter((f) => !fits(ingredient, f))

/**
 * Etiquetas de cada tarjeta: solo lo que distingue al ingrediente.
 * Lo vegano y sin gluten es la mayoría, así que no se marca (sería ruido).
 */
export function dietLabels(ingredient: Ingredient) {
  const seafood = has(ingredient, ['fish', 'shellfish'])
  return {
    seafood,
    gluten: has(ingredient, ['gluten']),
    // "Del mar" ya implica que no es vegano: no se repite
    notVegan: !seafood && !fits(ingredient, 'vegan'),
  }
}

/** Un bowl es vegano / sin gluten si todos sus ingredientes lo son */
export function bowlDiet(config: BowlConfig) {
  const items = selectedIngredients(config)
  return {
    vegan: items.every((i) => fits(i, 'vegan')),
    glutenFree: items.every((i) => fits(i, 'glutenFree')),
  }
}

/** Ingredientes del bowl que no cumplen los filtros activos */
export const conflictsIn = (config: BowlConfig, active: DietFilter[]) =>
  selectedIngredients(config).filter((i) => failedFilters(i, active).length > 0)
