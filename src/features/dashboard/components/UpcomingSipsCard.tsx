import { ArrowRight, Check, ListFilter } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi } from '@/api/dashboard'
import { EmptyState } from '@/components/common/states'
import { DataTable, keyOf, type Column } from '@/components/ui/DataTable'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { IconButton } from '@/components/ui/IconButton'
import { Select } from '@/components/ui/Select'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatDate } from '@/lib/format'
import type { SipWindow, UpcomingSip } from '@/types'
import { InvestorCell } from './InvestorCell'
import { SectionHeader } from './SectionHeader'

const windows: { value: SipWindow; label: string; description: string }[] = [
  { value: 'this-week', label: 'This week', description: 'Scheduled installments this week' },
  { value: 'next-week', label: 'Next week', description: 'Scheduled installments next week' },
  { value: 'this-month', label: 'This month', description: 'Scheduled installments this month' },
]

const ALL_USERS = 'all'

const columns: Column<UpcomingSip>[] = [
  {
    key: 'client',
    header: 'Client',
    cell: (row) => (
      <InvestorCell clientId={row.clientId} name={row.clientName} avatarUrl={row.avatarUrl} />
    ),
  },
  {
    key: 'fund',
    header: 'Fund name',
    className: 'whitespace-normal',
    cell: (row) => <span className="font-medium text-text-primary">{row.fundName}</span>,
  },
  { key: 'date', header: 'SIP date', cell: (row) => formatDate(row.sipDate) },
  {
    key: 'amount',
    header: 'SIP amount',
    align: 'right',
    cell: (row) => <span className="font-medium text-brand">{formatCurrency(row.amount)}</span>,
  },
]

function renderMobileCard(row: UpcomingSip) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-medium text-text-primary">{row.fundName}</p>
        <Link
          to={`/clients/${row.clientId}`}
          className="mt-0.5 block truncate rounded-sm text-xs text-text-muted focus-ring hover:text-brand hover:underline"
        >
          {row.clientName}
        </Link>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="text-sm font-semibold text-brand">{formatCurrency(row.amount)}</span>
        <span className="text-xs text-text-muted">{formatDate(row.sipDate)}</span>
      </div>
    </div>
  )
}

export function UpcomingSipsCard() {
  const [clientId, setClientId] = useState(ALL_USERS)
  const [sipWindow, setSipWindow] = useState<SipWindow>('this-week')
  const selectedClient = clientId === ALL_USERS ? undefined : clientId
  const { data, loading, error, refetch } = useQuery(
    `dashboard:upcoming-sips:${sipWindow}:${clientId}`,
    () => dashboardApi.upcomingSips({ clientId: selectedClient, window: sipWindow }),
  )
  const clientsQuery = useQuery('dashboard:sip-clients', () => dashboardApi.sipClients())
  const activeWindow = windows.find((item) => item.value === sipWindow) ?? windows[0]

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader
        title="Upcoming SIPs"
        description={activeWindow.description}
        actions={
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="min-w-0 flex-1 sm:flex-none">
              <Select
                value={clientId}
                onChange={setClientId}
                placeholder="Choose User"
                className="h-10 text-sm sm:w-[186px]"
                options={[
                  { value: ALL_USERS, label: 'All users' },
                  ...(clientsQuery.data ?? []).map((client) => ({
                    value: client.id,
                    label: client.name,
                  })),
                ]}
              />
            </div>
            <DropdownMenu
              trigger={
                <IconButton label="Choose period" variant="outline">
                  <ListFilter />
                </IconButton>
              }
              items={windows.map((item) => ({
                label: item.label,
                icon:
                  item.value === sipWindow ? (
                    <Check className="text-brand" />
                  ) : (
                    <span className="size-4" />
                  ),
                onSelect: () => setSipWindow(item.value),
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
        skeletonRows={6}
        minWidth={640}
        empty={
          <EmptyState
            title="No upcoming SIPs"
            description={`No installments are scheduled ${activeWindow.label.toLowerCase()}${selectedClient ? ' for this user' : ''}.`}
            compact
          />
        }
        mobileCard={renderMobileCard}
        footer={
          <Link
            to="/transactions"
            className="mx-auto flex w-fit items-center gap-1 rounded-sm text-sm font-medium text-brand focus-ring hover:underline"
          >
            View all <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
    </section>
  )
}
