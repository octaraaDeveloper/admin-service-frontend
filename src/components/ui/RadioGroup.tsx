import * as RadioPrimitive from '@radix-ui/react-radio-group'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Field } from './Field'

interface RadioOption<T extends string> {
  value: T
  label: ReactNode
  description?: ReactNode
}

interface RadioGroupProps<T extends string> {
  value: T | undefined
  onChange: (value: T) => void
  options: RadioOption<T>[]
  label?: ReactNode
  error?: ReactNode
  variant?: 'list' | 'cards'
  className?: string
}

export function RadioGroup<T extends string>({
  value,
  onChange,
  options,
  label,
  error,
  variant = 'list',
  className,
}: RadioGroupProps<T>) {
  return (
    <Field label={label} error={error}>
      {(id) => (
        <RadioPrimitive.Root
          id={id}
          value={value}
          onValueChange={(next) => onChange(next as T)}
          className={cn(
            variant === 'cards' ? 'grid gap-3 sm:grid-cols-2' : 'flex flex-wrap gap-x-6 gap-y-3',
            className,
          )}
        >
          {options.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center gap-2.5 text-base text-text-primary',
                variant === 'cards' &&
                  'rounded-control border border-border bg-surface-raised p-3.5 transition-colors has-data-[state=checked]:border-brand has-data-[state=checked]:bg-brand-tint',
              )}
            >
              <RadioPrimitive.Item
                value={option.value}
                className="flex size-[18px] shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-raised focus-ring data-[state=checked]:border-brand"
              >
                <RadioPrimitive.Indicator className="size-2.5 rounded-full bg-brand" />
              </RadioPrimitive.Item>
              <span className="flex flex-col">
                <span>{option.label}</span>
                {option.description && (
                  <span className="text-xs text-text-muted">{option.description}</span>
                )}
              </span>
            </label>
          ))}
        </RadioPrimitive.Root>
      )}
    </Field>
  )
}
