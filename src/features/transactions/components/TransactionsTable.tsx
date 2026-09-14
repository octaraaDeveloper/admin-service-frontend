import { EllipsisVertical, Eye, Forward, Trash2 } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'

import type { ApiError } from '@/api/client'
import { EmptyState } from '@/components/common'
import {
  Avatar,
  type Column,
  DataTable,
  DropdownMenu,
  IconButton,
  Pagination,
  type Selection,
  StatusBadge,
  keyOf,
} from '@/components/ui'
import { formatCurrency, formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Paginated, Transaction, TransactionAsset } from '@/types'

import { orderTypeLabels } from '../labels'

interface TransactionsTableProps {
  data: Paginated<Transaction> | undefined
  loading: boolean
  error: ApiError | null
  onRetry: () => void
  onPageChange: (page: number) => void
  selection: Selection
  /** Hide the client column when the table already lives inside a client profile. */
  showClient: boolean
  onView: (row: Transaction) => void
  onResend: (row: Transaction) => void
  onCancel: (row: Transaction) => void
}

const stop = (event: MouseEvent) => event.stopPropagation()

export function AssetBadge({ asset, className }: { asset: TransactionAsset; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-2xs font-semibold',
        asset === 'MF' ? 'bg-brand-tint text-brand' : 'bg-accent-tint text-accent',
        className,
      )}
    >
      {asset}
    </span>
  )
}

function ClientCell({ row }: { row: Transaction }) {
  return (
    <Link
      to={`/clients/${row.clientId}`}
      onClick={stop}
      className="group/client inline-flex max-w-full items-center gap-2.5 rounded-md focus-ring"
    >
      <Avatar name={row.clientName} src={row.clientAvatarUrl} size="sm" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-medium text-text-primary group-hover/client:underline">
          {row.clientName}
        </span>
        <span className="text-2xs font-medium text-text-muted">{row.clientId}</span>
      </span>
    </Link>
  )
}

function AssetCell({ row }: { row: Transaction }) {
  return (
    <span className="flex items-center gap-2">
      <AssetBadge asset={row.asset} />
      <span className="min-w-0 truncate" title={row.assetName}>
        {row.assetName}
      </span>
    </span>
  )
}

function MobileCard({ row, showClient }: { row: Transaction; showClient: boolean }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {showClient ? (
            <Avatar name={row.clientName} src={row.clientAvatarUrl} size="sm" />
          ) : (
            <AssetBadge asset={row.asset} />
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-text-primary">
              {showClient ? row.clientName : row.assetName}
            </p>
            <p className="truncate text-xs text-text-muted">
              {showClient ? row.clientId : row.assetMeta}
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-semibold text-text-primary">{formatCurrency(row.amount)}</p>
          <p className="text-xs text-text-muted">{orderTypeLabels[row.orderType]}</p>
        </div>
      </div>
      {showClient && (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <AssetBadge asset={row.asset} />
          <span className="truncate">{row.assetName}</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-text-muted">{formatDateTime(row.createdAt)}</span>
        <StatusBadge status={row.status} dot />
      </div>
    </div>
  )
}

interface RowHandlers {
  onView: (row: Transaction) => void
  onResend: (row: Transaction) => void
  onCancel: (row: Transaction) => void
}

function RowActions({ row, onView, onResend, onCancel }: RowHandlers & { row: Transaction }) {
  const pending = row.status === 'pending'
  return (
    <span onClick={stop} className="inline-flex">
      <DropdownMenu
        align="end"
        trigger={
          <IconButton label={`Actions for ${row.id}`} size="sm">
            <EllipsisVertical />
          </IconButton>
        }
        items={[
          { label: 'View details', icon: <Eye />, onSelect: () => onView(row) },
          {
            label: 'Resend link',
            icon: <Forward />,
            onSelect: () => onResend(row),
            disabled: !pending,
          },
          {
            label: 'Cancel order',
            icon: <Trash2 />,
            tone: 'danger',
            separatorBefore: true,
            onSelect: () => onCancel(row),
            disabled: !pending,
          },
        ]}
      />
    </span>
  )
}

const clientColumn: Column<Transaction> = {
  key: 'client',
  header: 'User',
  cell: (row) => <ClientCell row={row} />,
}

const baseColumns: Column<Transaction>[] = [
  {
    key: 'date',
    header: 'Date',
    align: 'center',
    className: 'whitespace-nowrap',
    cell: (row) => formatDateTime(row.createdAt),
  },
  {
    key: 'asset',
    header: 'Assets',
    // Absorb the remaining width so long fund names truncate instead of widening the table.
    className: 'w-full max-w-0',
    cell: (row) => <AssetCell row={row} />,
  },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    cell: (row) => (
      <span className="font-medium text-text-primary">{formatCurrency(row.amount)}</span>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    align: 'center',
    className: 'whitespace-nowrap',
    cell: (row) => orderTypeLabels[row.orderType],
  },
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    cell: (row) => <StatusBadge status={row.status} dot />,
  },
]

function buildColumns(showClient: boolean, handlers: RowHandlers): Column<Transaction>[] {
  return [
    ...(showClient ? [clientColumn] : []),
    ...baseColumns,
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      className: 'w-14 pl-0',
      cell: (row) => <RowActions row={row} {...handlers} />,
    },
  ]
}

const renderCard = (showClient: boolean) => (row: Transaction) => (
  <MobileCard row={row} showClient={showClient} />
)

export function TransactionsTable({
  data,
  loading,
  error,
  onRetry,
  onPageChange,
  selection,
  showClient,
  onView,
  onResend,
  onCancel,
}: TransactionsTableProps) {
  const columns = buildColumns(showClient, { onView, onResend, onCancel })

  return (
    <DataTable
      columns={columns}
      rows={data?.rows}
      rowKey={keyOf}
      loading={loading}
      error={error}
      onRetry={onRetry}
      selection={selection}
      onRowClick={onView}
      minWidth={showClient ? 1040 : 840}
      mobileCard={renderCard(showClient)}
      empty={
        <EmptyState
          title="No transactions found"
          description="Try adjusting your search or filters."
          compact
        />
      }
      footer={
        data && data.total > 0 ? (
          <Pagination
            page={data.page}
            pages={data.pages}
            total={data.total}
            limit={data.limit}
            onChange={onPageChange}
          />
        ) : undefined
      }
    />
  )
}
