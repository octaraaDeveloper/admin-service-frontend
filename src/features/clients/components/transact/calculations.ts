import type { FdReturnType } from '@/types'

export function parseAmount(raw: string) {
  const digits = raw.replaceAll(/\D/g, '')
  return digits ? Number(digits) : 0
}

export function formatAmountInput(value: number) {
  return value > 0 ? value.toLocaleString('en-IN') : ''
}

export function estimateUnits(amount: number, nav: number) {
  return nav > 0 ? amount / nav : 0
}

export function nextSipDate(day: number, from = new Date()) {
  const candidate = new Date(from.getFullYear(), from.getMonth(), day)
  if (candidate <= from) candidate.setMonth(candidate.getMonth() + 1)
  return candidate
}

export function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

const payoutsPerYear: Partial<Record<FdReturnType, number>> = {
  monthly: 12,
  quarterly: 4,
  'half-yearly': 2,
  annual: 1,
}

export interface FdProjection {
  principal: number
  interest: number
  maturityAmount: number
  payout: number | null
  payoutsPerYear: number | null
}

export function projectFixedDeposit(
  principal: number,
  ratePercent: number,
  months: number,
  returnType: FdReturnType,
): FdProjection {
  const years = months / 12
  const rate = ratePercent / 100

  if (returnType === 'cumulative') {
    const maturityAmount = principal * Math.pow(1 + rate / 4, 4 * years)
    return {
      principal,
      interest: maturityAmount - principal,
      maturityAmount,
      payout: null,
      payoutsPerYear: null,
    }
  }

  const interest = principal * rate * years
  const perYear = payoutsPerYear[returnType]
  if (!perYear) {
    return {
      principal,
      interest,
      maturityAmount: principal + interest,
      payout: null,
      payoutsPerYear: null,
    }
  }
  return {
    principal,
    interest,
    maturityAmount: principal,
    payout: (principal * rate) / perYear,
    payoutsPerYear: perYear,
  }
}

export function monthsBetween(from: Date, to: Date) {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
}

export function holdingDuration(since: string, now = new Date()) {
  const months = Math.max(0, monthsBetween(new Date(since), now))
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (years === 0) return `${months}M`
  return rest ? `${years}Y ${rest}M` : `${years}Y`
}
