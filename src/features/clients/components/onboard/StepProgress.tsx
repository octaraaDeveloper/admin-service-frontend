import { cn } from '@/lib/utils'

interface StepProgressProps {
  total: number
  current: number
  label: string
}

export function StepProgress({ total, current, label }: StepProgressProps) {
  return (
    <div className="space-y-4">
      <div
        className="flex gap-2"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current + 1}
      >
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              index <= current ? 'bg-brand' : 'bg-surface-sunken',
            )}
          />
        ))}
      </div>
      <p className="text-sm text-text-muted">
        Step {current + 1} of {total} · {label}
      </p>
    </div>
  )
}
