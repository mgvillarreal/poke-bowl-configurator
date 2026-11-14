/** Generador pseudoaleatorio con semilla: mismas posiciones en cada render */
export function seeded(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashString(text: string): number {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (Math.imul(31, h) + text.charCodeAt(i)) | 0
  return h
}

export type Point = [number, number]

/** Curva suave que pasa por todos los puntos (Catmull-Rom → Bézier) */
export function smoothPath(pts: Point[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`
  }
  return d
}

/** Aclara (amount > 0) u oscurece (amount < 0) un color hex */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16)
  const target = amount > 0 ? 255 : 0
  const k = Math.abs(amount)
  const mix = (c: number) => Math.round(c + (target - c) * k)
  const r = mix((n >> 16) & 255)
  const g = mix((n >> 8) & 255)
  const b = mix(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

/** Patrón japonés de olas (seigaiha) como imagen de fondo CSS */
export function seigaiha(stroke: string, background: string): string {
  const wave = ([cx, cy]: Point) =>
    `<g transform="translate(${cx} ${cy})" stroke="${stroke}" stroke-width="2"><circle r="29" fill="${background}"/><circle r="21" fill="none"/><circle r="13" fill="none"/><circle r="5" fill="none"/></g>`
  const centers: Point[] = [
    [0, 0],
    [60, 0],
    [30, 15],
    [0, 30],
    [60, 30],
  ]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="30" viewBox="0 0 60 30"><rect width="60" height="30" fill="${background}"/>${centers.map(wave).join('')}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
