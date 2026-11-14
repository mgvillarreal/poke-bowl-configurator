interface LogoProps {
  light?: boolean
}

/** NAMI + ola + ナミ (ola en japonés) */
export function Logo({ light = false }: LogoProps) {
  const color = light ? 'text-rice' : 'text-nori'

  return (
    <a href="#inicio" className={`flex items-center gap-2 ${color}`} aria-label="Nami Poke Bar, inicio">
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
      <span className="font-display text-sm text-coral">ナミ</span>
    </a>
  )
}
