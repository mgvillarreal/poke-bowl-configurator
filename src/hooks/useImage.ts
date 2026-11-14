import { useEffect, useState } from 'react'

/** Resultado compartido entre componentes: cada imagen se comprueba una sola vez */
const cache = new Map<string, boolean>()

/**
 * true si la imagen existe y cargó, false si no, undefined mientras se comprueba.
 * Así las fotos reales reemplazan a los placeholders apenas las guardas en public/images/.
 */
export function useImage(src: string): boolean | undefined {
  const [loaded, setLoaded] = useState(() => cache.get(src))

  useEffect(() => {
    if (cache.has(src)) return
    let active = true
    const img = new Image()
    img.onload = () => {
      cache.set(src, true)
      if (active) setLoaded(true)
    }
    img.onerror = () => {
      cache.set(src, false)
      if (active) setLoaded(false)
    }
    img.src = src
    return () => {
      active = false
    }
  }, [src])

  return loaded
}
