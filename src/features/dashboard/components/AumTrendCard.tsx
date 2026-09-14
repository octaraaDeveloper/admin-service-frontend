import { useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ApiError } from '@/api/client'
import { ErrorState } from '@/components/common/states'
import { Card } from '@/components/ui/Card'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCompactCurrency, formatDate, formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AumTrendPoint, AumTrendRange, AumTrendSeries } from '@/types'

interface AumTrendCardProps {
  range: AumTrendRange
  onRangeChange: (range: AumTrendRange) => void
  data: AumTrendPoint[] | undefined
  loading: boolean
  error: ApiError | null
  onRetry: () => void
}

const rangeOptions: { value: AumTrendRange; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '1Y', label: '1Y' },
  { value: 'ALL', label: 'All' },
]

const series: { key: AumTrendSeries; label: string; color: string; gradientId: string }[] = [
  {
    key: 'mutualFunds',
    label: 'Mutual Funds',
    color: 'var(--color-chart-2)',
    gradientId: 'aum-trend-mf',
  },
  {
    key: 'fixedDeposit',
    label: 'Fixed Deposit',
    color: 'var(--color-chart-1)',
    gradientId: 'aum-trend-fd',
  },
]

const timeTick = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
const dayTick = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' })
const monthTick = new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit' })

function tickFormatter(range: AumTrendRange) {
  return (value: string) => {
    const date = new Date(value)
    if (range === '1D') return timeTick.format(date)
    if (range === '1Y' || range === 'ALL') return monthTick.format(date).replace(' ', " '")
    return dayTick.format(date)
  }
}

interface TooltipEntry {
  name?: string | number
  value?: string | number | readonly (string | number)[]
  color?: string
}

function TrendTooltip({
  active,
  payload,
  label,
  range,
}: {
  active?: boolean
  payload?: readonly TooltipEntry[]
  label?: string | number
  range: AumTrendRange
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-text-primary px-3.5 py-2.5 text-surface shadow-lg">
      {payload.map((entry) => (
        <p key={String(entry.name)} className="flex items-center gap-2 text-sm font-semibold">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
            aria-hidden
          />
          {entry.name}: {formatCompactCurrency(Number(entry.value))}
        </p>
      ))}
      <p className="mt-1 text-xs text-text-placeholder">
        {range === '1D' ? formatDateTime(String(label)) : formatDate(String(label))}
      </p>
    </div>
  )
}

export function AumTrendCard({
  range,
  onRangeChange,
  data,
  loading,
  error,
  onRetry,
}: AumTrendCardProps) {
  const [hidden, setHidden] = useState<Set<AumTrendSeries>>(() => new Set(['fixedDeposit']))

  const toggle = (key: AumTrendSeries) => {
    setHidden((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else if (next.size < series.length - 1) next.add(key)
      return next
    })
  }

  const control = (className?: string) => (
    <SegmentedControl
      value={range}
      onChange={onRangeChange}
      options={rangeOptions}
      className={className}
    />
  )

  return (
    <Card className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-text-primary">AUM Trend</h2>
        {control('hidden sm:inline-flex')}
      </div>
      {error ? (
        <ErrorState error={error} onRetry={onRetry} compact />
      ) : loading && !data ? (
        <Skeleton className="h-[260px]" />
      ) : (
        <div className="h-[260px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 12, right: 4, bottom: 0, left: 4 }}>
              <defs>
                {series.map((item) => (
                  <linearGradient key={item.key} id={item.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={item.color} stopOpacity={0.32} />
                    <stop offset="100%" stopColor={item.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={tickFormatter(range)}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={28}
                tick={{ fill: 'var(--color-text-placeholder)', fontSize: 10 }}
              />
              <YAxis yAxisId="mutualFunds" hide domain={['auto', 'auto']} />
              <YAxis yAxisId="fixedDeposit" hide orientation="right" domain={['auto', 'auto']} />
              <Tooltip
                cursor={{ stroke: 'var(--color-text-placeholder)', strokeDasharray: '4 4' }}
                content={<TrendTooltip range={range} />}
              />
              {series.map((item) => (
                <Area
                  key={item.key}
                  yAxisId={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.label}
                  stroke={item.color}
                  strokeWidth={2}
                  fill={`url(#${item.gradientId})`}
                  hide={hidden.has(item.key)}
                  activeDot={{
                    r: 4,
                    strokeWidth: 2,
                    stroke: 'var(--color-surface-raised)',
                    fill: item.color,
                  }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="flex flex-col items-center gap-4">
        <div
          role="group"
          aria-label="Chart series"
          className="inline-flex items-center gap-4 rounded-xl border border-border bg-surface-raised px-4 py-2 shadow-sm"
        >
          {series.map((item) => {
            const active = !hidden.has(item.key)
            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(item.key)}
                className={cn(
                  'flex items-center gap-2 rounded-md text-xs text-text-muted focus-ring transition-opacity',
                  !active && 'opacity-40',
                )}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                {item.label}
              </button>
            )
          })}
        </div>
        {control('sm:hidden')}
      </div>
    </Card>
  )
}
