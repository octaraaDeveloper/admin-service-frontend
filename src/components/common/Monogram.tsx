import { cn } from '@/lib/utils'

const sizes = {
  xs: 'size-5',
  sm: 'size-7',
  md: 'size-9',
  lg: 'size-14',
}

type MonogramSize = keyof typeof sizes

const fontSizes: Record<MonogramSize, [string, string, string]> = {
  xs: ['text-[6px]', 'text-[7px]', 'text-[8px]'],
  sm: ['text-[8px]', 'text-[9px]', 'text-2xs'],
  md: ['text-[9px]', 'text-2xs', 'text-xs'],
  lg: ['text-xs', 'text-sm', 'text-md'],
}

interface MonogramProps {
  label: string
  color?: string
  size?: MonogramSize
  className?: string
}

/** Short AMC names fit whole ("HDFC", "SBI"); longer ones fall back to two letters ("Mirae" → "MI"). */
export function amcMonogram(shortName: string) {
  const compact = shortName.replaceAll(/[^A-Za-z]/g, '')
  return compact.length <= 4 ? compact.toUpperCase() : compact.slice(0, 2).toUpperCase()
}

export function Monogram({
  label,
  color = 'var(--color-border-strong)',
  size = 'md',
  className,
}: MonogramProps) {
  const font = fontSizes[size][label.length >= 4 ? 0 : label.length === 3 ? 1 : 2]
  return (
    <span
      aria-hidden
      style={{ backgroundColor: color }}
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
