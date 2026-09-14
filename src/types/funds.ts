export type FundCategory =
  | 'Large Cap'
  | 'Mid Cap'
  | 'Small Cap'
  | 'Flexi Cap'
  | 'Hybrid'
  | 'Debt'
  | 'Index'
  | 'Sectoral'
  | 'Commodity Gold'
  | 'ELSS'

export type AssetClass = 'Equity' | 'Debt' | 'Hybrid' | 'Other'
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Very High'

export interface Amc {
  id: string
  name: string
  shortName: string
  logoColor: string
}

export interface MutualFund {
  id: string
  amcId: string
  name: string
  category: FundCategory
  assetClass: AssetClass
  returns1y: number
  returns3y: number
  returns5y: number
  rating: number
  expenseRatio: number
  aum: number
  risk: RiskLevel
  nav: number
  minSip: number
  minLumpsum: number
}

export interface FixedDepositScheme {
  id: string
  bank: string
  name: string
  interestRate: number
  seniorCitizenRate: number
  minAmount: number
  tenureMonths: number[]
  rating: string
}

export type FundSortKey = 'returns1y' | 'returns3y' | 'returns5y' | 'aum'

export interface MutualFundListItem extends MutualFund {
  amc: Amc
}

export interface NavPoint {
  date: string
  nav: number
}

export interface FundManager {
  name: string
  since: string
}

export interface FundHolding {
  name: string
  sector: string
  instrument: string
  weight: number
}

export interface AllocationSlice {
  label: string
  value: number
}

export interface MutualFundDetails extends MutualFundListItem {
  navDate: string
  navChange1d: number
  about: string
  benchmark: string
  launchDate: string
  exitLoad: string
  minAdditional: number
  lockInMonths: number | null
  investors: number
  managers: FundManager[]
  holdings: FundHolding[]
  allocation: AllocationSlice[]
  navHistory: NavPoint[]
}

export interface TenureRate {
  months: number
  rate: number
}

export interface FixedDepositDetails extends FixedDepositScheme {
  maxAmount: number
  tenureRates: TenureRate[]
  payoutOptions: string[]
  prematureWithdrawal: string
  insuredUpTo: number | null
  highlights: string[]
}

export interface AmcSummary extends Amc {
  fundCount: number
  totalAum: number
  avgReturns3y: number
  categories: FundCategory[]
}

export interface ExploreSummary {
  mutualFunds: number
  fixedDeposits: number
  amcs: number
}
