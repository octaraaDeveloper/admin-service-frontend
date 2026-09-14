import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

import { ConfirmModal } from '@/components/ui'
import { pluralize } from '@/lib/utils'

import type { TransactionsList } from '../hooks/useTransactionsList'
import { TransactionDetailsModal } from './TransactionDetailsModal'
import { TransactionFilters } from './TransactionFilters'
import { TransactionsTable } from './TransactionsTable'

interface TransactionsViewProps {
  list: TransactionsList
  /** Show the client column and client block in details (off inside a client profile). */
  showClient?: boolean
  /** Extra actions rendered in the filter bar (e.g. Download CSV on the client tab). */
  actions?: ReactNode
}

/**
 * Filters + table + details / confirm dialogs. Shared by the global
 * Transactions page and the per-client Transactions tab.
 */
export function TransactionsView({ list, showClient = true, actions }: TransactionsViewProps) {
  const cancelCount = list.cancelIds.length

  return (
    <div className="space-y-4">
      <TransactionFilters
        filters={list.filters}
        onChange={list.updateFilters}
        selectedCount={list.selected.size}
        pendingSelectedCount={list.pendingSelected.length}
        onResend={() => list.resendLinks([...list.selected])}
        onCancel={() => list.requestCancel(list.pendingSelected.map((row) => row.id))}
        resending={list.resending}
      >
        {actions}
      </TransactionFilters>

      <TransactionsTable
        data={list.data}
        loading={list.loading}
        error={list.error}
        onRetry={list.refetch}
        onPageChange={list.changePage}
        selection={{ selected: list.selected, onChange: list.setSelected }}
        showClient={showClient}
        onView={(row) => list.openDetails(row.id)}
        onResend={(row) => list.resendLinks([row.id])}
        onCancel={(row) => list.requestCancel([row.id])}
      />

      <TransactionDetailsModal
        transaction={list.details}
        onClose={list.closeDetails}
        showClient={showClient}
        onResend={(row) => list.resendLinks([row.id])}
        onCancel={(row) => list.requestCancel([row.id])}
        resending={list.resending}
      />

      <ConfirmModal
        open={cancelCount > 0}
        onClose={list.dismissCancel}
        onConfirm={list.confirmCancel}
        title={`Cancel ${cancelCount === 1 ? 'this order' : `${cancelCount} orders`}?`}
        description={`The payment ${pluralize(cancelCount, 'link')} will be revoked and the ${pluralize(cancelCount, 'client')} notified. This can't be undone.`}
        confirmLabel="Yes, cancel"
        cancelLabel="Keep"
        tone="danger"
        loading={list.cancelling}
        icon={<TriangleAlert />}
      />
    </div>
  )
}
