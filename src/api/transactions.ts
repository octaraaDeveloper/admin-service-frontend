import { mock, mockFailure, paginate } from '@/mocks'
import {
  cancelTransactions,
  filterTransactions,
  pendingTransactions,
  transactions,
} from '@/mocks/transactions'
import type {
  BulkActionResult,
  Paginated,
  Transaction,
  TransactionListRequest,
  TransactionSummary,
} from '@/types'

export const transactionsApi = {
  list: (request: TransactionListRequest): Promise<Paginated<Transaction>> =>
    mock(paginate(filterTransactions(request), request.page, request.limit)),

  export: (request: TransactionListRequest): Promise<Transaction[]> =>
    mock(filterTransactions(request)),

  summary: (clientId?: string): Promise<TransactionSummary> => {
    const rows = clientId ? transactions.filter((row) => row.clientId === clientId) : transactions
    return mock({
      total: rows.length,
      pending: rows.filter((row) => row.status === 'pending').length,
    })
  },

  resendLinks: (ids: string[]): Promise<BulkActionResult> => {
    const count = pendingTransactions(ids).length
    if (count === 0) return mockFailure('None of the selected orders has a pending payment link')
    return mock({ count })
  },

  cancel: (ids: string[]): Promise<BulkActionResult> => {
    const count = cancelTransactions(ids)
    if (count === 0) return mockFailure('Only pending orders can be cancelled')
    return mock({ count })
  },
}
