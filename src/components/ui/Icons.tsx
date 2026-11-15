import type { ReactNode, SVGProps } from 'react'

/**
 * Íconos de Nami: línea de 2 px con puntas redondas, el mismo lenguaje que la ola del logo.
 * Reemplazan a los emojis y símbolos sueltos. Siempre decorativos (aria-hidden):
 * el texto que los acompaña es el que da el significado.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Icon({ size = 18, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const BowlIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 11h18a9 9 0 0 1-18 0Z" />
    <path d="M7 11c.5-2 2-3 3.5-3S13 9 14 9.5 16.5 9 17 7.5" />
    <path d="M9 20.5h6" />
  </Icon>
)

export const ScooterIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="5.5" cy="17" r="2.5" />
    <circle cx="18.5" cy="17" r="2.5" />
    <path d="M8 17h7l3.2-7.5H15.5" />
    <path d="M15.5 6H18l.6 3.5" />
    <path d="M3 13.5h6.5L11 17" />
  </Icon>
)

export const CardIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="3" />
    <path d="M2.5 10h19M6.5 14.5h3" />
  </Icon>
)

export const CashIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="3" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 9.5v5M18 9.5v5" />
  </Icon>
)

export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10.3 4.3 2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9.5v4M12 17h.01" />
  </Icon>
)

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
)

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
  </Icon>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 12H5M10.5 6.5 5 12l5.5 5.5" />
  </Icon>
)

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)

export const TrashIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l.8 12.5h9.4L17.5 7M10 11v5M14 11v5" />
  </Icon>
)

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)

export const BagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </Icon>
)
