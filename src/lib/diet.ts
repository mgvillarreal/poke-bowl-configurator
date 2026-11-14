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

/** Etiquetas que se muestran en cada tarjeta */
export function dietLabels(ingredient: Ingredient) {
  return {
    vegan: fits(ingredient, 'vegan'),
    glutenFree: fits(ingredient, 'glutenFree'),
    seafood: has(ingredient, ['fish', 'shellfish']),
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
