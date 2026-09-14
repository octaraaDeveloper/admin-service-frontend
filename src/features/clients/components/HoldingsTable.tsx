import type { ApiError } from '@/api/client'
import { EmptyState, Monogram, ReturnValue, amcMonogram } from '@/components/common'
import { DataTable, LinkButton, type Column } from '@/components/ui'
import { formatCurrency } from '@/lib/format'
import type { ClientHolding } from '@/types'

const headerClass = 'text-xs tracking-wide'

const columns: Column<ClientHolding>[] = [
  {
    key: 'fund',
    header: 'FUND',
    headerClassName: headerClass,
    className: 'whitespace-normal',
    cell: (holding) => (
      <div className="flex items-center gap-3">
        <Monogram label={amcMonogram(holding.amcShortName)} color={holding.amcColor} />
        <div className="min-w-0">
          <p className="font-medium text-text-primary">{holding.fundName}</p>
          <p className="text-xs text-text-muted">{holding.category}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'invested',
    header: 'INVESTED',
    align: 'right',
    headerClassName: headerClass,
    cell: (holding) => <span className="tabular-nums">{formatCurrency(holding.invested)}</span>,
  },
  {
    key: 'current',
    header: 'CURRENT',
    align: 'right',
    headerClassName: headerClass,
    cell: (holding) => <span className="tabular-nums">{formatCurrency(holding.current)}</span>,
  },
  {
    key: 'returns',
    header: 'RETURNS',
    align: 'right',
    headerClassName: headerClass,
    cell: (holding) => <ReturnValue value={holding.returnsPct} digits={1} />,
  },
]

function HoldingCard({ holding }: { holding: ClientHolding }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Monogram label={amcMonogram(holding.amcShortName)} color={holding.amcColor} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-text-primary">{holding.fundName}</p>
          <p className="text-xs text-text-muted">{holding.category}</p>
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-2">
        <div>
          <dt className="text-2xs font-semibold tracking-wide text-text-muted uppercase">
            Invested
          </dt>
          <dd className="mt-0.5 text-sm font-medium text-text-primary tabular-nums">
            {formatCurrency(holding.invested)}
          </dd>
        </div>
        <div>
          <dt className="text-2xs font-semibold tracking-wide text-text-muted uppercase">
            Current
          </dt>
          <dd className="mt-0.5 text-sm font-medium text-text-primary tabular-nums">
            {formatCurrency(holding.current)}
          </dd>
        </div>
        <div className="text-right">
          <dt className="text-2xs font-semibold tracking-wide text-text-muted uppercase">Return</dt>
          <dd className="mt-0.5 text-sm">
            <ReturnValue value={holding.returnsPct} digits={1} />
          </dd>
        </div>
      </dl>
    </div>
  )
}

const renderHoldingCard = (holding: ClientHolding) => <HoldingCard holding={holding} />

interface HoldingsTableProps {
  holdings: ClientHolding[] | undefined
  loading: boolean
  error: ApiError | null
  onRetry: () => void
  clientId: string
}

export function HoldingsTable({ holdings, loading, error, onRetry, clientId }: HoldingsTableProps) {
  return (
    <DataTable
      columns={columns}
      rows={holdings}
      rowKey={(holding) => holding.id}
      loading={loading}
      error={error}
      onRetry={onRetry}
      minWidth={560}
      skeletonRows={3}
      mobileCard={renderHoldingCard}
      empty={
        <EmptyState
          title="No holdings yet"
          description="This client has not invested yet. Place the first order to see holdings here."
          compact
          action={<LinkButton to={`/clients/${clientId}/transact`}>Transact now</LinkButton>}
        />
      }
    />
  )
}
