import { ChevronDown, Info, Trash2, User } from 'lucide-react'
import { Badge, Button, DatePicker, Input, Select } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Nominee, OnboardingFormOptions } from '@/types'
import { nomineeField, type FieldErrors } from '../onboardingState'
import { isMinor } from '../validation'

interface NomineeCardProps {
  nominee: Nominee
  index: number
  expanded: boolean
  onToggle: () => void
  onChange: (patch: Partial<Nominee>) => void
  onRemove?: () => void
  errors: FieldErrors
  options: OnboardingFormOptions
}

function toIsoDate(date: Date | undefined) {
  if (!date) return undefined
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function NomineeCard({
  nominee,
  index,
  expanded,
  onToggle,
  onChange,
  onRemove,
  errors,
  options,
}: NomineeCardProps) {
  const error = (field: keyof Nominee) => errors[nomineeField(nominee.id, field)]
  const hasError = (Object.keys(errors) as string[]).some((key) => key.startsWith(`${nominee.id}.`))
  const minor = isMinor(nominee.dateOfBirth)
  const bodyId = `${nominee.id}-fields`

  return (
    <div className={cn('overflow-hidden card', hasError && !expanded && 'border-danger')}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={bodyId}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left focus-ring"
      >
        <span className="text-base font-medium text-text-primary">Nominee {index + 1}</span>
        {nominee.name.trim() && (
          <span className="hidden truncate text-sm text-text-muted sm:inline">
            · {nominee.name}
          </span>
        )}
        {nominee.allocation > 0 && <Badge tone="brand">{nominee.allocation}%</Badge>}
        <ChevronDown
          className={cn(
            'ml-auto size-5 shrink-0 text-text-muted transition-transform',
            expanded && 'rotate-180',
          )}
        />
      </button>
      {expanded && (
        <div id={bodyId} className="flex flex-col gap-4 border-t border-border px-4 pt-4 pb-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              leftIcon={<User />}
              value={nominee.name}
              onChange={(event) => onChange({ name: event.target.value })}
              placeholder="Enter nominee name"
              error={error('name')}
            />
            <DatePicker
              label="Date of Birth"
              value={nominee.dateOfBirth ? new Date(nominee.dateOfBirth) : undefined}
              onChange={(date) => onChange({ dateOfBirth: toIsoDate(date) })}
              maxDate={new Date()}
              placeholder="DD/MM/YYYY"
              error={error('dateOfBirth')}
            />
            <Select
              label="Relationship"
              value={nominee.relationship}
              onChange={(relationship) => onChange({ relationship })}
              options={options.relationships}
              placeholder="Select relationship"
              error={error('relationship')}
            />
            <Input
              label="Allocation Percentage"
              inputMode="numeric"
              value={nominee.allocation === 0 ? '' : String(nominee.allocation)}
              onChange={(event) =>
                onChange({
                  allocation: Math.min(100, Number(event.target.value.replace(/\D/g, ''))),
                })
              }
              placeholder="0"
              rightSlot={<span className="text-sm text-text-muted">%</span>}
              error={error('allocation')}
            />
          </div>
          {minor && (
            <div className="flex flex-col gap-4 rounded-control bg-surface-sunken p-4">
              <p className="flex items-start gap-2 text-xs text-text-secondary">
                <Info className="mt-0.5 size-3.5 shrink-0 text-info" />
                Nominee is a minor. Add a guardian who will act on their behalf.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Guardian Name"
                  leftIcon={<User />}
                  value={nominee.guardianName}
                  onChange={(event) => onChange({ guardianName: event.target.value })}
                  placeholder="Enter guardian name"
                  error={error('guardianName')}
                />
                <Select
                  label="Guardian Relationship"
                  value={nominee.guardianRelationship}
                  onChange={(guardianRelationship) => onChange({ guardianRelationship })}
                  options={options.relationships}
                  placeholder="Select relationship"
                  error={error('guardianRelationship')}
                />
              </div>
            </div>
          )}
          {onRemove && (
            <div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Trash2 className="size-4" />}
                onClick={onRemove}
                className="h-9 border-danger/40 text-danger hover:bg-danger-tint"
              >
                Delete nominee
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
