import type { Bank } from '@/types'
import { cn } from '@/lib/utils'

export function BankLogo({ bank, className }: { bank: Bank; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ backgroundColor: bank.color }}
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold tracking-tight text-white',
        className,
      )}
    >
      {bank.initials}
    </span>
  )
}
