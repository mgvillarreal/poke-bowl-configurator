interface LogoProps {
  label: string
  light?: boolean
}

/** NAMI + ola + ナミ (ola en japonés) */
export function Logo({ label, light = false }: LogoProps) {
  const color = light ? 'text-rice' : 'text-nori'

  return (
    // Sin aria-label: el nombre accesible es el texto visible ("NAMI") + el texto solo para lectores
    <a href="#inicio" className={`flex shrink-0 items-center gap-2 ${color}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
        <circle cx={20} cy={20} r={19} fill="#ff6b5a" stroke="currentColor" strokeWidth={2} />
        <path
          d="M7 24c3-6 8-8 12-5 2 1.6 1 4.4-1.4 4.4-1.8 0-2.4-2 -0.8-3 3.8-2.6 9.6-.4 13.2 3.6"
          fill="none"
          stroke="#fff6e9"
          strokeWidth={2.6}
          strokeLinecap="round"
        />
        <path d="M7 29h26" stroke="#fff6e9" strokeWidth={2.6} strokeLinecap="round" />
      </svg>
      <span className="font-display text-2xl leading-none tracking-wide">NAMI</span>
      <span aria-hidden className={`hidden font-display text-sm min-[400px]:inline ${light ? 'text-coral' : 'text-coral-ink'}`}>
        ナミ
      </span>
      <span className="sr-only">{label}</span>
    </a>
  )
}
