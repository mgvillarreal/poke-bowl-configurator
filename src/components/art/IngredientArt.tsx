import { BOWL_IMAGE, CATEGORY_BY_ID, imageSrc, type Ingredient } from '../../data/menu'
import { useImage } from '../../hooks/useImage'
import {
  BasePlaceholder,
  BowlPlaceholder,
  ClusterPlaceholder,
  DrizzlePlaceholder,
  ScatterPlaceholder,
} from './placeholders'

const PLACEHOLDER = {
  base: BasePlaceholder,
  cluster: ClusterPlaceholder,
  drizzle: DrizzlePlaceholder,
  scatter: ScatterPlaceholder,
}

/** Foto real si existe en public/images/, si no, el placeholder dibujado */
export function IngredientArt({ ingredient }: { ingredient: Ingredient }) {
  const src = imageSrc(ingredient)
  const loaded = useImage(src)

  if (loaded) {
    return <img src={src} alt="" draggable={false} className="h-full w-full object-contain select-none" />
  }
  if (loaded === undefined) return null

  const Placeholder = PLACEHOLDER[CATEGORY_BY_ID[ingredient.category].art]
  return <Placeholder ingredient={ingredient} />
}

export function BowlArt() {
  const loaded = useImage(BOWL_IMAGE)

  if (loaded) {
    return <img src={BOWL_IMAGE} alt="" draggable={false} className="h-full w-full object-contain select-none" />
  }
  if (loaded === undefined) return null
  return <BowlPlaceholder />
}
