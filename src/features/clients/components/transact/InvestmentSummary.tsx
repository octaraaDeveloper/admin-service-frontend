import { Calculator } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface SummaryTile {
  label: ReactNode
  value: ReactNode
  hint?: ReactNode
}

export interface SummaryRow {
  label: ReactNode
  value: ReactNode
  emphasis?: boolean
}

const noRows: SummaryRow[] = []

interface InvestmentSummaryProps {
  title?: string
  tiles: SummaryTile[]
  rows?: SummaryRow[]
  note?: ReactNode
  className?: string
}

export function InvestmentSummary({
  title = 'Investment Summary',
  tiles,
  rows = noRows,
  note,
  className,
}: InvestmentSummaryProps) {
  return (
    <Card className={cn('p-4 md:p-6', className)}>
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-tint text-brand">
          <Calculator className="size-4" />
        </span>
        <h2 className="text-md font-semibold text-text-primary md:text-lg md:font-medium">
          {title}
        </h2>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
        {tiles.map((tile, index) => (
          <div key={index} className="min-w-0">
            <dt className="text-xs text-text-muted">{tile.label}</dt>
            <dd className="mt-1 truncate text-base font-semibold text-text-primary tabular-nums">
              {tile.value}
            </dd>
            {tile.hint && <p className="mt-0.5 truncate text-2xs text-text-muted">{tile.hint}</p>}
          </div>
        ))}
      </dl>
      {rows.length > 0 && (
        <dl className="mt-4 divide-y divide-border border-t border-dashed border-border">
          {rows.map((row, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between gap-4 py-2.5',
                row.emphasis && 'text-text-primary',
              )}
            >
              <dt className={cn('text-sm', row.emphasis ? 'font-medium' : 'text-text-muted')}>
                {row.label}
              </dt>
              <dd
                className={cn(
                  'text-right tabular-nums',
                  row.emphasis ? 'text-md font-semibold' : 'text-sm font-medium text-text-primary',
                )}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {note && <p className="mt-3 text-xs text-text-muted">{note}</p>}
    </Card>
  )
}
