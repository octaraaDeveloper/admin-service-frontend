import type {
  PaymentMode,
  Transaction,
  TransactionAsset,
  TransactionEvent,
  TransactionListRequest,
  TransactionOrderType,
  TransactionRange,
  TransactionStatus,
} from '@/types'
import { matchesSearch } from './index'
import { clients } from './clients'
import { fixedDepositSchemes, mutualFunds } from './funds'

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS
const ROW_COUNT = 60

function createRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    return state / 4_294_967_296
  }
}

const random = createRandom(20_260_914)
const pick = <T>(items: readonly T[]): T => items[Math.floor(random() * items.length)]

function weighted<T extends string>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][]
  let roll = random() * entries.reduce((sum, [, weight]) => sum + weight, 0)
  for (const [value, weight] of entries) {
    roll -= weight
    if (roll <= 0) return value
  }
  return entries[entries.length - 1][0]
}

const amounts: Record<TransactionOrderType, number[]> = {
  lumpsum: [5000, 10000, 15000, 25000, 50000, 75000, 100000, 150000, 200000, 500000],
  redemption: [10000, 20000, 25000, 50000, 100000, 250000],
  sip: [1000, 2000, 2500, 5000, 10000, 15000, 25000],
  fd: [25000, 50000, 100000, 150000, 200000, 500000, 1000000],
}

const failureReasons = [
  'Payment link expired before the client completed payment',
  'UPI payment was declined by the issuing bank',
  'Insufficient balance in the linked bank account',
  'Net banking session timed out during authorisation',
  'Auto mandate debit bounced',
]

const steps: Record<TransactionOrderType, [string, string, string, string]> = {
  lumpsum: ['Order placed', 'Payment link sent', 'Payment received', 'Units allotted'],
  fd: ['Order placed', 'Payment link sent', 'Payment received', 'FD booked'],
  sip: ['SIP registered', 'Mandate debit scheduled', 'Instalment debited', 'Units allotted'],
  redemption: ['Redemption placed', 'Request sent to AMC', 'Units redeemed', 'Amount credited'],
}

function buildTimeline(
  status: TransactionStatus,
  orderType: TransactionOrderType,
  createdAt: number,
  failureReason: string | null,
  closedAt = createdAt + 3 * HOUR_MS,
): TransactionEvent[] {
  const [placed, sent, paid, done] = steps[orderType]
  const sentAt = createdAt + 2 * MINUTE_MS
  const paidAt = createdAt + 3 * HOUR_MS + 20 * MINUTE_MS
  const doneAt = createdAt + DAY_MS + 4 * HOUR_MS
  const event = (
    label: string,
    at: number | null,
    state: TransactionEvent['state'],
    description: string | null = null,
  ): TransactionEvent => ({
    label,
    description,
    at: at === null ? null : new Date(at).toISOString(),
    state,
  })
  const head = [event(placed, createdAt, 'done'), event(sent, sentAt, 'done')]

  switch (status) {
    case 'success':
      return [...head, event(paid, paidAt, 'done'), event(done, doneAt, 'done')]
    case 'processing':
      return [
        ...head,
        event(paid, paidAt, 'done'),
        event(
          done,
          null,
          'current',
          orderType === 'fd'
            ? 'Awaiting booking confirmation from the bank'
            : 'Awaiting confirmation from the RTA',
        ),
      ]
    case 'pending':
      return [
        ...head,
        event(paid, null, 'current', 'Waiting for the client to complete payment'),
        event(done, null, 'upcoming'),
      ]
    case 'failed':
      return [...head, event('Payment failed', paidAt, 'failed', failureReason)]
    case 'cancelled':
      return [...head, event('Order cancelled', closedAt, 'failed', 'Cancelled by admin')]
  }
}

