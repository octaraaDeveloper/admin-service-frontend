import { Badge, type BadgeTone } from '@/components/ui'
import type { RiskLevel } from '@/types'

const tones: Record<RiskLevel, BadgeTone> = {
  Low: 'success',
  Medium: 'warning',
  High: 'danger',
  'Very High': 'danger',
}

export function RiskBadge({ risk, className }: { risk: RiskLevel; className?: string }) {
  return (
    <Badge tone={tones[risk]} outline className={className}>
      {risk}
    </Badge>
  )
}
