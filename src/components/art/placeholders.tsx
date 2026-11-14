import { useId, type ReactNode } from 'react'
import type { Ingredient } from '../../data/menu'
import { hashString, seeded, shade, smoothPath, type Point } from '../../lib/svg'

/**
 * Dibujos provisionales mientras no existan las fotos.
 * Todos usan un viewBox de 100×100 y posiciones con semilla (no "bailan" entre renders).
 */

const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
    {children}
  </svg>
)

const colorsOf = (ing: Ingredient) => ing.palette ?? [ing.color, shade(ing.color, 0.15), shade(ing.color, -0.12)]

/** Punto aleatorio dentro de un círculo/óvalo */
function inOval(rand: () => number, rx: number, ry: number): Point {
  const r = Math.sqrt(rand())
  const a = rand() * Math.PI * 2
  return [50 + Math.cos(a) * rx * r, 50 + Math.sin(a) * ry * r]
}

/** Base: disco completo con textura (granos, hojas o semillas) */
export function BasePlaceholder({ ingredient }: { ingredient: Ingredient }) {
  const uid = useId()
  const rand = seeded(hashString(ingredient.id))
  const colors = colorsOf(ingredient)
  const pieces = Array.from({ length: ingredient.shape === 'leaf' ? 46 : 280 }, () => {
    const [x, y] = inOval(rand, 46, 46)
    return { x, y, rot: rand() * 180, color: colors[Math.floor(rand() * colors.length)] }
  })

  return (
    <Svg>
      <defs>
        <radialGradient id={`${uid}-depth`}>
          <stop offset="0.6" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.18} />
        </radialGradient>
      </defs>
      <circle cx={50} cy={50} r={49} fill={ingredient.color} />
      {pieces.map((p, i) =>
        ingredient.shape === 'leaf' ? (
          <ellipse key={i} cx={p.x} cy={p.y} rx={9} ry={4.5} fill={p.color} transform={`rotate(${p.rot} ${p.x} ${p.y})`} />
        ) : ingredient.shape === 'seed' ? (
          <circle key={i} cx={p.x} cy={p.y} r={1.3} fill={p.color} />
        ) : (
          <ellipse key={i} cx={p.x} cy={p.y} rx={2.3} ry={1.1} fill={p.color} transform={`rotate(${p.rot} ${p.x} ${p.y})`} />
        ),
      )}
      <circle cx={50} cy={50} r={49} fill={`url(#${uid}-depth)`} />
    </Svg>
  )
}

const CLUSTER_COUNT: Partial<Record<Ingredient['shape'], number>> = {
  cube: 11,
  slice: 9,
  bean: 18,
  strip: 20,
  kernel: 26,
}