function createdAtFor(status: TransactionStatus) {
  // Settled orders need at least two days so their whole timeline sits in the past.
  const daysAgo =
    status === 'pending' || status === 'processing' ? random() * 12 : 2 + random() ** 2 * 180
  const date = new Date(Date.now() - daysAgo * DAY_MS)
  date.setHours(9 + Math.floor(random() * 9), Math.floor(random() * 60), 0, 0)
  return Math.min(date.getTime(), Date.now() - 30 * MINUTE_MS)
}

function paymentModeFor(orderType: TransactionOrderType): PaymentMode {
  if (orderType === 'sip') return 'Auto mandate'
  if (orderType === 'redemption') return 'Bank payout'
  return pick<PaymentMode>(['UPI', 'Net banking', 'NEFT', 'UPI'])
}

function createTransaction(index: number): Transaction {
  const client = pick(clients)
  const asset: TransactionAsset = random() < 0.7 ? 'MF' : 'FD'
  const orderType: TransactionOrderType =
    asset === 'FD' ? 'fd' : weighted({ lumpsum: 45, sip: 35, redemption: 20 })
  const status = weighted<TransactionStatus>({
    success: 55,
    pending: 15,
    processing: 10,
    failed: 12,
    cancelled: 8,
  })
  const amount = pick(amounts[orderType])
  const createdAt = createdAtFor(status)
  const failureReason = status === 'failed' ? pick(failureReasons) : null

  const base = {
    id: `ORD-${2_609_000 + index * 13 + Math.floor(random() * 12)}`,
    clientId: client.id,
    clientName: client.name,
    clientAvatarUrl: client.avatarUrl,
    orderType,
    amount,
    paymentMode: paymentModeFor(orderType),
    createdAt: new Date(createdAt).toISOString(),
    status,
    failureReason,
    timeline: buildTimeline(status, orderType, createdAt, failureReason),
  }

  if (asset === 'FD') {
    const scheme = pick(fixedDepositSchemes)
    return {
      ...base,
      asset,
      assetName: scheme.name,
      assetMeta: `${scheme.bank} · ${scheme.rating}`,
      units: null,
      nav: null,
      tenureMonths: pick(scheme.tenureMonths),
      interestRate: scheme.interestRate,
    }
  }

  const fund = pick(mutualFunds)
  return {
    ...base,
    asset,
    assetName: fund.name,
    assetMeta: `${fund.category} · ${fund.assetClass}`,
    units: Math.round((amount / fund.nav) * 1000) / 1000,
    nav: fund.nav,
    tenureMonths: null,
    interestRate: null,
  }
}

export const transactions: Transaction[] = Array.from({ length: ROW_COUNT }, (_, index) =>
  createTransaction(index),
).toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))

function rangeStart(range: TransactionRange): number | null {
  const now = new Date()
  switch (range) {
    case 'this-month':
      return new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    case '7d':
      return now.getTime() - 7 * DAY_MS
    case '30d':
      return now.getTime() - 30 * DAY_MS
    case '3m':
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).getTime()
    case '6m':
      return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).getTime()
    case 'all':
      return null
  }
}

export function filterTransactions(request: TransactionListRequest) {
  const { asset, status, orderType, range } = request.filters
  const from = rangeStart(range)
  return transactions.filter(
    (row) =>
      (!request.clientId || row.clientId === request.clientId) &&
      (asset === 'all' || row.asset === asset) &&
      (status === 'all' || row.status === status) &&
      (orderType === 'all' || row.orderType === orderType) &&
      (from === null || new Date(row.createdAt).getTime() >= from) &&
      matchesSearch(request.search ?? '', [row.clientName, row.clientId, row.assetName, row.id]),
  )
}

export function pendingTransactions(ids: string[]) {
  return transactions.filter((row) => ids.includes(row.id) && row.status === 'pending')
}

export function cancelTransactions(ids: string[]) {
  const rows = pendingTransactions(ids)
  for (const row of rows) {
    row.status = 'cancelled'
    row.timeline = buildTimeline(
      'cancelled',
      row.orderType,
      new Date(row.createdAt).getTime(),
      null,
      Date.now(),
    )
  }
  return rows.length
}
