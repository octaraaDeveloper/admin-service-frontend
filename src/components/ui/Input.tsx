import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { controlClass, controlSizes, Field } from './Field'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  size?: keyof typeof controlSizes
  leftIcon?: ReactNode
  rightSlot?: ReactNode
  wrapperClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    size = 'md',
    leftIcon,
    rightSlot,
    className,
    wrapperClassName,
    type = 'text',
    required,
    ...props
  },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword && showPassword ? 'text' : type
  const trailing = isPassword ? (
    <button
      type="button"
      onClick={() => setShowPassword((value) => !value)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      className="rounded-md text-text-muted focus-ring hover:text-text-primary"
    >
      {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
    </button>
  ) : (
    rightSlot
  )

  return (
    <Field label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
      {(id, describedBy) => (
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-text-muted [&_svg]:size-[18px]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type={resolvedType}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              controlClass,
              controlSizes[size],
              leftIcon && 'pl-11',
              trailing && 'pr-11',
              className,
            )}
            {...props}
          />
          {trailing && (
            <span className="absolute inset-y-0 right-3.5 flex items-center">{trailing}</span>
          )}
        </div>
      )}
    </Field>
  )
})
