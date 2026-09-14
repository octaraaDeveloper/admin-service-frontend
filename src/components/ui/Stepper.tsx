import { Check } from 'lucide-react'
import { Fragment } from 'react'
import { cn } from '@/lib/utils'

interface StepperProps {
  steps: string[]
  current: number
  className?: string
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const done = index < current
        const active = index === current
        return (
          <Fragment key={step}>
            {index > 0 && (
              <li aria-hidden className={cn('h-px flex-1', done ? 'bg-brand' : 'bg-border')} />
            )}
            <li className="flex items-center gap-2">
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  done && 'bg-brand text-brand-foreground',
                  active && 'border-2 border-brand text-brand',
                  !done && !active && 'border border-border text-text-muted',
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
              </span>
              <span
                className={cn(
                  'hidden text-sm font-medium sm:block',
                  active ? 'text-text-primary' : 'text-text-muted',
                )}
              >
                {step}
              </span>
            </li>
          </Fragment>
        )
      })}
    </ol>
  )
}
