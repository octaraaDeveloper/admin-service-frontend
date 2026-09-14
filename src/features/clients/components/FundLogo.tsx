import { formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'

interface FundLogoProps {
  shortName: string
  color: string
  size?: 'sm' | 'md'
  className?: string
}

export function FundLogo({ shortName, color, size = 'md', className }: FundLogoProps) {
  return (
    <span
      aria-hidden
      style={{ backgroundColor: color }}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-bold text-white uppercase',
        size === 'sm' ? 'size-7 text-[9px]' : 'size-9 text-2xs',
        className,
      )}
    >
      {shortName.slice(0, 3)}
    </span>
  )
}

export function ReturnText({
  value,
  digits = 1,
  className,
}: {
  value: number
  digits?: number
  className?: string
}) {
  return (
    <span className={cn('font-medium', value >= 0 ? 'text-success' : 'text-danger', className)}>
      {formatPercent(value, digits, true)}
    </span>
  )
}
