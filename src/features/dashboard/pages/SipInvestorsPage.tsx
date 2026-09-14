import { useState } from 'react'
import { dashboardApi } from '@/api/dashboard'
import type { Column } from '@/components/ui/DataTable'
import { Select, type SelectOption } from '@/components/ui/Select'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatNumber } from '@/lib/format'
import type { SipInvestor, SipOptionsRange } from '@/types'
import { CardStat, DRILLDOWN_PAGE_SIZE, DrilldownPage, describe } from '../components/DrilldownPage'
import { InvestorCell } from '../components/InvestorCell'
import { KycBadge } from '../components/KycBadge'

const rangeOptions: SelectOption<SipOptionsRange>[] = [
  { value: '1m', label: '1 month' },
  { value: '3m', label: '3 months' },
  { value: '6m', label: '6 months' },
  { value: '1y', label: '1 year' },
  { value: '2y', label: '2 years' },
  { value: '3y', label: '3 years' },
  { value: '5y', label: '5 years' },
]

const columns: Column<SipInvestor>[] = [
  {
    key: 'name',
    header: 'Name',
    cell: (row) => (
      <InvestorCell clientId={row.clientId} name={row.name} avatarUrl={row.avatarUrl} />
    ),
  },
  {
    key: 'totalSipAmount',
    header: 'Total SIP amount',
    align: 'right',
    cell: (row) => (
      <span className="font-medium text-text-primary">{formatCurrency(row.totalSipAmount)}</span>
    ),
  },
  {
    key: 'kyc',
    header: 'KYC',
    align: 'center',
    cell: (row) => <KycBadge status={row.kycStatus} />,
  },
  {
    key: 'activeSips',
    header: 'No. of active SIPs',
    align: 'center',
    cell: (row) => formatNumber(row.activeSips),
  },
  {
    key: 'closedSips',
    header: 'No. of closed SIPs',
    align: 'center',
    cell: (row) => formatNumber(row.closedSips),
  },
]

function renderMobileCard(row: SipInvestor) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <InvestorCell clientId={row.clientId} name={row.name} avatarUrl={row.avatarUrl} />
        <KycBadge status={row.kycStatus} />
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-2">
        <CardStat label="Total SIP" value={formatCurrency(row.totalSipAmount)} />
        <CardStat label="Active SIPs" value={formatNumber(row.activeSips)} />
        <CardStat label="Closed SIPs" value={formatNumber(row.closedSips)} />
      </div>
    </div>
  )
}

export default function SipInvestorsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [range, setRange] = useState<SipOptionsRange>('1m')
  const { data, loading, error, refetch } = useQuery(
    `dashboard:sip-investors:${range}:${page}:${search}`,
    () => dashboardApi.sipInvestors({ page, limit: DRILLDOWN_PAGE_SIZE, search, range }),
  )

  return (
    <DrilldownPage
      title="SIP investors"
      description={describe(data?.total, search, 'active systematic investment plans')}
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
      actions={
        <Select
          value={range}
          onChange={(next) => {
            setRange(next)
            setPage(1)
          }}
          options={rangeOptions}
          placeholder="Options"
          className="h-10 w-auto text-sm font-medium text-text-secondary"
        />
      }
      csv={{
        filename: `sip-investors-${range}.csv`,
        headers: [
          'Name',
          'User ID',
          'PAN',
          'Total SIP amount',
          'KYC',
          'Active SIPs',
          'Closed SIPs',
        ],
        row: (row) => [
          row.name,
          row.clientId,
          row.pan,
          row.totalSipAmount,
          row.kycStatus,
          row.activeSips,
          row.closedSips,
        ],
      }}
      emptyDescription={
        search
          ? `No SIP investors match “${search}”.`
          : "You don't have any SIP investors yet. Add your first investor to get started."
      }
      mobileCard={renderMobileCard}
    />
  )
}
