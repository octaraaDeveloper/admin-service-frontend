import { formatPercent } from '@/lib/format'
import type { AllocationSlice } from '@/types'

const colors = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
]

export function AllocationBar({ allocation }: { allocation: AllocationSlice[] }) {
  return (
    <div className="space-y-3">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-sunken">
        {allocation.map((slice, index) => (
          <span
            key={slice.label}
            style={{ width: `${slice.value}%`, backgroundColor: colors[index % colors.length] }}
            aria-hidden
          />
        ))}
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {allocation.map((slice, index) => (
          <li key={slice.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-text-secondary">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
                aria-hidden
              />
              {slice.label}
            </span>
            <span className="font-medium text-text-primary tabular-nums">
              {formatPercent(slice.value, 1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
