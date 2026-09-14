import type { ReactNode } from 'react'
import { controlClass, controlSizes, Field } from '@/components/ui'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { formatAmountInput, parseAmount } from './calculations'
import { quickAddAmounts } from './options'

interface AmountFieldProps {
  label: ReactNode
  value: number
  onChange: (value: number) => void
  minimum?: number
  hint?: ReactNode
  error?: ReactNode
  disabled?: boolean
  placeholder?: string
}

const MAX_AMOUNT = 999_999_999

export function AmountField({
  label,
  value,
  onChange,
  minimum,
  hint,
  error,
  disabled,
  placeholder = '0',
}: AmountFieldProps) {
  const resolvedHint =
    hint ?? (minimum !== undefined ? `Minimum investment ${formatCurrency(minimum)}` : undefined)

  return (
    <Field label={label} hint={resolvedHint} error={error}>
      {(id, describedBy) => (
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1 sm:max-w-[311px]">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-md font-medium text-text-secondary"
            >
              ₹
            </span>
            <input
              id={id}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder={placeholder}
              value={formatAmountInput(value)}
              disabled={disabled}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              onChange={(event) => onChange(Math.min(MAX_AMOUNT, parseAmount(event.target.value)))}
              className={cn(controlClass, controlSizes.lg, 'pl-8 text-md font-medium tabular-nums')}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex">
            {quickAddAmounts.map((step) => (
              <button
                key={step}
                type="button"
                disabled={disabled}
                onClick={() => onChange(Math.min(MAX_AMOUNT, value + step))}
                aria-label={`Add ${formatCurrency(step)}`}
                className="h-12 rounded-control border border-border bg-surface-raised px-3 text-sm font-medium whitespace-nowrap text-text-primary focus-ring transition-colors hover:border-border-strong hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-50"
              >
                + {formatCurrency(step)}
              </button>
            ))}
          </div>
        </div>
      )}
    </Field>
  )
}
