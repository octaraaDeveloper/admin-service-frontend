import { useMemo, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ReturnValue } from '@/components/common'
import { SegmentedControl } from '@/components/ui'
import { formatDate, formatDecimal } from '@/lib/format'
import type { NavPoint } from '@/types'

type Range = '1M' | '6M' | '1Y' | '3Y' | '5Y'

const rangeMonths: Record<Range, number> = { '1M': 1, '6M': 6, '1Y': 12, '3Y': 36, '5Y': 60 }
const rangeOptions = (Object.keys(rangeMonths) as Range[]).map((value) => ({
  value,
  label: value,
}))

const shortMonth = new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit' })
const shortDay = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' })

function sliceHistory(history: NavPoint[], range: Range) {
  if (history.length === 0) return []
  const end = new Date(history[history.length - 1].date)
  end.setMonth(end.getMonth() - rangeMonths[range])
  const cutoff = end.toISOString().slice(0, 10)
  const points = history.filter((point) => point.date >= cutoff)
  const step = Math.max(1, Math.ceil(points.length / 160))
  return points.filter((_, index) => index % step === 0 || index === points.length - 1)
}

interface TooltipPayload {
  payload?: NavPoint
}

function NavTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null
  return (
    <div className="rounded-control border border-border bg-surface-raised px-3 py-2 text-xs shadow-lg">
      <p className="text-text-muted">{formatDate(point.date)}</p>
      <p className="font-semibold text-text-primary">NAV ₹{formatDecimal(point.nav)}</p>
    </div>
  )
}

export function FundPerformanceChart({ history }: { history: NavPoint[] }) {
  const [range, setRange] = useState<Range>('1Y')
  const points = useMemo(() => sliceHistory(history, range), [history, range])
  const first = points[0]?.nav ?? 0
  const last = points[points.length - 1]?.nav ?? 0
  const change = first ? ((last - first) / first) * 100 : 0
  const formatTick = (value: string) =>
    (range === '1M' ? shortDay : shortMonth).format(new Date(value))

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-text-muted">
          {range} change <ReturnValue value={change} className="ml-1 text-sm" />
        </p>
        <SegmentedControl value={range} onChange={setRange} options={rangeOptions} />
      </div>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id="nav-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatTick}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            />
            <YAxis
              domain={['auto', 'auto']}
              width={44}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => formatDecimal(value)}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            />
            <Tooltip content={<NavTooltip />} cursor={{ stroke: 'var(--color-border-strong)' }} />
            <Area
              type="monotone"
              dataKey="nav"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              fill="url(#nav-fill)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--color-chart-1)', stroke: 'var(--color-surface)' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
