/**
 * Fuente única de datos del menú de Nami Poke Bar.
 * La UI, los límites, el precio, la nutrición y el dibujo del bowl se derivan de aquí:
 * agregar un ingrediente = agregar un objeto a INGREDIENTS (y su foto en public/images/).
 */

export type CategoryId = 'base' | 'protein' | 'extra' | 'sauce' | 'topping'
export type SizeId = 'regular' | 'grande'

/** Cómo se dibuja la categoría dentro del bowl */
export type ArtKind = 'base' | 'cluster' | 'drizzle' | 'scatter'

/** Forma de las piezas en el placeholder (mientras no exista la foto) */
export type Shape =
  | 'grain'
  | 'leaf'
  | 'seed'
  | 'cube'
  | 'slice'
  | 'bean'
  | 'strip'
  | 'kernel'
  | 'dot'
  | 'ring'
  | 'flake'
  | 'drizzle'

export interface Category {
  id: CategoryId
  step: number
  label: string
  title: string
  /** [singular, plural] para mensajes como "hasta 2 proteínas" */
  noun: [string, string]
  folder: string
  art: ArtKind
}

export interface Ingredient {
  id: string
  name: string
  category: CategoryId
  color: string
  /** Colores extra para placeholders con varios tonos (quinoa, hojas, ajonjolí) */
  palette?: string[]
  shape: Shape
  /** Costo extra sobre el precio del tamaño */
  price: number
  kcal: number
  /** Gramos de proteína */
  protein: number
  tag?: 'Popular' | 'Picante' | 'Nuevo'
}

export interface Size {
  id: SizeId
  label: string
  price: number
  description: string
  limits: Record<CategoryId, number>
}

export type Selection = Record<CategoryId, string[]>

export interface BowlConfig {
  size: SizeId
  selection: Selection
}

export const CURRENCY = 'MXN'

export const CATEGORIES: Category[] = [
  { id: 'base', step: 1, label: 'Base', title: 'Elige tu base', noun: ['base', 'bases'], folder: 'bases', art: 'base' },
  { id: 'protein', step: 2, label: 'Proteína', title: 'Elige tu proteína', noun: ['proteína', 'proteínas'], folder: 'proteins', art: 'cluster' },
  { id: 'extra', step: 3, label: 'Complementos', title: 'Suma color', noun: ['complemento', 'complementos'], folder: 'extras', art: 'cluster' },
  { id: 'sauce', step: 4, label: 'Salsa', title: 'Ponle salsa', noun: ['salsa', 'salsas'], folder: 'sauces', art: 'drizzle' },
  { id: 'topping', step: 5, label: 'Toppings', title: 'El toque final', noun: ['topping', 'toppings'], folder: 'toppings', art: 'scatter' },
]

export const SIZES: Size[] = [
  {
    id: 'regular',
    label: 'Regular',
    price: 169,
    description: '1 proteína · 4 complementos',
    limits: { base: 1, protein: 1, extra: 4, sauce: 2, topping: 3 },
  },
  {
    id: 'grande',
    label: 'Grande',
    price: 219,
    description: '2 proteínas · 6 complementos',
    limits: { base: 1, protein: 2, extra: 6, sauce: 2, topping: 3 },
  },
]

