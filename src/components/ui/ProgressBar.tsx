import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  tone?: 'brand' | 'accent' | 'success' | 'warning' | 'danger'
  className?: string
  label?: string
}

const tones = {
  brand: 'bg-brand',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

export function ProgressBar({ value, tone = 'brand', className, label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-sunken', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width]', tones[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