/** Proteínas y complementos: un montoncito de piezas */
export function ClusterPlaceholder({ ingredient }: { ingredient: Ingredient }) {
  const rand = seeded(hashString(ingredient.id))
  const { color, shape } = ingredient
  const dark = shade(color, -0.3)
  const light = shade(color, 0.35)

  const pieces = Array.from({ length: CLUSTER_COUNT[shape] ?? 12 }, () => {
    const [x, y] = inOval(rand, 30, 26)
    return { x, y, rot: rand() * 360 }
  }).sort((a, b) => a.y - b.y)

  const piece = (rot: number) => {
    switch (shape) {
      case 'slice':
        return (
          <>
            <ellipse rx={14} ry={5.5} fill={color} stroke={dark} strokeWidth={0.8} />
            <ellipse rx={10} ry={2.6} fill={light} />
          </>
        )
      case 'bean':
        return (
          <>
            <ellipse rx={5.8} ry={4.2} fill={color} stroke={dark} strokeWidth={0.6} />
            <ellipse cx={-1.5} cy={-1.3} rx={2.2} ry={1.2} fill={light} />
          </>
        )
      case 'strip':
        return <rect x={-14} y={-2} width={28} height={4} rx={2} fill={color} stroke={dark} strokeWidth={0.5} />
      case 'kernel':
        return (
          <>
            <circle r={4} fill={color} stroke={dark} strokeWidth={0.5} />
            <circle cx={-1.2} cy={-1.2} r={1.4} fill={light} />
          </>
        )
      default:
        return (
          <g transform={`rotate(${-rot})`}>
            <rect x={-9} y={-9} width={18} height={18} rx={4} fill={color} stroke={dark} strokeWidth={0.8} />
            <rect x={-6.5} y={-6.5} width={9} height={3} rx={1.5} fill={light} opacity={0.75} />
          </g>
        )
    }
  }

  return (
    <Svg>
      {pieces.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${shape === 'cube' ? p.rot % 40 : p.rot})`}>
          {piece(p.rot)}
        </g>
      ))}
    </Svg>
  )
}

/** Salsas: hilos en zigzag que cruzan el bowl */
export function DrizzlePlaceholder({ ingredient }: { ingredient: Ingredient }) {
  const pts: Point[] = []
  for (let i = 0; i <= 8; i++) {
    const y = 16 + i * 8.5
    const half = Math.sqrt(Math.max(0, 40 * 40 - (y - 50) ** 2)) * 0.88
    pts.push([i % 2 === 0 ? 50 - half : 50 + half, y])
  }
  const d = smoothPath(pts)

  return (
    <Svg>
      <path d={d} fill="none" stroke={shade(ingredient.color, -0.2)} strokeWidth={3.2} strokeLinecap="round" opacity={0.35} transform="translate(0.6 1)" />
      <path d={d} fill="none" stroke={ingredient.color} strokeWidth={2.6} strokeLinecap="round" />
      <path d={d} fill="none" stroke={shade(ingredient.color, 0.45)} strokeWidth={0.7} strokeLinecap="round" opacity={0.7} transform="translate(-0.5 -0.6)" />
    </Svg>
  )
}

const SCATTER_COUNT: Partial<Record<Ingredient['shape'], number>> = {
  seed: 110,
  dot: 120,
  ring: 34,
  strip: 26,
  flake: 50,
}

/** Toppings: espolvoreado sobre todo el bowl */
export function ScatterPlaceholder({ ingredient }: { ingredient: Ingredient }) {
  const rand = seeded(hashString(ingredient.id) + 7)
  const colors = colorsOf(ingredient)
  const pieces = Array.from({ length: SCATTER_COUNT[ingredient.shape] ?? 60 }, () => {
    const [x, y] = inOval(rand, 40, 40)
    return { x, y, rot: rand() * 180, color: colors[Math.floor(rand() * colors.length)] }
  })

  return (
    <Svg>
      {pieces.map((p, i) => {
        const t = `rotate(${p.rot} ${p.x} ${p.y})`
        switch (ingredient.shape) {
          case 'ring':
            return <circle key={i} cx={p.x} cy={p.y} r={2.4} fill="none" stroke={p.color} strokeWidth={1.1} />
          case 'strip':
            return <rect key={i} x={p.x - 6} y={p.y - 1.1} width={12} height={2.2} rx={0.6} fill={p.color} transform={t} />
          case 'flake':
            return <ellipse key={i} cx={p.x} cy={p.y} rx={2.8} ry={1.6} fill={p.color} transform={t} />
          case 'dot':
            return <circle key={i} cx={p.x} cy={p.y} r={1.1} fill={p.color} />
          default:
            return <ellipse key={i} cx={p.x} cy={p.y} rx={1.3} ry={0.7} fill={p.color} transform={t} />
        }
      })}
    </Svg>
  )
}

/** Bowl de cerámica crema con borde índigo */
export function BowlPlaceholder() {
  const uid = useId()
  const rand = seeded(2026)
  const specks = Array.from({ length: 70 }, () => inOval(rand, 46, 46))

  return (
    <Svg>
      <defs>
        <radialGradient id={`${uid}-glaze`} cx="0.45" cy="0.42">
          <stop offset="0" stopColor="#fbf6ee" />
          <stop offset="0.75" stopColor="#efe5d6" />
          <stop offset="1" stopColor="#d9cbb6" />
        </radialGradient>
      </defs>
      <circle cx={50} cy={50} r={50} fill="#1f2a5a" />
      <circle cx={50} cy={50} r={47.5} fill={`url(#${uid}-glaze)`} />
      {specks.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.35} fill="#8a7f72" opacity={0.5} />
      ))}
      <path d="M 14 34 A 40 40 0 0 1 34 14" fill="none" stroke="#ffffff" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
    </Svg>
  )
}
