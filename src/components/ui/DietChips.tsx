import { useT } from '../../i18n/useLocale'

interface DietChipsProps {
  vegan?: boolean
  glutenFree?: boolean
  seafood?: boolean
  className?: string
}

/** Etiquetas de dieta en texto (no solo color ni íconos): legibles para todos */
export function DietChips({ vegan, glutenFree, seafood, className = '' }: DietChipsProps) {
  const t = useT()
  const chips = [
    vegan && { label: t.diet.labels.vegan, style: 'bg-matcha/50' },
    glutenFree && { label: t.diet.labels.glutenFree, style: 'bg-mango/50' },
    seafood && { label: t.diet.labels.seafood, style: 'bg-sakura' },
  ].filter(Boolean) as { label: string; style: string }[]

  if (chips.length === 0) return null

  return (
    <span className={`flex flex-wrap justify-center gap-1 ${className}`}>
      {chips.map((chip) => (
        <span key={chip.label} className={`rounded-full px-1.5 py-px text-[10px] leading-tight font-bold text-nori ${chip.style}`}>
          {chip.label}
        </span>
      ))}
    </span>
  )
}
