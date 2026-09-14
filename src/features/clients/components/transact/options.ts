import type {
  FdMaturityInstruction,
  FdReturnType,
  MfOrderType,
  OrderSide,
  SipFrequency,
  TransactProduct,
} from '@/types'

export const productTabs: { value: TransactProduct; label: string }[] = [
  { value: 'mutual-funds', label: 'Mutual Funds' },
  { value: 'fixed-deposits', label: 'Fixed Deposits' },
]

export const orderTypeOptions: { value: MfOrderType; label: string }[] = [
  { value: 'lumpsum', label: 'Lumpsum' },
  { value: 'sip', label: 'SIP' },
]

export const orderTypeLabels: Record<MfOrderType, string> = {
  lumpsum: 'Lumpsum',
  sip: 'SIP',
}

export const sideOptions: { value: OrderSide; label: string }[] = [
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
]

export const sipFrequencyOptions: { value: SipFrequency; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
]

export const sipFrequencyLabels: Record<SipFrequency, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
}

export function ordinal(day: number) {
  const mod100 = day % 100
  if (mod100 >= 11 && mod100 <= 13) return `${day}th`
  const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] ?? 'th'
  return `${day}${suffix}`
}

export const sipDayOptions = Array.from({ length: 28 }, (_, index) => ({
  value: String(index + 1),
  label: `${ordinal(index + 1)} of every month`,
}))

export const quickAddAmounts = [500, 1000, 5000]

export const maturityInstructionLabels: Record<FdMaturityInstruction, string> = {
  'auto-renew-principal-interest': 'Auto Renew (Principal + Interest)',
  'auto-renew-principal': 'Auto Renew (Principal Only)',
  'credit-savings': 'Credit to Linked Savings Account',
  'transfer-current': 'Transfer to Current Account',
  'renew-latest-rate': 'Renew with Latest Interest Rate',
  close: 'Close Deposit on Maturity',
}

export const maturityInstructionOptions = (
  Object.keys(maturityInstructionLabels) as FdMaturityInstruction[]
).map((value) => ({ value, label: maturityInstructionLabels[value] }))

export const returnTypeLabels: Record<FdReturnType, string> = {
  cumulative: 'Cumulative',
  monthly: 'Monthly Interest Payout',
  quarterly: 'Quarterly Interest Payout',
  'half-yearly': 'Half-Yearly Interest Payout',
  annual: 'Annual Interest Payout',
  'at-maturity': 'At Maturity',
}

export const returnTypeOptions = (Object.keys(returnTypeLabels) as FdReturnType[]).map((value) => ({
  value,
  label: returnTypeLabels[value],
}))

export const payoutLabels: Record<FdReturnType, string> = {
  cumulative: 'Compounded quarterly',
  monthly: 'Monthly payout',
  quarterly: 'Quarterly payout',
  'half-yearly': 'Half-yearly payout',
  annual: 'Annual payout',
  'at-maturity': 'Paid at maturity',
}

export function tenureLabel(months: number) {
  if (months % 12 === 0) {
    const years = months / 12
    return `${years} ${years === 1 ? 'Year' : 'Years'}`
  }
  return `${months} Months`
}

/**
 * Radix Select treats `undefined` as "uncontrolled": once the user has picked an option, clearing
 * the value back to null would keep showing the stale internal selection. Always hand it a string
 * ('' renders the placeholder) so the control stays controlled for its whole lifetime.
 */
