import { useState } from 'react'
import { dashboardApi } from '@/api/dashboard'
import { StatusBadge } from '@/components/ui/Badge'
import type { Column } from '@/components/ui/DataTable'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatNumber } from '@/lib/format'
import type { MfInvestor } from '@/types'
import { CardStat, DRILLDOWN_PAGE_SIZE, DrilldownPage, describe } from '../components/DrilldownPage'
import { InvestorCell } from '../components/InvestorCell'

const columns: Column<MfInvestor>[] = [
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
    key: 'currentValue',
    header: 'Current value',
    align: 'right',
    cell: (row) => (
      <span className="font-medium text-success">{formatCurrency(row.currentValue)}</span>
    ),
  },
  {
    key: 'kyc',
    header: 'KYC',
    align: 'center',
    cell: (row) => <StatusBadge status={row.kycStatus} dot />,
  },
  {
    key: 'folios',
    header: 'No. of folios',
    align: 'center',
    cell: (row) => formatNumber(row.folios),
  },
  { key: 'sips', header: 'No. of SIP', align: 'center', cell: (row) => formatNumber(row.sips) },
]

function renderMobileCard(row: MfInvestor) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <InvestorCell clientId={row.clientId} name={row.name} avatarUrl={row.avatarUrl} />
        <StatusBadge status={row.kycStatus} dot />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <CardStat label="Investment" value={formatCurrency(row.investment)} />
        <CardStat
          label="Current value"
          value={<span className="text-success">{formatCurrency(row.currentValue)}</span>}
        />
        <CardStat label="Folios" value={formatNumber(row.folios)} />
        <CardStat label="SIPs" value={formatNumber(row.sips)} />
      </div>
    </div>
  )
}

export default function MfInvestorsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, loading, error, refetch } = useQuery(
    `dashboard:mf-investors:${page}:${search}`,
    () => dashboardApi.mfInvestors({ page, limit: DRILLDOWN_PAGE_SIZE, search }),
  )

  return (
    <DrilldownPage
      title="Mutual fund investors"
      description={describe(data?.total, search, 'active mutual fund investors')}
      noun="investors"
      columns={columns}
      data={data}
      loading={loading}
      error={error}
      onRetry={refetch}
      onPageChange={setPage}
      search={search}
      onSearchChange={setSearch}
      minWidth={860}
      csv={{
        filename: 'mutual-fund-investors.csv',
        headers: ['Name', 'User ID', 'PAN', 'Investment', 'Current value', 'KYC', 'Folios', 'SIPs'],
        row: (row) => [
          row.name,
          row.clientId,
          row.pan,
          row.investment,
          row.currentValue,
          row.kycStatus,
          row.folios,
          row.sips,
        ],
      }}
      emptyDescription={
        search
          ? `No mutual fund investors match “${search}”.`
          : "You don't have any mutual fund investors yet. Add your first investor to get started."
      }
      mobileCard={renderMobileCard}
    />
  )
}
