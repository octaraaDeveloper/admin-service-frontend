import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { formatPercent } from '@/lib/format'
import { Skeleton } from './Skeleton'

interface StatTileProps {
  label: ReactNode
  value: ReactNode
  change?: number
  changeLabel?: string
  icon?: ReactNode
  to?: string
  loading?: boolean
  className?: string
}

export function StatTile({
  label,
  value,
  change,
  changeLabel,
  icon,
  to,
  loading,
  className,
}: StatTileProps) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-text-muted">{label}</span>
        {icon && <span className="text-text-muted [&_svg]:size-4">{icon}</span>}
      </div>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-24" />
      ) : (
        <p className="mt-1.5 truncate text-xl font-semibold text-text-primary">{value}</p>
      )}
      {change !== undefined && !loading && (
        <p className={cn('mt-1 text-xs font-medium', change >= 0 ? 'text-success' : 'text-danger')}>
          {formatPercent(change, 1, true)}
          {changeLabel && <span className="ml-1 font-normal text-text-muted">{changeLabel}</span>}
        </p>
      )}
    </>
  )

  const classes = cn(
    'card block p-4 transition-colors',
    to && 'hover:border-brand/40 hover:bg-surface-sunken',
    className,
  )

  return to ? (
    <Link to={to} className={cn(classes, 'focus-ring')}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  )
}
