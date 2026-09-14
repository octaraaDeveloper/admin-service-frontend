import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { fundsApi } from '@/api/funds'
import { ErrorState } from '@/components/common/states'
import { Avatar, Badge, Button, LinkButton, Modal, Skeleton } from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { cn } from '@/lib/utils'
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatDecimal,
  formatNumber,
  formatPercent,
} from '@/lib/format'
import type { MutualFundDetails } from '@/types'
import { AllocationBar } from './AllocationBar'
import { AmcLogo } from './AmcLogo'
import { DetailList } from './DetailList'
import { FundHoldingsTable } from './FundHoldingsTable'
import { FundPerformanceChart } from './FundPerformanceChart'
import { RatingStars } from './RatingStars'
import { ReturnValue, returnTone } from './ReturnValue'
import { RiskBadge } from './RiskBadge'

interface FundDetailsModalProps {
  fundId: string | null
  onClose: () => void
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      {children}
    </section>
  )
}

function Tile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col justify-between rounded-card border border-border bg-surface-sunken px-3 py-2.5">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-0.5 text-base font-semibold text-text-primary">{value}</p>
    </div>
  )
}

function FundDetailsBody({ fund }: { fund: MutualFundDetails }) {
  const ChangeIcon = fund.navChange1d >= 0 ? ArrowUpRight : ArrowDownRight
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <AmcLogo amc={fund.amc} size="lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-xl font-semibold text-text-primary tabular-nums">
              ₹{formatDecimal(fund.nav)}
            </p>
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-sm font-medium',
                returnTone(fund.navChange1d),
              )}
            >
              <ChangeIcon className="size-4" aria-hidden />
              {formatPercent(fund.navChange1d, 2, true)}
              <span className="ml-1 font-normal text-text-muted">1D</span>
            </span>
          </div>
          <p className="text-xs text-text-muted">NAV as on {formatDate(fund.navDate)}</p>
          <div className="flex flex-wrap items-center gap-2">
            <RiskBadge risk={fund.risk} />
            <Badge tone="brand">{fund.category}</Badge>
            <Badge>{fund.assetClass}</Badge>
            <RatingStars rating={fund.rating} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(
          [
            ['1Y returns', fund.returns1y],
            ['3Y returns', fund.returns3y],
            ['5Y returns', fund.returns5y],
          ] as const
        ).map(([label, value]) => (
          <Tile key={label} label={label} value={<ReturnValue value={value} />} />
        ))}
      </div>

      <Section title="Performance">
        <FundPerformanceChart history={fund.navHistory} />
      </Section>

      <Section title="Key details">
        <DetailList
          items={[
            { label: 'Expense ratio', value: formatPercent(fund.expenseRatio, 2) },
            { label: 'AUM', value: formatCompactCurrency(fund.aum) },
            { label: 'Exit load', value: fund.exitLoad },
            { label: 'Benchmark', value: fund.benchmark },
            { label: 'Launch date', value: formatDate(fund.launchDate) },
            {
              label: 'Lock-in',
              value: fund.lockInMonths ? `${fund.lockInMonths} months` : 'None',
            },
            { label: 'Investors', value: formatNumber(fund.investors) },
            { label: 'Rating', value: `${fund.rating} / 5` },
          ]}
        />
      </Section>

      <Section title="Minimum investment amounts">
        <div className="grid grid-cols-3 gap-2">
          <Tile label="Min for 1st investment" value={formatCurrency(fund.minLumpsum)} />
          <Tile label="Min for 2nd investment" value={formatCurrency(fund.minAdditional)} />
          <Tile label="Min for SIP" value={formatCurrency(fund.minSip)} />
        </div>
      </Section>

      <Section title="Asset allocation">
        <AllocationBar allocation={fund.allocation} />
      </Section>

      <Section title="Top holdings">
        <FundHoldingsTable holdings={fund.holdings} />
      </Section>

      <Section title="Fund management">
        <ul className="space-y-2">
          {fund.managers.map((manager) => (
            <li key={manager.name} className="flex items-center gap-3">
              <Avatar name={manager.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-text-primary">{manager.name}</p>
                <p className="text-xs text-text-muted">{manager.since}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="About">
        <p className="text-sm leading-relaxed text-text-secondary">{fund.about}</p>
      </Section>
    </div>
  )
}

function FundDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-56" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <Skeleton className="h-44" />
      <Skeleton className="h-40" />
    </div>
  )
}

export function FundDetailsModal({ fundId, onClose }: FundDetailsModalProps) {
  const { data, error, refetch } = useQuery(
    `funds:mf:detail:${fundId}`,
    () => fundsApi.getMutualFund(fundId ?? ''),
    Boolean(fundId),
  )

  return (
    <Modal
      open={Boolean(fundId)}
      onClose={onClose}
      size="lg"
      title={data?.name ?? 'Fund details'}
      description={data ? `${data.amc.name} · ${data.category}` : undefined}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <LinkButton to="/clients" rightIcon={<ArrowRight className="size-4" />}>
            Transact for a client
          </LinkButton>
        </>
      }
    >
      {error ? (
        <ErrorState error={error} onRetry={refetch} compact />
      ) : data ? (
        <FundDetailsBody fund={data} />
      ) : (
        <FundDetailsSkeleton />
      )}
    </Modal>
  )
}
