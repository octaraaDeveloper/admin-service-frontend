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
