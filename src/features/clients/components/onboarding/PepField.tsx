import type { ReactNode } from 'react'
import { RadioGroup } from '@/components/ui'
import type { OnboardingOption, YesNo } from '@/types'

interface PepFieldProps {
  value: YesNo | undefined
  onChange: (value: YesNo) => void
  options: OnboardingOption<YesNo>[]
  error?: ReactNode
}

export function PepField({ value, onChange, options, error }: PepFieldProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4">
      <div>
        <p className="text-xs font-medium text-text-secondary">Are you Politically Exposed?</p>
        <p className="mt-1 text-xs text-text-muted">
          A Politically Exposed Person (PEP) is someone who holds or has held a prominent public
          position.
        </p>
      </div>
      <RadioGroup value={value} onChange={onChange} options={options} error={error} />
    </div>
  )
}
