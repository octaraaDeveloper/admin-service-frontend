export type KycStatus = 'verified' | 'pending' | 'rejected' | 'expired'
export type RiskProfile = 'Low' | 'Medium' | 'High' | 'Very High'

export interface Client {
  id: string
  name: string
  email: string
  mobile: string
  pan: string
  avatarUrl: string | null
  aum: number
  kycStatus: KycStatus
  riskProfile: RiskProfile
  joinedAt: string
  sipCount: number
  monthlySip: number
}
