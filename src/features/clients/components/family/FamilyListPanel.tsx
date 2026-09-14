import { Trash2 } from 'lucide-react'
import { Card, CardBody, CardHeader, IconButton } from '@/components/ui'
import { formatCompactCurrency } from '@/lib/format'
import type { FamilyMember } from '@/types'
import { FamilyAvatar } from './FamilyMemberCard'

interface FamilyListPanelProps {
  members: FamilyMember[]
  onRemove: (member: FamilyMember) => void
}

export function FamilyListPanel({ members, onRemove }: FamilyListPanelProps) {
  const totalAum = members.reduce((sum, member) => sum + member.aum, 0)
  return (
    <Card className="self-start">
      <CardHeader
        title="My Family"
        description={`${members.length} linked · Family AUM ${formatCompactCurrency(totalAum)}`}
      />
      <CardBody className="p-0">
        <ul className="divide-y divide-border">
          {members.map((member) => (
            <li key={member.id} className="flex items-center gap-3 px-4 py-3">
              <FamilyAvatar member={member} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{member.name}</p>
                <p className="text-xs text-text-muted">
                  {member.relationship === 'Self' ? 'Primary account' : member.relationship} ·{' '}
                  {formatCompactCurrency(member.aum)}
                </p>
              </div>
              {member.relationship !== 'Self' && (
                <IconButton
                  label={`Remove ${member.name}`}
                  size="sm"
                  variant="ghost"
                  className="text-danger hover:bg-danger-tint hover:text-danger"
                  onClick={() => onRemove(member)}
                >
                  <Trash2 className="size-4" />
                </IconButton>
              )}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  )
}
