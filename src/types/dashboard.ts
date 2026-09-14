import type { DateRange, ListRequest, Paginated, Period } from './api'
import type { KycStatus } from './clients'
import type { FundCategory } from './funds'

export type DashboardPeriod = Period
export type AumTrendRange = DateRange

export interface DashboardSummary {
  mutualFundAum: number
  monthlySip: number
  importedFunds: number
  totalSipInvestors: number
  totalSipCount: number
  equityAum: number
  debtAum: number
  otherAum: number
  totalInvested: number
  totalFdAum: number
  depositCount: number
  fdInvestorCount: number
}

export interface AumTrendPoint {
  date: string
  mutualFunds: number
  fixedDeposit: number
}

export type AumTrendSeries = 'mutualFunds' | 'fixedDeposit'

export type AllocationKey = 'equity' | 'debt' | 'fixed-deposits' | 'gold-others'

export interface AssetAllocationSlice {
  key: AllocationKey
  label: string
  value: number
  percent: number
}

export interface AssetAllocation {
  total: number
  slices: AssetAllocationSlice[]
}

export interface RecentInvestor {
  id: string
  clientId: string
  name: string
  avatarUrl: string | null
  joinedAt: string
  aum: number
  kycStatus: KycStatus
}

export type RecentInvestorsKycFilter = 'all' | KycStatus

export interface RecentInvestorsRequest {
  search?: string
  kyc?: RecentInvestorsKycFilter
}

export type SipWindow = 'this-week' | 'next-week' | 'this-month'

export interface UpcomingSip {
  id: string
  clientId: string
  clientName: string
  avatarUrl: string | null
  fundId: string
  fundName: string
  sipDate: string
  amount: number
}

export interface SipClientOption {
  id: string
  name: string
}

export interface UpcomingSipsRequest {
  clientId?: string
  window?: SipWindow
}

export type InstrumentType = 'Hybrid' | 'Debt' | 'FD'
export type BusinessUpdateFilter = 'all' | InstrumentType
export type BusinessUpdateFrequency = 'monthly' | 'quarterly' | 'yearly'

export interface BusinessUpdateRow {
  id: string
  date: string
  type: InstrumentType
  investment: number
  redemption: number
  netInvestment: number
}

export interface BusinessUpdateRequest extends ListRequest {
  filter?: BusinessUpdateFilter
  frequency?: BusinessUpdateFrequency
}

export interface BusinessUpdateResponse extends Paginated<BusinessUpdateRow> {
  counts: Record<BusinessUpdateFilter, number>
}

export interface InvestorRowBase {
  id: string
  clientId: string
  name: string
  avatarUrl: string | null
  pan: string
  kycStatus: KycStatus
}

export interface MfInvestor extends InvestorRowBase {
  investment: number
  currentValue: number
  folios: number
  sips: number
}

export interface FdInvestor extends InvestorRowBase {
  investment: number
  currentValue: number
  fds: number
}

export type SipOptionsRange = '1m' | '3m' | '6m' | '1y' | '2y' | '3y' | '5y'

export interface SipInvestor extends InvestorRowBase {
  totalSipAmount: number
  activeSips: number
  closedSips: number
}

export interface SipInvestorsRequest extends ListRequest {
  range?: SipOptionsRange
}

export interface AumBreakdownRow {
  id: string
  fundId: string
  fundName: string
  category: FundCategory
  amcId: string
  amcName: string
  amcShortName: string
  amcColor: string
  equity: number
  debt: number
  hybrid: number
  other: number
  total: number
}
