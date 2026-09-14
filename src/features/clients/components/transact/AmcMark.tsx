import { cn } from '@/lib/utils'
import type { Amc } from '@/types'

const sizes = {
  xs: 'size-5 text-[7px]',
  sm: 'size-10 text-2xs',
  md: 'size-12 text-xs',
}

interface AmcMarkProps {
  amc: Amc | undefined
  size?: keyof typeof sizes
  className?: string
}

function monogram(amc: Amc) {
  const compact = amc.shortName.replaceAll(/[^A-Za-z]/g, '')
  return compact.length <= 4 ? compact.toUpperCase() : compact.slice(0, 2).toUpperCase()
}

export function AmcMark({ amc, size = 'sm', className }: AmcMarkProps) {
  return (
    <span
      aria-hidden
      style={{ backgroundColor: amc?.logoColor ?? 'var(--color-border-strong)' }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide text-white select-none',
        sizes[size],
        className,
      )}
    >
      {amc && size !== 'xs' ? monogram(amc) : null}
    </span>
  )
}
