import { useState } from 'react'
import { fundsApi } from '@/api/funds'
import { EmptyState } from '@/components/common/states'
import { Avatar, Badge, Button, DataTable, keyOf, SearchInput, type Column } from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatPercent } from '@/lib/format'
import type { FixedDepositScheme } from '@/types'
import { FdDetailsModal } from './FdDetailsModal'

const tenureLabel = (months: number[]) => `${months[0]}–${months[months.length - 1]} months`

function FdMobileCard({ scheme }: { scheme: FixedDepositScheme }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2.5">
        <Avatar name={scheme.bank} size="sm" className="mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium text-text-primary">{scheme.name}</p>
          <p className="text-xs text-text-placeholder">{scheme.bank}</p>
        </div>
        <Badge tone="info" className="shrink-0">
          {scheme.rating}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-2xs font-semibold tracking-wide text-text-secondary uppercase">Rate</p>
          <p className="text-sm font-semibold text-success tabular-nums">
            {formatPercent(scheme.interestRate, 2)}
          </p>
        </div>
        <div>
          <p className="text-2xs font-semibold tracking-wide text-text-secondary uppercase">
            Senior
          </p>
          <p className="text-sm font-medium text-text-secondary tabular-nums">
            {formatPercent(scheme.seniorCitizenRate, 2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xs font-semibold tracking-wide text-text-secondary uppercase">
            Min. amount
          </p>
          <p className="text-sm font-medium text-text-secondary tabular-nums">
            {formatCurrency(scheme.minAmount)}
          </p>
        </div>
      </div>
      <p className="text-xs text-text-muted">Tenures {tenureLabel(scheme.tenureMonths)}</p>
    </div>
  )
}

const renderSchemeCard = (scheme: FixedDepositScheme) => <FdMobileCard scheme={scheme} />

const columns: Column<FixedDepositScheme>[] = [
  {
    key: 'name',
    header: 'Scheme',
    className: 'min-w-64 whitespace-normal',
    cell: (scheme) => (
      <div className="flex items-center gap-3">
        <Avatar name={scheme.bank} size="sm" />
        <div className="min-w-0">
          <p className="font-medium text-text-primary">{scheme.name}</p>
          <p className="text-xs text-text-secondary">{scheme.bank}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'interestRate',
    header: 'Interest rate p.a.',
    align: 'right',
    cell: (scheme) => (
      <span className="font-semibold text-success tabular-nums">
        {formatPercent(scheme.interestRate, 2)}
      </span>
    ),
  },
  {
    key: 'seniorCitizenRate',
    header: 'Senior citizen',
    align: 'right',
    className: 'tabular-nums',
    cell: (scheme) => formatPercent(scheme.seniorCitizenRate, 2),
  },
  {
    key: 'minAmount',
    header: 'Min. amount',
    align: 'right',
    className: 'tabular-nums',
    cell: (scheme) => formatCurrency(scheme.minAmount),
  },
  { key: 'tenure', header: 'Tenures', cell: (scheme) => tenureLabel(scheme.tenureMonths) },
  {
    key: 'rating',
    header: 'Rating',
    cell: (scheme) => <Badge tone="info">{scheme.rating}</Badge>,
  },
]

export function FixedDepositsTab() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data, error, loading, refetch } = useQuery(`funds:fd:${search}`, () =>
    fundsApi.listFixedDeposits({ search }),
  )

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-10 -mx-4 bg-surface px-4 py-2 md:static md:mx-0 md:bg-transparent md:p-0">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search banks or schemes"
          className="md:w-72"
        />
      </div>
      <DataTable
        columns={columns}
        rows={data}
        rowKey={keyOf}
        loading={loading}
        error={error}
        onRetry={refetch}
        onRowClick={(scheme) => setSelectedId(scheme.id)}
        mobileCard={renderSchemeCard}
        minWidth={840}
        empty={
          <EmptyState
            compact
            title="No fixed deposit schemes found"
            description="Try searching for a different bank or scheme name."
            action={
              search && (
                <Button variant="outline" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              )
            }
          />
        }
      />
      <FdDetailsModal schemeId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  )
}
