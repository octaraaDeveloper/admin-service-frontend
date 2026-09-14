import { useId } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCompactCurrency, formatCurrency, formatDate } from '@/lib/format'
import type { HoldingPoint } from '@/types'

const monthYear = new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit' })

interface TooltipPayload {
  payload?: HoldingPoint
}

function ValueTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null
  return (
    <div className="rounded-control border border-border bg-surface-raised px-3 py-2 text-xs shadow-lg">
      <p className="text-text-muted">{formatDate(point.date)}</p>
      <p className="font-semibold text-text-primary">{formatCurrency(point.value)}</p>
    </div>
  )
}

function compactTick(value: number) {
  return formatCompactCurrency(value).replace('₹', '').replace(' ', '')
}

function niceTicks(series: HoldingPoint[]) {
  const max = Math.max(0, ...series.map((point) => point.value))
  if (max === 0) return [0]
  const target = max / 3
  const magnitude = 10 ** Math.floor(Math.log10(target))
  const multipliers = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]
  const step = (multipliers.find((item) => item * magnitude >= target) ?? 10) * magnitude
  return [0, step, step * 2, step * 3].map((value) => Math.round(value))
}

export function HoldingChart({ series }: { series: HoldingPoint[] }) {
  const gradientId = `holding-fill-${useId().replaceAll(/[^a-zA-Z0-9]/g, '')}`
  const lastDate = series[series.length - 1]?.date
  const ticks = niceTicks(series)
  const formatTick = (value: string) =>
    value === lastDate ? 'Today' : monthYear.format(new Date(value)).replace(' ', " '")

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatTick}
            tickLine={false}
            axisLine={false}
            minTickGap={36}
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
          />
          <YAxis
            domain={[0, ticks[ticks.length - 1]]}
            ticks={ticks}
            width={34}
            tickLine={false}
            axisLine={false}
            tickFormatter={compactTick}
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
          />
          <Tooltip content={<ValueTooltip />} cursor={{ stroke: 'var(--color-border-strong)' }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-chart-1)"
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: 'var(--color-chart-1)', stroke: 'var(--color-surface)' }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
