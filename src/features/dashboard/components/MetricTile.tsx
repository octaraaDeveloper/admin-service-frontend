import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

interface MetricTileProps {
  label: string
  value: string | undefined
  icon?: ReactNode
  to?: string
  size?: 'md' | 'lg'
  align?: 'start' | 'center'
  className?: string
}

export function MetricTile({
  label,
  value,
  icon,
  to,
  size = 'md',
  align,
  className,
}: MetricTileProps) {
  const centered = Boolean(icon) || align === 'center'
  const body = (
    <>
      {icon && (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-info-tint text-brand [&_svg]:size-6">
          {icon}
        </span>
      )}
      <span className={cn('flex min-w-0 flex-col gap-0.5', centered && 'items-center')}>
        <span className="text-xs text-text-muted">{label}</span>
        {value === undefined ? (
          <Skeleton className={cn('mt-1 h-5', size === 'lg' ? 'w-28' : 'w-20')} />
        ) : (
          <span
            className={cn(
              'truncate text-text-primary',
              size === 'lg' ? 'text-lg font-medium' : 'text-base font-semibold',
            )}
          >
            {value}
          </span>
        )}
      </span>
    </>
  )

  const classes = cn(
    'flex h-full min-h-[74px] rounded-lg bg-surface-sunken p-4 transition-colors',
    centered
      ? 'flex-col items-center justify-center gap-2.5 px-3 text-center'
      : 'flex-col justify-center',
    to && 'focus-ring hover:bg-brand-tint',
    className,
  )

  return to ? (
    <Link to={to} className={classes}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  )
}
