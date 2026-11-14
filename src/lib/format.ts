import { CURRENCY } from '../data/menu'

const money = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
})

export const formatMoney = (value: number) => money.format(value)
