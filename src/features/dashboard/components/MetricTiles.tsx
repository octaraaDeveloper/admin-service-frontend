import { ChartLine, Landmark, Puzzle, Users, WalletCards } from 'lucide-react'
import type { ApiError } from '@/api/client'
import { ErrorState } from '@/components/common/states'
import { Card } from '@/components/ui/Card'
import { formatCompactCurrency, formatNumber } from '@/lib/format'
import type { DashboardSummary } from '@/types'
import { MetricTile } from './MetricTile'

interface MetricTilesProps {
  summary: DashboardSummary | undefined
  error: ApiError | null
  onRetry: () => void
}

const routes = {
  mf: '/dashboard/mf-investors',
  fd: '/dashboard/fd-investors',
  aum: '/dashboard/aum-breakdown',
  sip: '/dashboard/sip-investors',
}

export function MetricTiles({ summary, error, onRetry }: MetricTilesProps) {
  if (error) {
    return (
      <Card>
        <ErrorState error={error} onRetry={onRetry} compact />
      </Card>
    )
  }

  const money = (value: number | undefined) =>
    value === undefined ? undefined : formatCompactCurrency(value)
  const count = (value: number | undefined) =>
    value === undefined ? undefined : formatNumber(value)

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[316fr_256fr_446fr] lg:gap-[18px]">
        <div className="grid grid-cols-2 gap-2 lg:auto-rows-fr">
          <MetricTile
            label="Mutual Fund AUM"
            value={money(summary?.mutualFundAum)}
            to={routes.mf}
            className="col-span-2"
          />
          <MetricTile label="Monthly SIP" value={money(summary?.monthlySip)} to={routes.sip} />
          <MetricTile label="Imported Funds" value={money(summary?.importedFunds)} />
          <MetricTile
            label="Total SIP Investors"
            value={count(summary?.totalSipInvestors)}
            to={routes.sip}
          />
          <MetricTile
            label="Total SIP Count"
            value={count(summary?.totalSipCount)}
            to={routes.sip}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 lg:auto-rows-fr">
          <MetricTile
            label="Equity AUM"
            value={money(summary?.equityAum)}
            icon={<ChartLine />}
            to={routes.aum}
          />
          <MetricTile
            label="Debit AUM"
            value={money(summary?.debtAum)}
            icon={<WalletCards />}
            to={routes.aum}
          />
          <MetricTile
            label="Other"
            value={money(summary?.otherAum)}
            icon={<Puzzle />}
            to={routes.aum}
          />
          <MetricTile
            label="Total Invested"
            value={money(summary?.totalInvested)}
            icon={<Users />}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 lg:grid-rows-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <MetricTile
            label="Total FD AUM"
            value={money(summary?.totalFdAum)}
            icon={<Landmark />}
            to={routes.fd}
            size="lg"
            className="row-span-2 lg:col-span-2 lg:row-span-1"
          />
          <MetricTile
            label="No. of Deposit"
            value={count(summary?.depositCount)}
            to={routes.fd}
            align="center"
          />
          <MetricTile
            label="No. of Investor"
            value={count(summary?.fdInvestorCount)}
            to={routes.fd}
            align="center"
          />
        </div>
      </div>
    </Card>
  )
}
