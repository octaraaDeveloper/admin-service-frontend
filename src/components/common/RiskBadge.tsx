import { Badge, type BadgeTone } from '@/components/ui/Badge'
import type { RiskLevel } from '@/types'

const tones: Record<RiskLevel, BadgeTone> = {
  Low: 'success',
  Medium: 'warning',
  High: 'danger',
  'Very High': 'danger',
}

interface RiskBadgeProps {
  risk: RiskLevel
  outline?: boolean
  className?: string
}

export function RiskBadge({ risk, outline = true, className }: RiskBadgeProps) {
  return (
    <Badge tone={tones[risk]} outline={outline} className={className}>
      {risk}
    </Badge>
  )
}
