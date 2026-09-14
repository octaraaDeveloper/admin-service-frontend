import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'danger' | 'warning' | 'info' | 'accent'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-surface-sunken text-text-secondary',
  brand: 'bg-brand-tint text-brand',
  success: 'bg-success-tint text-success',
  danger: 'bg-danger-tint text-danger',
  warning: 'bg-warning-tint text-warning',
  info: 'bg-info-tint text-info',
  accent: 'bg-accent-tint text-accent',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  dot?: boolean
  outline?: boolean
}

export function Badge({
  tone = 'neutral',
  dot,
  outline,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        tones[tone],
        outline && 'border border-current/30',
        className,
      )}
      {...props}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  )
}

const statusTones: Record<string, BadgeTone> = {
  verified: 'success',
  active: 'success',
  success: 'success',
  completed: 'success',
  approved: 'success',
  low: 'success',
  pending: 'warning',
  processing: 'warning',
  'in progress': 'warning',
  medium: 'warning',
  expired: 'danger',
  failed: 'danger',
  rejected: 'danger',
  cancelled: 'danger',
  high: 'danger',
  inactive: 'neutral',
  paused: 'neutral',
  'not started': 'neutral',
  buy: 'success',
  sell: 'danger',
}

export function toneForStatus(status: string): BadgeTone {
  return statusTones[status.toLowerCase().replaceAll('_', ' ')] ?? 'neutral'
}

export function StatusBadge({
  status,
  dot,
  className,
  label,
}: {
  status: string
  dot?: boolean
  className?: string
  label?: string
}) {
  return (
    <Badge tone={toneForStatus(status)} dot={dot} className={cn('capitalize', className)}>
      {label ?? status.replaceAll('_', ' ')}
    </Badge>
  )
}
