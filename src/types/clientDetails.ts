import type { Client } from './clients'

export interface ClientListSummary {
  total: number
  pendingKyc: number
}

export interface ClientProfile extends Client {
  address: string
  dob: string
}

export interface ClientHolding {
  id: string
  fundId: string
  fundName: string
  category: string
  assetClass: string
  amcShortName: string
  amcColor: string
  folio: string
  units: number
  invested: number
  current: number
  returnsPct: number
  xirr: number
  sipAmount: number | null
}

export interface ClientPortfolioSummary {
  invested: number
  current: number
  returns: number
  returnsPct: number
}

export interface ClientPortfolio {
  summary: ClientPortfolioSummary
  holdings: ClientHolding[]
}

export interface ClientAllocationSlice {
  label: string
  value: number
  share: number
}

export interface ClientReportMember {
  id: string
  name: string
  relationship: string
  invested: number
  returns: number
  gainPct: number
  share: number
}

export interface ClientReport {
  summary: ClientPortfolioSummary
  allocation: ClientAllocationSlice[]
  members: ClientReportMember[]
  holdings: ClientHolding[]
  generatedAt: string
}

export type FamilyRelationship = 'Self' | 'Father' | 'Mother' | 'Spouse' | 'Son' | 'Daughter'

export interface FamilyMember {
  id: string
  name: string
  relationship: FamilyRelationship
  linkedClientId: string | null
  aum: number
}

export interface FamilyCandidate {
  id: string
  name: string
}

export interface AddFamilyMemberInput {
  candidateId: string
  relationship: FamilyRelationship
}

export type AutoMandateStatus = 'Active' | 'Processing'

export interface AutoMandate {
  id: string
  umrn: string
  bank: string
  accountLast4: string
  amountLimit: number
  validTill: string
  createdAt: string
  status: AutoMandateStatus
}

export interface CreateAutoMandateInput {
  bank: string
  accountNumber: string
  amountLimit: number
  validTill: string
}

export type OtpChannel = 'mobile' | 'email'

export interface OtpSendResult {
  channel: OtpChannel
  expiresInSeconds: number
}

export interface PanVerification {
  pan: string
  name: string
  address: string
}

export interface OnboardClientInput {
  mobile: string
  email: string
  pan: string
  name: string
  address: string
  dob: string
}

export interface ResendLinkResult {
  sent: number
}
