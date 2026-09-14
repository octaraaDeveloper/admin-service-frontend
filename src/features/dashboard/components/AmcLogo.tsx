import { cn } from '@/lib/utils'

interface AmcLogoProps {
  shortName: string
  color: string
  className?: string
}

export function AmcLogo({ shortName, color, className }: AmcLogoProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full text-2xs font-semibold text-white',
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {shortName.slice(0, 2).toUpperCase()}
    </span>
  )
}
