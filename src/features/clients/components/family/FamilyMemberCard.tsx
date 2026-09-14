import { Link } from 'react-router-dom'
import { Avatar, Badge, type BadgeTone } from '@/components/ui'
import { formatCompactCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { FamilyMember, FamilyRelationship } from '@/types'

export const relationshipTone: Record<FamilyRelationship, BadgeTone> = {
  Self: 'brand',
  Father: 'info',
  Mother: 'accent',
  Spouse: 'info',
  Son: 'neutral',
  Daughter: 'accent',
}

const avatarClass: Record<FamilyRelationship, string> = {
  Self: 'bg-brand [&>span]:text-brand-foreground',
  Father: 'bg-info-tint [&>span]:text-info',
  Mother: 'bg-accent-tint [&>span]:text-accent',
  Spouse: 'bg-info-tint [&>span]:text-info',
  Son: 'bg-surface-sunken [&>span]:text-text-secondary',
  Daughter: 'bg-accent-tint [&>span]:text-accent',
}

export function FamilyAvatar({
  member,
  size = 'md',
  className,
}: {
  member: FamilyMember
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <Avatar
      name={member.name}
      size={size}
      className={cn(avatarClass[member.relationship], className)}
    />
  )
}

export function FamilyMemberCard({ member }: { member: FamilyMember }) {
  const primary = member.relationship === 'Self'
  return (
    <div
      className={cn(
        'flex w-40 flex-col items-center gap-2 rounded-card border p-4 text-center shadow-sm',
        primary ? 'border-brand/30 bg-brand-tint' : 'border-border bg-surface-raised',
      )}
    >
      <FamilyAvatar member={member} size="lg" />
      <div className="w-full min-w-0">
        <p className="truncate text-sm font-semibold text-text-primary">{member.name}</p>
        <p className="text-xs text-text-muted tabular-nums">
          AUM {formatCompactCurrency(member.aum)}
        </p>
      </div>
      <Badge tone={relationshipTone[member.relationship]}>
        {primary ? 'Primary' : member.relationship}
      </Badge>
      {member.linkedClientId && !primary && (
        <Link
          to={`/clients/${member.linkedClientId}`}
          className="text-xs font-medium text-brand hover:underline"
        >
          View profile
        </Link>
      )}
    </div>
  )
}
