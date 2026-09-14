import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DetailItem {
  label: string
  value: ReactNode
}

interface DetailListProps {
  items: DetailItem[]
  columns?: 1 | 2
  className?: string
}

export function DetailList({ items, columns = 2, className }: DetailListProps) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-3', columns === 2 && 'sm:grid-cols-2', className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
        >
          <dt className="shrink-0 text-sm text-text-muted">{item.label}</dt>
          <dd className="text-right text-sm font-medium text-text-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
