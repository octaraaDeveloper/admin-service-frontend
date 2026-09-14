import { cn } from '@/lib/utils'
import { formatPercent } from '@/lib/format'

interface ReturnValueProps {
  value: number
  digits?: number
  className?: string
}

export function returnTone(value: number) {
  if (value > 0) return 'text-success'
  if (value < 0) return 'text-danger'
  return 'text-text-secondary'
}

export function ReturnValue({ value, digits = 2, className }: ReturnValueProps) {
  return (
    <span className={cn('font-medium tabular-nums', returnTone(value), className)}>
      {formatPercent(value, digits, true)}
    </span>
  )
}
