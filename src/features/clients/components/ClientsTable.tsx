import { useNavigate } from 'react-router-dom'
import type { ApiError } from '@/api/client'
import { EmptyState } from '@/components/common'
import {
  Avatar,
  DataTable,
  Pagination,
  StatusBadge,
  ViewLink,
  type Column,
  type Selection,
} from '@/components/ui'
import { formatCompactCurrency } from '@/lib/format'
import type { ClientProfile, Paginated } from '@/types'

interface ClientsTableProps {
  data: Paginated<ClientProfile> | undefined
  loading: boolean
  error: ApiError | null
  onRetry: () => void
  selection: Selection
  onPageChange: (page: number) => void
  onClear: () => void
}

const headerClass = 'text-xs tracking-wide text-text-secondary'

const columns: Column<ClientProfile>[] = [
  {
    key: 'name',
    header: 'NAME',
    headerClassName: headerClass,
    cell: (client) => (
      <div className="flex items-center gap-3">
        <Avatar name={client.name} src={client.avatarUrl} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-medium text-text-primary">{client.name}</p>
          <p className="text-2xs font-medium text-text-muted">{client.id}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'pan',
    header: 'PAN',
    headerClassName: headerClass,
    cell: (client) => <span className="tabular-nums">{client.pan}</span>,
  },
  {
    key: 'aum',
    header: 'AUM',
    align: 'right',
    headerClassName: headerClass,
    cell: (client) => (
      <span className="font-medium text-text-primary tabular-nums">
        {formatCompactCurrency(client.aum)}
      </span>
    ),
  },
  {
    key: 'kyc',
    header: 'KYC STATUS',
    headerClassName: headerClass,
    cell: (client) => <StatusBadge status={client.kycStatus} dot />,
  },
  {
    key: 'action',
    header: 'ACTION',
    headerClassName: headerClass,
    cell: (client) => <ViewLink to={`/clients/${client.id}`} />,
  },
]

export function ClientsTable({
  data,
  loading,
  error,
  onRetry,
  selection,
  onPageChange,
  onClear,
}: ClientsTableProps) {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={columns}
      rows={data?.rows}
      rowKey={(client) => client.id}
      loading={loading}
      error={error}
      onRetry={onRetry}
      selection={selection}
      onRowClick={(client) => navigate(`/clients/${client.id}`)}
      minWidth={680}
      skeletonRows={8}
      empty={
        <EmptyState
          title="No clients found"
          description="Try a different name, PAN or user ID, or clear the KYC filter."
          compact
          action={
            <button
              type="button"
              onClick={onClear}
              className="rounded-sm text-sm font-medium text-brand focus-ring hover:underline"
            >
              Clear filters
            </button>
          }
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
