import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { ApiError } from '@/api/client'
import { ErrorState } from '@/components/common/states'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCompactCurrency } from '@/lib/format'
import type { AllocationKey, AssetAllocation } from '@/types'

interface AssetAllocationCardProps {
  allocation: AssetAllocation | undefined
  loading: boolean
  error: ApiError | null
  onRetry: () => void
}

const sliceColors: Record<AllocationKey, string> = {
  equity: 'var(--color-chart-1)',
  debt: 'var(--color-chart-2)',
  'fixed-deposits': 'var(--color-chart-3)',
  'gold-others': 'var(--color-chart-4)',
}

interface SliceEntry {
  name?: string | number
  value?: string | number | readonly (string | number)[]
  payload?: { key?: AllocationKey; percent?: number }
}

function SliceTooltip({ active, payload }: { active?: boolean; payload?: readonly SliceEntry[] }) {
  const entry = payload?.[0]
  if (!active || !entry) return null
  return (
    <div className="rounded-xl bg-text-primary px-3.5 py-2.5 text-surface shadow-lg">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span
          className="size-2 rounded-full"
          style={{
            backgroundColor: entry.payload?.key ? sliceColors[entry.payload.key] : undefined,
          }}
          aria-hidden
        />
        {entry.name}
      </p>
      <p className="mt-1 text-xs text-text-placeholder">
        {formatCompactCurrency(Number(entry.value))} · {entry.payload?.percent}%
      </p>
    </div>
  )
}

export function AssetAllocationCard({
  allocation,
  loading,
  error,
  onRetry,
}: AssetAllocationCardProps) {
  return (
    <Card className="flex flex-col p-4 md:p-5">
      <div>
        <h2 className="text-md font-medium text-text-primary">Asset allocation</h2>
        <p className="text-xs text-text-placeholder">By instrument class</p>
      </div>
      {error ? (
        <ErrorState error={error} onRetry={onRetry} compact />
      ) : loading && !allocation ? (
        <div className="flex flex-1 flex-col items-center gap-5 pt-5">
          <Skeleton className="size-[210px] rounded-full" />
          <div className="w-full space-y-2.5">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-4" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="relative mx-auto mt-3 h-[220px] w-full max-w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<SliceTooltip />} />
                <Pie
                  data={allocation?.slices ?? []}
                  dataKey="value"
                  nameKey="label"
                  innerRadius="72%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="var(--color-surface-raised)"
                  strokeWidth={2}
                  paddingAngle={1}
                >
                  {allocation?.slices.map((slice) => (
                    <Cell key={slice.key} fill={sliceColors[slice.key]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xs text-text-placeholder">Total</span>
              <span className="text-xl font-semibold text-text-primary">
                {allocation ? formatCompactCurrency(allocation.total) : '—'}
              </span>
            </div>
          </div>
          <ul className="mt-4 space-y-2.5">
            {allocation?.slices.map((slice) => (
              <li key={slice.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2.5 text-text-secondary">
                  <span
                    className="size-[9px] shrink-0 rounded-[3px]"
                    style={{ backgroundColor: sliceColors[slice.key] }}
                    aria-hidden
                  />
                  {slice.label}
                </span>
                <span className="font-semibold text-text-primary">{slice.percent}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}
