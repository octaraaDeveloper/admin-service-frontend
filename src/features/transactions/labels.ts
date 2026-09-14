import type { SelectOption } from '@/components/ui'
import type {
  TransactionAsset,
  TransactionFilters,
  TransactionOrderType,
  TransactionRange,
  TransactionStatus,
} from '@/types'

export const PAGE_SIZE = 10

export const defaultFilters: TransactionFilters = {
  search: '',
  asset: 'all',
  status: 'all',
  orderType: 'all',
  range: 'this-month',
}

export const assetLabels: Record<TransactionAsset, string> = {
  MF: 'Mutual Funds',
  FD: 'Fixed Deposits',
}

export const statusLabels: Record<TransactionStatus, string> = {
  success: 'Success',
  pending: 'Pending',
  processing: 'Processing',
  failed: 'Failed',
  cancelled: 'Cancelled',
}

/** Labels shown in the Type column and order details. */
export const orderTypeLabels: Record<TransactionOrderType, string> = {
  lumpsum: 'Lumpsum · Buy',
  redemption: 'Lumpsum · Sell',
  sip: 'SIP',
  fd: 'FD Booking',
}

const orderTypeFilterLabels: Record<TransactionOrderType, string> = {
  lumpsum: 'Lumpsum',
  sip: 'SIP',
  redemption: 'Redemption',
  fd: 'FD',
}

export const rangeLabels: Record<TransactionRange, string> = {
  'this-month': 'This month',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '3m': 'Last 3 months',
  '6m': 'Last 6 months',
  all: 'All time',
}

/**
 * Filter selects show their name inside the trigger ("Asset: All"), so every
 * option label carries the prefix — Radix renders the selected option's label.
 */
function prefixed<T extends string>(
  prefix: string,
  labels: Record<T, string>,
): SelectOption<T | 'all'>[] {
  const options = Object.entries(labels) as [T, string][]
  return [
    { value: 'all', label: `${prefix}: All` },
    ...options.map(([value, label]) => ({ value, label: `${prefix}: ${label}` })),
  ]
}

export const assetOptions = prefixed('Asset', assetLabels)
export const statusOptions = prefixed('Status', statusLabels)
export const orderTypeOptions = prefixed('Order Type', orderTypeFilterLabels)
export const rangeOptions: SelectOption<TransactionRange>[] = (
  Object.entries(rangeLabels) as [TransactionRange, string][]
).map(([value, label]) => ({ value, label }))
