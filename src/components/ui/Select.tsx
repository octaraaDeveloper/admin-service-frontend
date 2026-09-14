import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { controlClass, controlSizes, Field } from './Field'

export interface SelectOption<T extends string = string> {
  value: T
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

interface SelectProps<T extends string> {
  value: T | undefined
  onChange: (value: T) => void
  options: SelectOption<T>[]
  placeholder?: string
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  disabled?: boolean
  size?: keyof typeof controlSizes
  variant?: 'field' | 'pill'
  className?: string
  contentClassName?: string
  align?: 'start' | 'end'
}

export function Select<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = 'Select',
  label,
  hint,
  error,
  required,
  disabled,
  size = 'md',
  variant = 'field',
  className,
  contentClassName,
  align = 'start',
}: SelectProps<T>) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {(id, describedBy) => (
        <SelectPrimitive.Root
          value={value}
          onValueChange={(next) => onChange(next as T)}
          disabled={disabled}
        >
          <SelectPrimitive.Trigger
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              controlClass,
              controlSizes[size],
              'inline-flex items-center justify-between gap-2 text-left data-[placeholder]:text-text-placeholder',
              variant === 'pill' && 'w-auto text-sm font-medium text-text-secondary',
              className,
            )}
          >
            <span className="truncate">
              <SelectPrimitive.Value placeholder={placeholder} />
            </span>
            <SelectPrimitive.Icon>
              <ChevronDown className="size-4 shrink-0 text-text-muted" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={6}
              align={align}
              className={cn(
                'z-50 max-h-72 min-w-(--radix-select-trigger-width) overflow-hidden rounded-control border border-border bg-surface-raised p-1 shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                contentClassName,
              )}
            >
              <SelectPrimitive.Viewport className="max-h-72 overflow-y-auto">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className="relative flex cursor-pointer items-center rounded-lg py-2 pr-9 pl-3 text-base text-text-primary outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-surface-sunken data-[state=checked]:font-medium"
                  >
                    <div className="flex flex-col">
                      <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                      {option.description && (
                        <span className="text-xs text-text-muted">{option.description}</span>
                      )}
                    </div>
                    <SelectPrimitive.ItemIndicator className="absolute right-3 text-brand">
                      <Check className="size-4" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      )}
    </Field>
  )
}
