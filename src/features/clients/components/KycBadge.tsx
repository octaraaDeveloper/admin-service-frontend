import { Badge, toneForStatus, type BadgeTone } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { KycStatus } from '@/types'

const toneText: Record<BadgeTone, string> = {
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  neutral: 'text-text-muted',
  brand: 'text-brand',
  info: 'text-info',
  accent: 'text-accent',
}

export function KycBadge({ status, className }: { status: KycStatus; className?: string }) {
  return (
    <Badge tone={toneForStatus(status)} dot className={cn('capitalize', className)}>
      {status}
    </Badge>
  )
}

export function KycStatusText({
  status,
  prefix,
  className,
}: {
  status: KycStatus
  prefix?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-semibold capitalize',
        toneText[toneForStatus(status)],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {prefix ? `KYC ${status}` : status}
    </span>
  )
}
