import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button, ProgressBar } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Nominee, OnboardingFormOptions } from '@/types'
import { MAX_NOMINEES, type FieldErrors } from '../onboardingState'
import { totalAllocation } from '../validation'
import { NomineeCard } from './NomineeCard'

interface NomineeDetailsStepProps {
  nominees: Nominee[]
  onChange: (id: string, patch: Partial<Nominee>) => void
  onAdd: () => void
  onRemove: (id: string) => void
  errors: FieldErrors
  errorsVersion: number
  options: OnboardingFormOptions
}

export function NomineeDetailsStep({
  nominees,
  onChange,
  onAdd,
  onRemove,
  errors,
  errorsVersion,
  options,
}: NomineeDetailsStepProps) {
  const [expandedIndex, setExpandedIndex] = useState(0)
  const [seenVersion, setSeenVersion] = useState(errorsVersion)
  if (errorsVersion !== seenVersion) {
    // Validation just ran: make sure the first nominee with errors is visible.
    setSeenVersion(errorsVersion)
    const firstInvalid = nominees.findIndex((nominee) =>
      Object.keys(errors).some((key) => key.startsWith(`${nominee.id}.`)),
    )
    if (firstInvalid !== -1) setExpandedIndex(firstInvalid)
  }
  const allocated = totalAllocation(nominees)
  const remaining = 100 - allocated
  const over = allocated > 100
  const full = nominees.length >= MAX_NOMINEES

  return (
    <div className="flex flex-col gap-4">
      {nominees.map((nominee, index) => (
        <NomineeCard
          key={nominee.id}
          nominee={nominee}
          index={index}
          expanded={expandedIndex === index}
          onToggle={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
          onChange={(patch) => onChange(nominee.id, patch)}
          onRemove={
            nominees.length > 1
              ? () => {
                  onRemove(nominee.id)
                  setExpandedIndex(Math.max(0, Math.min(index, nominees.length - 2)))
                }
              : undefined
          }
          errors={errors}
          options={options}
        />
      ))}

      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          leftIcon={<Plus className="size-4" />}
          disabled={full}
          onClick={() => {
            onAdd()
            setExpandedIndex(nominees.length)
          }}
          className="w-full border-dashed border-brand/40 text-brand hover:bg-brand-tint sm:w-auto sm:self-start"
        >
          Add another nominee
          <span className="font-normal text-text-muted">
            ({nominees.length}/{MAX_NOMINEES})
          </span>
        </Button>
        <p
          className={cn(
            'rounded-control border px-4 py-2.5 text-xs',
            full
              ? 'border-warning/30 bg-warning-tint text-text-secondary'
              : 'border-border bg-surface-sunken text-text-muted',
          )}
        >
          You can only add up to {MAX_NOMINEES} nominees
        </p>
      </div>

      <div className="rounded-card border border-border bg-surface-sunken p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="text-base font-medium text-text-primary">Allocation Summary</p>
          <p className={cn('text-sm font-medium', over ? 'text-danger' : 'text-brand')}>
            Allocated {allocated}% · Remaining {remaining}%
          </p>
        </div>
        <ProgressBar
          value={allocated}
          tone={over ? 'danger' : allocated === 100 ? 'success' : 'brand'}
          label="Nominee allocation"
          className="mt-3"
        />
        {errors.allocation && <p className="mt-2 text-xs text-danger">{errors.allocation}</p>}
      </div>
    </div>
  )
}
