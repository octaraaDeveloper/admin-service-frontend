import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FundSortKey } from '@/types'

interface SortableHeaderProps {
  label: string
  sortKey: FundSortKey
  activeKey: FundSortKey
  order: 'asc' | 'desc'
  onSort: (key: FundSortKey) => void
  align?: 'left' | 'right' | 'center'
}

export function SortableHeader({
  label,
  sortKey,
  activeKey,
  order,
  onSort,
  align = 'right',
}: SortableHeaderProps) {
  const active = sortKey === activeKey
  const Icon = active ? (order === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      aria-pressed={active}
      aria-label={
        active
          ? `Sort by ${label}, ${order === 'asc' ? 'ascending' : 'descending'}`
          : `Sort by ${label}`
      }
      className={cn(
        'inline-flex items-center gap-1 rounded-sm font-medium focus-ring transition-colors hover:text-text-primary',
        align === 'right' && 'flex-row-reverse',
        active ? 'text-brand' : 'text-text-secondary',
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </button>
  )
}
