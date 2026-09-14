const LOCALE = 'en-IN'

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})
const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
const numberFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })
const decimalFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function toDate(value: string | number | Date) {
  return value instanceof Date ? value : new Date(value)
}

export function formatDate(value: string | number | Date | null | undefined) {
  if (!value) return '—'
  const date = toDate(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export function formatDateTime(value: string | number | Date | null | undefined) {
  if (!value) return '—'
  const date = toDate(value)
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormatter.format(date)
}

export function formatNumber(value: number) {
  return numberFormatter.format(value)
}

export function formatDecimal(value: number) {
  return decimalFormatter.format(value)
}

export function formatCurrency(value: number) {
  return `₹${numberFormatter.format(value)}`
}

export function formatCompactCurrency(value: number) {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1e7) return `${sign}₹${trim(abs / 1e7)} Cr`
  if (abs >= 1e5) return `${sign}₹${trim(abs / 1e5)} L`
  if (abs >= 1e3) return `${sign}₹${trim(abs / 1e3)} K`
  return `${sign}₹${numberFormatter.format(abs)}`
}

export function formatPercent(value: number, digits = 1, signed = false) {
  const prefix = signed && value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(digits)}%`
}

export function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function trim(value: number) {
  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2
  return value.toLocaleString('en-IN', { maximumFractionDigits: digits })
}
