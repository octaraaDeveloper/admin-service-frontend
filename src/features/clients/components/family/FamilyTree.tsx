import type { FamilyMember } from '@/types'
import { FamilyMemberCard } from './FamilyMemberCard'

const topRowOrder = ['Father', 'Mother', 'Self', 'Spouse'] as const
const childRelationships = new Set(['Son', 'Daughter'])

export function FamilyTree({ members }: { members: FamilyMember[] }) {
  const topRow = topRowOrder.flatMap((relationship) =>
    members.filter((member) => member.relationship === relationship),
  )
  const children = members.filter((member) => childRelationships.has(member.relationship))

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max flex-col items-center px-2 py-4">
        <div className="flex items-stretch gap-4">
          {topRow.map((member) => (
            <FamilyMemberCard key={member.id} member={member} />
          ))}
        </div>

        {children.length > 0 && (
          <>
            <div className="h-8 w-px bg-border" aria-hidden />
            <div className="relative inline-flex items-stretch gap-6 pt-6">
              {children.length > 1 && (
                <div className="absolute inset-x-20 top-0 h-px bg-border" aria-hidden />
              )}
              {children.map((member) => (
                <div key={member.id} className="relative">
                  <div className="absolute -top-6 left-1/2 h-6 w-px bg-border" aria-hidden />
                  <FamilyMemberCard member={member} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
