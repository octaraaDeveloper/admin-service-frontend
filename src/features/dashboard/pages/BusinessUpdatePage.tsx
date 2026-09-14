import { useState } from 'react'
import { dashboardApi } from '@/api/dashboard'
import { Badge } from '@/components/ui/Badge'
import type { Column } from '@/components/ui/DataTable'
import { Select, type SelectOption } from '@/components/ui/Select'
import { Tabs } from '@/components/ui/Tabs'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { BusinessUpdateFilter, BusinessUpdateFrequency, BusinessUpdateRow } from '@/types'
import { CardStat, DRILLDOWN_PAGE_SIZE, DrilldownPage } from '../components/DrilldownPage'

const frequencyOptions: SelectOption<BusinessUpdateFrequency>[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]

const frequencyCopy: Record<BusinessUpdateFrequency, string> = {
  monthly: 'Net inflows this month by instrument',
  quarterly: 'Net inflows this quarter by instrument',
  yearly: 'Net inflows this year by instrument',
}

const filters: { value: BusinessUpdateFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Debt', label: 'Debt' },
  { value: 'FD', label: 'FD' },
]

function NetInvestment({ value }: { value: number }) {
  return (
    <span className={cn('font-medium', value >= 0 ? 'text-success' : 'text-danger')}>
      {value < 0 ? '-' : ''}
      {formatCurrency(Math.abs(value))}
    </span>
  )
}

const columns: Column<BusinessUpdateRow>[] = [
  { key: 'date', header: 'Date', cell: (row) => formatDate(row.date) },
  { key: 'type', header: 'Type', cell: (row) => <Badge tone="brand">{row.type}</Badge> },
  {
    key: 'investment',
    header: 'Investment',
    align: 'right',
    cell: (row) => formatCurrency(row.investment),
  },
  {
    key: 'redemption',
    header: 'Redemption',
    align: 'right',
    cell: (row) => formatCurrency(row.redemption),
  },
  {
    key: 'net',
    header: 'Net investment',
    align: 'right',
    cell: (row) => <NetInvestment value={row.netInvestment} />,
  },
]

function renderMobileCard(row: BusinessUpdateRow) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone="brand">{row.type}</Badge>
          <span className="text-xs text-text-muted">{formatDate(row.date)}</span>
        </div>
        <NetInvestment value={row.netInvestment} />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <CardStat label="Investment" value={formatCurrency(row.investment)} />
        <CardStat label="Redemption" value={formatCurrency(row.redemption)} />
      </div>
    </div>
  )
}

export default function BusinessUpdatePage() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<BusinessUpdateFilter>('all')
  const [frequency, setFrequency] = useState<BusinessUpdateFrequency>('monthly')
  const { data, loading, error, refetch } = useQuery(
    `dashboard:business-update:${frequency}:${filter}:${page}`,
    () => dashboardApi.businessUpdate({ page, limit: DRILLDOWN_PAGE_SIZE, filter, frequency }),
  )

  return (
    <DrilldownPage
      title="Business update"
      description={frequencyCopy[frequency]}
      noun="entries"
      columns={columns}
      data={data}
      loading={loading}
      error={error}
      onRetry={refetch}
      onPageChange={setPage}
      minWidth={720}
      actions={
        <Select
          value={frequency}
          onChange={(next) => {
            setFrequency(next)
            setPage(1)
          }}
          options={frequencyOptions}
          className="h-10 w-auto text-sm font-medium text-text-secondary"
        />
      }
      csv={{
        filename: `business-update-${frequency}.csv`,
        headers: ['Date', 'Type', 'Investment', 'Redemption', 'Net investment'],
        row: (row) => [row.date, row.type, row.investment, row.redemption, row.netInvestment],
      }}
      emptyTitle="No inflows found"
      emptyDescription="There are no investments or redemptions for this instrument in the selected period."
      emptyAction={null}
      mobileCard={renderMobileCard}
    >
      <Tabs
        value={filter}
        onChange={(next) => {
          setFilter(next)
          setPage(1)
        }}
        variant="pills"
        items={filters.map((item) => ({
          value: item.value,
          label: item.label,
          count: data?.counts[item.value],
        }))}
      />
    </DrilldownPage>
  )
}
