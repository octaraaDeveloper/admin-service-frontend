import { cn } from '@/lib/utils'
import type { Amc } from '@/types'

const sizes = {
  sm: 'size-6',
  md: 'size-9',
  lg: 'size-14',
}

const fontSizes = {
  sm: ['text-[7px]', 'text-[8px]', 'text-2xs'],
  md: ['text-[9px]', 'text-2xs', 'text-xs'],
  lg: ['text-xs', 'text-sm', 'text-md'],
}

interface AmcLogoProps {
  amc: Amc
  size?: keyof typeof sizes
  className?: string
}

function monogram(amc: Amc) {
  const compact = amc.shortName.replaceAll(/[^A-Za-z]/g, '')
  return compact.length <= 4 ? compact.toUpperCase() : compact.slice(0, 2).toUpperCase()
}

export function AmcLogo({ amc, size = 'md', className }: AmcLogoProps) {
  const label = monogram(amc)
  const font = fontSizes[size][label.length >= 4 ? 0 : label.length === 3 ? 1 : 2]
  return (
    <span
      aria-hidden
      style={{ backgroundColor: amc.logoColor }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide text-white select-none',
        sizes[size],
        font,
        className,
      )}
    >
      {label}
    </span>
  )
}
