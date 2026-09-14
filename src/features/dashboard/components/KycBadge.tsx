import { Badge, toneForStatus } from '@/components/ui/Badge'
import type { KycStatus } from '@/types'

export function KycBadge({ status }: { status: KycStatus }) {
  return (
    <Badge tone={toneForStatus(status)} dot className="capitalize">
      {status}
    </Badge>
  )
}