export const INGREDIENTS: Ingredient[] = [
  // Bases
  { id: 'rice-white', name: 'Arroz de sushi', category: 'base', color: '#f7f2e8', shape: 'grain', price: 0, kcal: 240, protein: 4, tag: 'Popular' },
  { id: 'rice-brown', name: 'Arroz integral', category: 'base', color: '#d8b98e', shape: 'grain', price: 0, kcal: 220, protein: 5 },
  { id: 'quinoa', name: 'Quinoa tricolor', category: 'base', color: '#ecdcbc', palette: ['#ecdcbc', '#f4e8cf', '#b5523b', '#3a2b25'], shape: 'seed', price: 0, kcal: 220, protein: 8 },
  { id: 'greens', name: 'Mix de hojas', category: 'base', color: '#6fae4f', palette: ['#6fae4f', '#4f8f3a', '#9ccc65', '#3e7b34'], shape: 'leaf', price: 0, kcal: 20, protein: 2 },

  // Proteínas
  { id: 'tuna', name: 'Atún shoyu', category: 'protein', color: '#c4243b', shape: 'cube', price: 0, kcal: 130, protein: 28, tag: 'Popular' },
  { id: 'salmon', name: 'Salmón', category: 'protein', color: '#ff8a5c', shape: 'cube', price: 30, kcal: 180, protein: 25 },
  { id: 'shrimp', name: 'Camarón', category: 'protein', color: '#ffb0a0', shape: 'bean', price: 20, kcal: 100, protein: 22 },
  { id: 'chicken-teriyaki', name: 'Pollo teriyaki', category: 'protein', color: '#b8742f', shape: 'cube', price: 0, kcal: 190, protein: 30 },
  { id: 'tofu', name: 'Tofu crujiente', category: 'protein', color: '#e8b75a', shape: 'cube', price: 0, kcal: 140, protein: 15 },

  // Complementos
  { id: 'avocado', name: 'Aguacate', category: 'extra', color: '#9cc65a', shape: 'slice', price: 15, kcal: 80, protein: 1, tag: 'Popular' },
  { id: 'cucumber', name: 'Pepino', category: 'extra', color: '#a8d672', shape: 'slice', price: 0, kcal: 8, protein: 0 },
  { id: 'edamame', name: 'Edamame', category: 'extra', color: '#6db33f', shape: 'bean', price: 0, kcal: 60, protein: 6 },
  { id: 'mango', name: 'Mango', category: 'extra', color: '#ffb627', shape: 'cube', price: 0, kcal: 50, protein: 0, tag: 'Nuevo' },
  { id: 'corn', name: 'Elote', category: 'extra', color: '#ffd84a', shape: 'kernel', price: 0, kcal: 45, protein: 1 },
  { id: 'red-onion', name: 'Cebolla encurtida', category: 'extra', color: '#c2357a', shape: 'strip', price: 0, kcal: 10, protein: 0 },
  { id: 'carrot', name: 'Zanahoria', category: 'extra', color: '#ff8c2b', shape: 'strip', price: 0, kcal: 15, protein: 0 },
  { id: 'wakame', name: 'Alga wakame', category: 'extra', color: '#3f9b3a', shape: 'strip', price: 0, kcal: 35, protein: 1 },

  // Salsas
  { id: 'ponzu', name: 'Ponzu', category: 'sauce', color: '#c98a2c', shape: 'drizzle', price: 0, kcal: 15, protein: 0 },
  { id: 'spicy-mayo', name: 'Spicy mayo', category: 'sauce', color: '#ff7f50', shape: 'drizzle', price: 0, kcal: 90, protein: 0, tag: 'Picante' },
  { id: 'teriyaki', name: 'Teriyaki', category: 'sauce', color: '#5a2e12', shape: 'drizzle', price: 0, kcal: 35, protein: 0 },
  { id: 'sesame', name: 'Aderezo de ajonjolí', category: 'sauce', color: '#e9cf9e', shape: 'drizzle', price: 0, kcal: 70, protein: 1 },

  // Toppings
  { id: 'sesame-seeds', name: 'Ajonjolí', category: 'topping', color: '#f3ead6', palette: ['#f3ead6', '#2b2622'], shape: 'seed', price: 0, kcal: 25, protein: 1 },
  { id: 'scallions', name: 'Cebollín', category: 'topping', color: '#5cb85c', shape: 'ring', price: 0, kcal: 2, protein: 0 },
  { id: 'nori', name: 'Nori', category: 'topping', color: '#1f3b2a', shape: 'strip', price: 0, kcal: 5, protein: 1 },
  { id: 'crispy-onion', name: 'Cebolla crujiente', category: 'topping', color: '#d99a3a', shape: 'flake', price: 0, kcal: 40, protein: 0 },
  { id: 'masago', name: 'Masago', category: 'topping', color: '#ff7a1a', shape: 'dot', price: 20, kcal: 20, protein: 3 },
]

export const DEFAULT_BOWL: BowlConfig = {
  size: 'regular',
  selection: {
    base: ['rice-white'],
    protein: ['salmon'],
    extra: ['avocado', 'mango', 'edamame', 'red-onion'],
    sauce: ['spicy-mayo'],
    topping: ['sesame-seeds', 'scallions'],
  },
}

const byId = <T extends { id: string }>(list: T[]) =>
  Object.fromEntries(list.map((item) => [item.id, item])) as Record<T['id'], T>

export const SIZE_BY_ID = byId(SIZES)
export const CATEGORY_BY_ID = byId(CATEGORIES)
export const INGREDIENT_BY_ID: Record<string, Ingredient> = byId(INGREDIENTS)

export const ingredientsOf = (category: CategoryId) => INGREDIENTS.filter((i) => i.category === category)

/** Ruta de la foto real; si no existe, se dibuja el placeholder */
export const imageSrc = (ingredient: Ingredient) =>
  `/images/${CATEGORY_BY_ID[ingredient.category].folder}/${ingredient.id}.png`

export const BOWL_IMAGE = '/images/bowl/bowl.png'
export const HERO_IMAGE = '/images/scene/hero.jpg'
