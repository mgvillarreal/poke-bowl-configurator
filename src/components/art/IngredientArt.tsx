import { useState } from 'react'
import { BOWL_IMAGE, CATEGORY_BY_ID, ingredientImage, type ImageSources, type Ingredient } from '../../data/menu'
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

/** Fotos que fallaron: se recuerdan para no volver a pedirlas */
const failed = new Set<string>()

interface PhotoProps {
  image: ImageSources
  /** Ancho aproximado en pantalla (px CSS): el navegador elige el tamaño con srcset */
  width: number
  /** Ancho en pantallas chicas (≤ 640 px), si es distinto */
  mobileWidth?: number
  onError: () => void
}

const px = (n: number) => `${Math.max(1, Math.round(n))}px`

function Photo({ image, width, mobileWidth = width, onError }: PhotoProps) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={`(max-width: 640px) ${px(mobileWidth)}, ${px(width)}`}
      alt=""
      draggable={false}
      decoding="async"
      onError={onError}
      className="h-full w-full object-contain select-none"
    />
  )
}

interface ArtProps {
  width: number
  mobileWidth?: number
}

/** Foto real del ingrediente; si no existe, el placeholder dibujado */
export function IngredientArt({ ingredient, width, mobileWidth }: ArtProps & { ingredient: Ingredient }) {
  const image = ingredientImage(ingredient)
  const [broken, setBroken] = useState(() => failed.has(image.src))

  if (broken) {
    const Placeholder = PLACEHOLDER[CATEGORY_BY_ID[ingredient.category].art]
    return <Placeholder ingredient={ingredient} />
  }
  return (
    <Photo
      image={image}
      width={width}
      mobileWidth={mobileWidth}
      onError={() => {
        failed.add(image.src)
        setBroken(true)
      }}
    />
  )
}

export function BowlArt({ width, mobileWidth }: ArtProps) {
  const [broken, setBroken] = useState(() => failed.has(BOWL_IMAGE.src))

  if (broken) return <BowlPlaceholder />
  return (
    <Photo
      image={BOWL_IMAGE}
      width={width}
      mobileWidth={mobileWidth}
      onError={() => {
        failed.add(BOWL_IMAGE.src)
        setBroken(true)
      }}
    />
  )
}
