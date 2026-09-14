import { ArrowRight, Check, ListFilter } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { dashboardApi } from '@/api/dashboard'
import { EmptyState } from '@/components/common/states'
import { StatusBadge } from '@/components/ui/Badge'
import { DataTable, keyOf, type Column } from '@/components/ui/DataTable'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { IconButton } from '@/components/ui/IconButton'
import { SearchInput } from '@/components/ui/SearchInput'
import { ViewLink } from '@/components/ui/Table'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatDate } from '@/lib/format'
import type { RecentInvestor, RecentInvestorsKycFilter } from '@/types'
import { InvestorCell } from './InvestorCell'
import { SectionHeader } from './SectionHeader'

const kycFilters: { value: RecentInvestorsKycFilter; label: string }[] = [
  { value: 'all', label: 'All KYC statuses' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
]

const columns: Column<RecentInvestor>[] = [
  {
    key: 'name',
    header: 'Name',
    cell: (row) => (
      <InvestorCell clientId={row.clientId} name={row.name} avatarUrl={row.avatarUrl} />
    ),
  },
  { key: 'joinedAt', header: 'Joining date', cell: (row) => formatDate(row.joinedAt) },
  {
    key: 'aum',
    header: 'AUM',
    align: 'right',
    cell: (row) => <span className="font-medium text-text-primary">{formatCurrency(row.aum)}</span>,
  },
  {
    key: 'kyc',
    header: 'KYC',
    align: 'center',
    cell: (row) => <StatusBadge status={row.kycStatus} dot />,
  },
  {
    key: 'profile',
    header: 'Profile',
    align: 'right',
    cell: (row) => <ViewLink to={`/clients/${row.clientId}`} />,
  },
]

function renderMobileCard(row: RecentInvestor) {
  return (
    <div className="flex items-center justify-between gap-3">
      <InvestorCell
        clientId={row.clientId}
        name={row.name}
        avatarUrl={row.avatarUrl}
        meta={`Joined ${formatDate(row.joinedAt)}`}
      />
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-semibold text-text-primary">{formatCurrency(row.aum)}</span>
        <StatusBadge status={row.kycStatus} dot />
      </div>
    </div>
  )
}

export function RecentInvestorsCard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [kyc, setKyc] = useState<RecentInvestorsKycFilter>('all')
  const { data, loading, error, refetch } = useQuery(
    `dashboard:recent-investors:${kyc}:${search}`,
    () => dashboardApi.recentInvestors({ search, kyc }),
  )

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader
        title="Recent investors"
        description="Latest onboarded & active clients"
        actions={
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search"
              className="min-w-0 flex-1 sm:w-[273px] sm:flex-none"
            />
            <DropdownMenu
              trigger={
                <IconButton label="Filter by KYC status" variant="outline">
                  <ListFilter />
                </IconButton>
              }
              items={kycFilters.map((filter) => ({
                label: filter.label,
                icon:
                  filter.value === kyc ? (
                    <Check className="text-brand" />
                  ) : (
                    <span className="size-4" />
                  ),
                onSelect: () => setKyc(filter.value),
              }))}
            />
          </div>
        }
      />
      <DataTable
        columns={columns}
        rows={data}
        rowKey={keyOf}
        loading={loading}
        error={error}
        onRetry={refetch}
        skeletonRows={5}
        minWidth={640}
        onRowClick={(row) => navigate(`/clients/${row.clientId}`)}
        empty={
          <EmptyState
            title="No investors found"
            description="Try a different name, PAN or user ID, or change the KYC filter."
            compact
          />
        }
        mobileCard={renderMobileCard}
        footer={
          <Link
            to="/clients"
            className="mx-auto flex w-fit items-center gap-1 rounded-sm text-sm font-medium text-brand focus-ring hover:underline"
          >
            View all <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
    </section>
  )
}
