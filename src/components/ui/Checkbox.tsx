import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean | 'indeterminate'
  onChange: (checked: boolean) => void
  label?: ReactNode
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  className,
  ...aria
}: CheckboxProps) {
  const box = (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={(next) => onChange(next === true)}
      disabled={disabled}
      className="relative flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border border-border-strong bg-surface-raised text-brand-foreground focus-ring transition-colors before:absolute before:-inset-3 before:content-[''] disabled:opacity-50 data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=indeterminate]:border-brand data-[state=indeterminate]:bg-brand"
      {...aria}
    >
      <CheckboxPrimitive.Indicator>
        {checked === 'indeterminate' ? (
          <Minus className="size-3" strokeWidth={3} />
        ) : (
          <Check className="size-3" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!label) return <span className={className}>{box}</span>

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2.5 text-base text-text-primary',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      {box}
      {label}
    </label>
  )
}
