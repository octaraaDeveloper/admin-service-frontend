import { useState } from 'react'
import { dashboardApi } from '@/api/dashboard'
import { Monogram, amcMonogram } from '@/components/common/Monogram'
import type { Column } from '@/components/ui/DataTable'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency } from '@/lib/format'
import type { AumBreakdownRow } from '@/types'
import { CardStat, DRILLDOWN_PAGE_SIZE, DrilldownPage } from '../components/DrilldownPage'

function FundCell({ row }: { row: AumBreakdownRow }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Monogram label={amcMonogram(row.amcShortName)} color={row.amcColor} />
      <div className="min-w-0">
        <p className="truncate font-medium text-text-primary">{row.fundName}</p>
        <p className="truncate text-2xs font-medium text-text-placeholder">{row.category}</p>
      </div>
    </div>
  )
}

const columns: Column<AumBreakdownRow>[] = [
  { key: 'fund', header: 'Fund name', cell: (row) => <FundCell row={row} /> },
  { key: 'equity', header: 'Equity', align: 'right', cell: (row) => formatCurrency(row.equity) },
  { key: 'debt', header: 'Debt', align: 'right', cell: (row) => formatCurrency(row.debt) },
  { key: 'hybrid', header: 'Hybrid', align: 'right', cell: (row) => formatCurrency(row.hybrid) },
  { key: 'other', header: 'Other', align: 'right', cell: (row) => formatCurrency(row.other) },
  {
    key: 'total',
    header: 'Total',
    align: 'right',
    cell: (row) => (
      <span className="font-semibold text-text-primary">{formatCurrency(row.total)}</span>
    ),
  },
]

function renderMobileCard(row: AumBreakdownRow) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <FundCell row={row} />
        <span className="shrink-0 text-sm font-semibold text-text-primary">
          {formatCurrency(row.total)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4">
        <CardStat label="Equity" value={formatCurrency(row.equity)} />
        <CardStat label="Debt" value={formatCurrency(row.debt)} />
        <CardStat label="Hybrid" value={formatCurrency(row.hybrid)} />
        <CardStat label="Other" value={formatCurrency(row.other)} />
      </div>
    </div>
  )
}

export default function AumBreakdownPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, loading, error, refetch } = useQuery(
    `dashboard:aum-breakdown:${page}:${search}`,
    () => dashboardApi.aumBreakdown({ page, limit: DRILLDOWN_PAGE_SIZE, search }),
  )

  return (
    <DrilldownPage
      title="Total AUM breakdown"
      description="Assets under management by instrument class"
      noun="funds"
      columns={columns}
      data={data}
      loading={loading}
      error={error}
      onRetry={refetch}
      onPageChange={setPage}
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search fund or AMC"
      minWidth={900}
      csv={{
        filename: 'aum-breakdown.csv',
        headers: ['Fund', 'AMC', 'Category', 'Equity', 'Debt', 'Hybrid', 'Other', 'Total'],
        row: (row) => [
          row.fundName,
          row.amcName,
          row.category,
          row.equity,
          row.debt,
          row.hybrid,
          row.other,
          row.total,
        ],
      }}
      emptyTitle="No funds found"
      emptyDescription={
        search ? `No funds match “${search}”.` : 'There is no AUM to break down yet.'
      }
      emptyAction={null}
      mobileCard={renderMobileCard}
    />
  )
}
