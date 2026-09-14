import { CalendarDays, ChartLine } from 'lucide-react'
import { useState } from 'react'
import { dashboardApi } from '@/api/dashboard'
import { PageHeader } from '@/components/common/PageHeader'
import { LinkButton } from '@/components/ui/Button'
import { Select, type SelectOption } from '@/components/ui/Select'
import { useQuery } from '@/hooks/useQuery'
import { useAuthStore } from '@/store/auth'
import type { AumTrendRange, DashboardPeriod } from '@/types'
import { AssetAllocationCard } from '../components/AssetAllocationCard'
import { AumTrendCard } from '../components/AumTrendCard'
import { MetricTiles } from '../components/MetricTiles'
import { RecentInvestorsCard } from '../components/RecentInvestorsCard'
import { UpcomingSipsCard } from '../components/UpcomingSipsCard'

const periodOptions: SelectOption<DashboardPeriod>[] = [
  { value: 'this-month', label: 'This month' },
  { value: 'last-month', label: 'Last month' },
  { value: 'this-quarter', label: 'This quarter' },
  { value: 'this-year', label: 'This year' },
]

export default function DashboardPage() {
  const profile = useAuthStore((state) => state.profile)
  const [period, setPeriod] = useState<DashboardPeriod>('this-month')
  const [range, setRange] = useState<AumTrendRange>('1Y')

  const summary = useQuery(`dashboard:summary:${period}`, () => dashboardApi.summary(period))
  const trend = useQuery(`dashboard:aum-trend:${range}`, () => dashboardApi.aumTrend(range))
  const allocation = useQuery(`dashboard:allocation:${period}`, () =>
    dashboardApi.assetAllocation(period),
  )

  const firstName = profile?.name.trim().split(/\s+/)[0] || 'there'

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Overview"
        description={`Welcome back, ${firstName} — here's what's happening across Octaraa today.`}
        actions={
          <>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-text-secondary" />
              <Select
                value={period}
                onChange={setPeriod}
                options={periodOptions}
                align="end"
                className="h-10 w-auto pl-9 text-sm font-medium text-text-secondary"
              />
            </div>
            <LinkButton to="/dashboard/business-update" leftIcon={<ChartLine className="size-4" />}>
              Business update
            </LinkButton>
          </>
        }
      />

      <MetricTiles summary={summary.data} error={summary.error} onRetry={summary.refetch} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
        <AumTrendCard
          range={range}
          onRangeChange={setRange}
          data={trend.data}
          loading={trend.loading}
          error={trend.error}
          onRetry={trend.refetch}
        />
        <AssetAllocationCard
          allocation={allocation.data}
          loading={allocation.loading}
          error={allocation.error}
          onRetry={allocation.refetch}
        />
      </div>

      <RecentInvestorsCard />
      <UpcomingSipsCard />
    </div>
  )
}
