import { useEffect, useState } from 'react'

import { transactionsApi } from '@/api/transactions'
import { useMutation } from '@/hooks/useMutation'
import { useInvalidate, useQuery } from '@/hooks/useQuery'
import { formatDateTime } from '@/lib/format'
import { downloadCsv, pluralize } from '@/lib/utils'
import { toast } from '@/store/toast'
import type {
  Transaction,
  TransactionFilters,
  TransactionListRequest,
  TransactionRange,
} from '@/types'

import { PAGE_SIZE, defaultFilters, orderTypeLabels, statusLabels } from '../labels'

interface UseTransactionsListOptions {
  /** Scope the list to a single client (client profile tab). */
  clientId?: string
  /** Initial date range; the global page defaults to the current month. */
  range?: TransactionRange
}

const csvHeaders = [
  'Order ID',
  'Client',
  'Client ID',
  'Date',
  'Asset',
  'Asset name',
  'Type',
  'Amount',
  'Payment mode',
  'Status',
]

function csvRow(row: Transaction): (string | number)[] {
  return [
    row.id,
    row.clientName,
    row.clientId,
    formatDateTime(row.createdAt),
    row.asset,
    row.assetName,
    orderTypeLabels[row.orderType],
    row.amount,
    row.paymentMode,
    statusLabels[row.status],
  ]
}

/**
 * All state and behaviour for a transactions list: filters, paging, selection,
 * details, bulk actions and CSV export. Shared by the global page and the
 * per-client tab so the two never drift apart.
 */
export function useTransactionsList({
  clientId,
  range = defaultFilters.range,
}: UseTransactionsListOptions = {}) {
  const [filters, setFilters] = useState<TransactionFilters>({ ...defaultFilters, range })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const [cancelIds, setCancelIds] = useState<string[]>([])

  const { search, ...rest } = filters
  const request: TransactionListRequest = {
    page,
    limit: PAGE_SIZE,
    search,
    clientId,
    filters: rest,
  }
  const scope = clientId ? `client:${clientId}` : 'list'
  const key = `transactions:${scope}:${page}:${search}:${rest.asset}:${rest.status}:${rest.orderType}:${rest.range}`

  const query = useQuery(key, () => transactionsApi.list(request))
  const invalidate = useInvalidate()
  const resend = useMutation(transactionsApi.resendLinks)
  const cancel = useMutation(transactionsApi.cancel)
  const exporter = useMutation(transactionsApi.export)

  // `mutate` resolves to undefined on failure, so surface errors from state.
  const mutationError = resend.error ?? cancel.error ?? exporter.error
  useEffect(() => {
    if (mutationError) toast.error(mutationError.message)
  }, [mutationError])

  const rows = query.data?.rows ?? []
  const pendingSelected = rows.filter((row) => selected.has(row.id) && row.status === 'pending')
  const details = detailsId ? (rows.find((row) => row.id === detailsId) ?? null) : null

  const updateFilters = (patch: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPage(1)
    setSelected(new Set())
  }

  const changePage = (next: number) => {
    setPage(next)
    setSelected(new Set())
  }

  const resendLinks = async (ids: string[]) => {
    const result = await resend.mutate(ids)
    if (!result) return
    toast.success(`Payment link resent for ${result.count} ${pluralize(result.count, 'order')}`)
  }

  const confirmCancel = async () => {
    const result = await cancel.mutate(cancelIds)
    if (!result) return
    toast.success(`${result.count} ${pluralize(result.count, 'order')} cancelled`)
    invalidate('transactions')
    setCancelIds([])
    setSelected(new Set())
  }

  const exportCsv = async () => {
    const all = await exporter.mutate({ ...request, page: 1 })
    if (!all) return
    if (all.length === 0) {
      toast.info('No transactions match the current filters')
      return
    }
    const date = new Date().toISOString().slice(0, 10)
    downloadCsv(`transactions-${date}.csv`, csvHeaders, all.map(csvRow))
    toast.success(`Exported ${all.length} ${pluralize(all.length, 'transaction')}`)
  }

  return {
    filters,
    updateFilters,
    data: query.data,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
    changePage,
    selected,
    setSelected,
    pendingSelected,
    details,
    openDetails: (id: string) => setDetailsId(id),
    closeDetails: () => setDetailsId(null),
    resendLinks,
    resending: resend.loading,
    cancelIds,
    requestCancel: (ids: string[]) => setCancelIds(ids),
    dismissCancel: () => setCancelIds([]),
    confirmCancel,
    cancelling: cancel.loading,
    exportCsv,
    exporting: exporter.loading,
  }
}

export type TransactionsList = ReturnType<typeof useTransactionsList>
