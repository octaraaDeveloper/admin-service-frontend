import { useState } from 'react'
import { dashboardApi } from '@/api/dashboard'
import type { Column } from '@/components/ui/DataTable'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatNumber } from '@/lib/format'
import type { FdInvestor } from '@/types'
import { CardStat, DRILLDOWN_PAGE_SIZE, DrilldownPage, describe } from '../components/DrilldownPage'
import { InvestorCell } from '../components/InvestorCell'
import { KycBadge } from '../components/KycBadge'

const columns: Column<FdInvestor>[] = [
  {
    key: 'name',
    header: 'Name',
    cell: (row) => (
      <InvestorCell clientId={row.clientId} name={row.name} avatarUrl={row.avatarUrl} />
    ),
  },
  {
    key: 'investment',
    header: 'Investment',
    align: 'right',
    cell: (row) => formatCurrency(row.investment),
  },
  {
    key: 'kyc',
    header: 'KYC',
    align: 'center',
    cell: (row) => <KycBadge status={row.kycStatus} />,
  },
  {
    key: 'currentValue',
    header: 'Current value',
    align: 'right',
    cell: (row) => (
      <span className="font-medium text-success">{formatCurrency(row.currentValue)}</span>
    ),
  },
  { key: 'fds', header: 'No. of FDs', align: 'center', cell: (row) => formatNumber(row.fds) },
]

function renderMobileCard(row: FdInvestor) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <InvestorCell clientId={row.clientId} name={row.name} avatarUrl={row.avatarUrl} />
        <KycBadge status={row.kycStatus} />
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-2">
        <CardStat label="Investment" value={formatCurrency(row.investment)} />
        <CardStat
          label="Current value"
          value={<span className="text-success">{formatCurrency(row.currentValue)}</span>}
        />
        <CardStat label="FDs" value={formatNumber(row.fds)} />
      </div>
    </div>
  )
}

export default function FdInvestorsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, loading, error, refetch } = useQuery(
    `dashboard:fd-investors:${page}:${search}`,
    () => dashboardApi.fdInvestors({ page, limit: DRILLDOWN_PAGE_SIZE, search }),
  )

  return (
    <DrilldownPage
      title="FD investors"
      description={describe(data?.total, search, 'active fixed deposits')}
      noun="investors"
      columns={columns}
      data={data}
      loading={loading}
      error={error}
      onRetry={refetch}
      onPageChange={setPage}
      search={search}
      onSearchChange={setSearch}
      minWidth={760}
      csv={{
        filename: 'fd-investors.csv',
        headers: ['Name', 'User ID', 'PAN', 'Investment', 'KYC', 'Current value', 'FDs'],
        row: (row) => [
          row.name,
          row.clientId,
          row.pan,
          row.investment,
          row.kycStatus,
          row.currentValue,
          row.fds,
        ],
      }}
      emptyDescription={
        search
          ? `No FD investors match “${search}”.`
          : "You don't have any fixed deposit investors yet. Add your first investor to get started."
      }
      mobileCard={renderMobileCard}
    />
  )
}
