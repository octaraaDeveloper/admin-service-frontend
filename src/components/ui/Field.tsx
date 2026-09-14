import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FieldProps {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  className?: string
  children: (id: string, describedBy: string | undefined) => ReactNode
}

export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-text-secondary">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      {children(id, message ? messageId : undefined)}
      {message && (
        <p id={messageId} className={cn('text-xs', error ? 'text-danger' : 'text-text-muted')}>
          {message}
        </p>
      )}
    </div>
  )
}

export const controlClass =
  'focus-ring w-full rounded-control border border-border bg-surface-raised text-base text-text-primary placeholder:text-text-placeholder transition-colors disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-70 aria-invalid:border-danger'

export const controlSizes = {
  md: 'h-10 px-3.5',
  lg: 'h-12 px-4',
}
