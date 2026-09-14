import {
  ArrowRight,
  Banknote,
  CalendarCheck,
  CalendarClock,
  Clock,
  Gauge,
  Layers,
  Percent,
  PiggyBank,
  Repeat,
  Sparkles,
  Tag,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge, Card, LinkButton, Skeleton, type BadgeTone } from '@/components/ui'
import { formatCurrency, formatDate, formatDecimal, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { FdHolding, FdProvider, FundDetails, MfHolding, RiskLevel } from '@/types'
import { holdingDuration } from './calculations'
import { HoldingChart } from './HoldingChart'
import { maturityInstructionLabels, payoutLabels, returnTypeLabels, tenureLabel } from './options'

const monthYear = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' })

const riskTones: Record<RiskLevel, BadgeTone> = {
  Low: 'success',
  Medium: 'warning',
  High: 'accent',
  'Very High': 'danger',
}

interface ExistingInvestmentCardProps {
  title: string
  portfolioTo: string
  loading?: boolean
  selected: boolean
  held: boolean
  placeholder: ReactNode
  emptyTitle: ReactNode
  emptyDescription: ReactNode
  children?: ReactNode
}

export function ExistingInvestmentCard({
  title,
  portfolioTo,
  loading,
  selected,
  held,
  placeholder,
  emptyTitle,
  emptyDescription,
  children,
}: ExistingInvestmentCardProps) {
  let body: ReactNode
  if (!selected) {
    body = (
      <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
        <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-surface-sunken text-text-muted">
          <Wallet className="size-5" />
        </span>
        <p className="max-w-[240px] text-sm text-text-muted">{placeholder}</p>
      </div>
    )
  } else if (loading) {
    body = (
      <div className="space-y-4" aria-busy>
        <div className="flex justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <Skeleton className="h-32" />
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex justify-between gap-4">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>
    )
  } else if (!held) {
    body = (
      <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
        <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-brand-tint text-brand">
          <Sparkles className="size-5" />
        </span>
        <p className="text-base font-medium text-text-primary">{emptyTitle}</p>
        <p className="mt-1 max-w-[260px] text-sm text-text-muted">{emptyDescription}</p>
      </div>
    )
  } else {
    body = children
  }

  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-md font-semibold text-text-primary md:text-lg md:font-medium">{title}</h2>
      <div className="mt-4">{body}</div>
      <LinkButton
        to={portfolioTo}
        variant="outline"
        size="lg"
        rightIcon={<ArrowRight className="size-4" />}
        className="mt-5 w-full border-brand text-brand hover:bg-brand-tint"
      >
        View full portfolio
      </LinkButton>
    </Card>
  )
}

function HoldingRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: ReactNode
  value: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="flex items-center gap-2 text-xs text-text-muted [&_svg]:size-4 [&_svg]:shrink-0">
        {icon}
        {label}
      </dt>
      <dd className="text-right text-sm font-medium text-text-primary tabular-nums">{value}</dd>
    </div>
  )
}

function Headline({
  label,
  value,
  gainLabel,
  gain,
  gainPercent,
}: {
  label: string
  value: number
  gainLabel: string
  gain: number
  gainPercent: number
}) {
  const positive = gain >= 0
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="mt-0.5 text-lg font-medium text-text-primary tabular-nums">
          {formatCurrency(value)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-text-muted">{gainLabel}</p>
        <p
          className={cn(
            'mt-0.5 text-lg font-bold tabular-nums',
            positive ? 'text-success' : 'text-danger',
          )}
        >
          {positive ? '+' : '-'}
          {formatCurrency(Math.abs(gain))}{' '}
          <span className="text-xs">({formatPercent(gainPercent, 1, true)})</span>
        </p>
      </div>
    </div>
  )
}

export function MfHoldingDetails({ holding, fund }: { holding: MfHolding; fund: FundDetails }) {
  const gain = holding.currentValue - holding.invested
  const gainPercent = holding.invested ? (gain / holding.invested) * 100 : 0
  return (
    <div>
      <Headline
        label="Current Value"
        value={holding.currentValue}
        gainLabel="Returns"
        gain={gain}
        gainPercent={gainPercent}
      />
      <div className="mt-4">
        <HoldingChart series={holding.series} />
      </div>
      <dl className="mt-3 divide-y divide-border">
        <HoldingRow icon={<Wallet />} label="Invested" value={formatCurrency(holding.invested)} />
        <HoldingRow
          icon={<Layers />}
          label="Units Held"
          value={holding.units.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 3,
          })}
        />
        <HoldingRow
          icon={<TrendingUp />}
          label="Avg. NAV"
          value={`₹${formatDecimal(holding.avgNav)}`}
        />
        <HoldingRow
          icon={<CalendarCheck />}
          label="Last Invested"
          value={formatDate(holding.lastInvestedAt)}
        />
        <HoldingRow
          icon={<Clock />}
          label="Holding Since"
          value={`${monthYear.format(new Date(holding.holdingSince))} (${holdingDuration(holding.holdingSince)})`}
        />
        <HoldingRow
          icon={<Gauge />}
          label="Risk Profile"
          value={<Badge tone={riskTones[fund.risk]}>{fund.risk}</Badge>}
        />
        <HoldingRow
          icon={<Tag />}
          label="Category"
          value={<Badge tone="brand">{fund.category}</Badge>}
        />
      </dl>
    </div>
  )
}

export function FdHoldingDetails({
  holding,
  provider,
}: {
  holding: FdHolding
  provider: FdProvider
}) {
  const interest = holding.currentValue - holding.principal
  const interestPercent = holding.principal ? (interest / holding.principal) * 100 : 0
  return (
    <div>
      <Headline
        label="Current Value"
        value={holding.currentValue}
        gainLabel="Interest Earned"
        gain={interest}
        gainPercent={interestPercent}
      />
      <dl className="mt-3 divide-y divide-border">
        <HoldingRow icon={<Banknote />} label="Provider" value={provider.bank} />
        <HoldingRow icon={<PiggyBank />} label="Scheme" value={holding.schemeName} />
        <HoldingRow
          icon={<Wallet />}
          label="Principal Amount"
          value={formatCurrency(holding.principal)}
        />
        <HoldingRow
          icon={<Percent />}
          label="Interest Rate (p.a.)"
          value={formatPercent(holding.interestRate, 2)}
        />
        <HoldingRow
          icon={<Repeat />}
          label="Interest Type"
          value={holding.returnType === 'cumulative' ? 'Cumulative' : 'Non-cumulative'}
        />
        <HoldingRow
          icon={<CalendarCheck />}
          label="Deposit Date"
          value={formatDate(holding.depositedAt)}
        />
        <HoldingRow
          icon={<CalendarClock />}
          label="Maturity Date"
          value={formatDate(holding.maturesAt)}
        />
        <HoldingRow icon={<Clock />} label="Tenure" value={tenureLabel(holding.tenureMonths)} />
        <HoldingRow
          icon={<TrendingUp />}
          label="Payout Type"
          value={
            holding.returnType === 'cumulative'
              ? returnTypeLabels.cumulative
              : payoutLabels[holding.returnType]
          }
        />
        <HoldingRow
          icon={<Tag />}
          label="Maturity Instruction"
          value={maturityInstructionLabels[holding.maturityInstruction]}
        />
      </dl>
    </div>
  )
}
