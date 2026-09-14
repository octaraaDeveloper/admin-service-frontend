import type { FixedDepositScheme, MutualFund } from './funds'

export type TransactProduct = 'mutual-funds' | 'fixed-deposits'
export type MfOrderType = 'lumpsum' | 'sip'
export type OrderSide = 'buy' | 'sell'
export type SipFrequency = 'monthly' | 'quarterly'
export type FundPlan = 'Growth' | 'IDCW'

export interface FundDetails extends MutualFund {
  plan: FundPlan
  navDate: string
  exitLoad: string
  launchedAt: string
}

export interface HoldingPoint {
  date: string
  value: number
}

export interface MfHolding {
  fundId: string
  invested: number
  currentValue: number
  units: number
  avgNav: number
  lastInvestedAt: string
  holdingSince: string
  series: HoldingPoint[]
}

export type MandateStatus = 'active' | 'pending'

export interface SipMandate {
  id: string
  bankName: string
  accountMasked: string
  limit: number
  validTill: string
  status: MandateStatus
}

export type FdMaturityInstruction =
  | 'auto-renew-principal-interest'
  | 'auto-renew-principal'
  | 'credit-savings'
  | 'transfer-current'
  | 'renew-latest-rate'
  | 'close'

export type FdReturnType =
  'cumulative' | 'monthly' | 'quarterly' | 'half-yearly' | 'annual' | 'at-maturity'

export interface FdTenure {
  months: number
  rate: number
  seniorCitizenRate: number
}

export interface FdSchemeVariant {
  id: string
  name: string
  description: string
  rateBonus: number
  seniorCitizen: boolean
  lockInMonths: number | null
}

export interface FdProvider extends FixedDepositScheme {
  tenures: FdTenure[]
  schemes: FdSchemeVariant[]
}

export interface FdHolding {
  providerId: string
  schemeName: string
  principal: number
  currentValue: number
  interestRate: number
  returnType: FdReturnType
  depositedAt: string
  maturesAt: string
  tenureMonths: number
  maturityInstruction: FdMaturityInstruction
}

export interface SipDetails {
  frequency: SipFrequency
  day: number
  mandateId: string | null
}

export interface MfOrderRequest {
  product: 'mutual-funds'
  clientId: string
  fundId: string
  side: OrderSide
  orderType: MfOrderType
  amount: number
  sip: SipDetails | null
}

export interface FdOrderRequest {
  product: 'fixed-deposits'
  clientId: string
  providerId: string
  schemeId: string
  amount: number
  tenureMonths: number
  returnType: FdReturnType
  maturityInstruction: FdMaturityInstruction
}

export type OrderRequest = MfOrderRequest | FdOrderRequest

export interface PaymentLinkResult {
  orderId: string
  title: string
  amount: number
  link: string
  sentTo: {
    mobile: string
    email: string
  }
  expiresAt: string
}
