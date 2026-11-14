import { CURRENCY } from '../data/menu'

const formatters = new Map<string, Intl.NumberFormat>()

/** Precio en la moneda del menú, con el formato del idioma activo */
export function formatMoney(value: number, intl: string): string {
  let formatter = formatters.get(intl)
  if (!formatter) {
    // narrowSymbol: siempre "$" (en inglés sería "MX$"); en una demo el signo queda a interpretación
    formatter = new Intl.NumberFormat(intl, {
      style: 'currency',
      currency: CURRENCY,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0,
    })
    formatters.set(intl, formatter)
  }
  return formatter.format(value)
}
