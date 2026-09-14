import type { ComponentType } from 'react'
import { fundsApi } from '@/api/funds'
import { PageHeader } from '@/components/common/PageHeader'
import { Tabs } from '@/components/ui'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useQuery } from '@/hooks/useQuery'
import { AmcsTab } from '../components/AmcsTab'
import { FixedDepositsTab } from '../components/FixedDepositsTab'
import { MutualFundsTab } from '../components/MutualFundsTab'
import { useExploreParams, type ExploreTab } from '../hooks/useExploreParams'

const tabViews: Record<ExploreTab, ComponentType> = {
  'mutual-funds': MutualFundsTab,
  'fixed-deposits': FixedDepositsTab,
  amcs: AmcsTab,
}

export default function ExplorePage() {
  const { tab, setTab } = useExploreParams()
  const { data: summary } = useQuery('funds:summary', fundsApi.summary)
  const isMobile = useIsMobile()
  const count = (value: number | undefined) => (isMobile ? undefined : value)
  const ActiveTab = tabViews[tab]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Explore"
        description={
          summary
            ? `${summary.mutualFunds} mutual funds · ${summary.fixedDeposits} fixed deposit schemes · ${summary.amcs} AMCs`
            : 'Browse mutual funds, fixed deposits and AMCs'
        }
      />
      <Tabs<ExploreTab>
        value={tab}
        onChange={setTab}
        items={[
          { value: 'mutual-funds', label: 'Mutual Funds', count: count(summary?.mutualFunds) },
          {
            value: 'fixed-deposits',
            label: 'Fixed Deposits',
            count: count(summary?.fixedDeposits),
          },
          { value: 'amcs', label: 'AMCs', count: count(summary?.amcs) },
        ]}
      />
      <ActiveTab />
    </div>
  )
}
