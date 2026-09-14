import type { ListRequest } from './api'

export type TransactionAsset = 'MF' | 'FD'
export type TransactionStatus = 'success' | 'pending' | 'processing' | 'failed' | 'cancelled'
export type TransactionOrderType = 'lumpsum' | 'redemption' | 'sip' | 'fd'
export type TransactionRange = 'this-month' | '7d' | '30d' | '3m' | '6m' | 'all'
export type PaymentMode = 'UPI' | 'Net banking' | 'NEFT' | 'Auto mandate' | 'Bank payout'

export interface TransactionEvent {
  label: string
  description: string | null
  at: string | null
  state: 'done' | 'current' | 'failed' | 'upcoming'
}

export interface Transaction {
  id: string
  clientId: string
  clientName: string
  clientAvatarUrl: string | null
  asset: TransactionAsset
  assetName: string
  assetMeta: string
  orderType: TransactionOrderType
  amount: number
  units: number | null
  nav: number | null
  tenureMonths: number | null
  interestRate: number | null
  paymentMode: PaymentMode
  createdAt: string
  status: TransactionStatus
  failureReason: string | null
  timeline: TransactionEvent[]
}

export interface TransactionFilters {
  search: string
  asset: TransactionAsset | 'all'
  status: TransactionStatus | 'all'
  orderType: TransactionOrderType | 'all'
  range: TransactionRange
}

export interface TransactionListRequest extends ListRequest {
  clientId?: string
  filters: Omit<TransactionFilters, 'search'>
}

export interface TransactionSummary {
  total: number
  pending: number
}

export interface BulkActionResult {
  count: number
}
