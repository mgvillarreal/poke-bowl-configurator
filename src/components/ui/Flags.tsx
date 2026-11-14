/** Banderas en SVG (sin imágenes externas). Proporción 3:2 para que ambas se vean del mismo tamaño. */

/** Estrella de 5 puntas centrada en (cx, cy) */
function starPath(cx: number, cy: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.42
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    pts.push(`${(cx + radius * Math.cos(a)).toFixed(2)},${(cy + radius * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
}

/** Venezuela: amarillo, azul y rojo, con el arco de 7 estrellas blancas */
export function VenezuelaFlag({ className }: { className?: string }) {
  const stars = Array.from({ length: 7 }, (_, i) => {
    const a = Math.PI + Math.PI * (0.16 + (0.68 * i) / 6)
    return starPath(15 + 5.4 * Math.cos(a), 13.4 + 5.4 * Math.sin(a), 0.85)
  })

  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden>
      <rect width={30} height={20} fill="#cf142b" />
      <rect width={30} height={13.34} fill="#00247d" />
      <rect width={30} height={6.67} fill="#ffcc00" />
      <path d={stars.join('')} fill="#ffffff" />
    </svg>
  )
}

/** Estados Unidos: 13 franjas y cantón azul con estrellas */
export function UsaFlag({ className }: { className?: string }) {
  const stripe = 20 / 13
  const stars: string[] = []
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      if (row % 2 === 1 && col === 5) continue
      stars.push(starPath(1.1 + col * 2 + (row % 2) * 1, 1.3 + row * 1.95, 0.6))
    }
  }

  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden>
      <rect width={30} height={20} fill="#ffffff" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={i * 2 * stripe} width={30} height={stripe} fill="#b22234" />
      ))}
      <rect width={12} height={stripe * 7} fill="#3c3b6e" />
      <path d={stars.join('')} fill="#ffffff" />
    </svg>
  )
}
