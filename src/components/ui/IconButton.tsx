import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  size?: 'sm' | 'md'
  variant?: 'ghost' | 'outline' | 'danger'
}

const variants = {
  ghost: 'text-text-secondary hover:bg-surface-sunken hover:text-text-primary',
  outline: 'border border-border bg-surface-raised text-text-secondary hover:bg-surface-sunken',
  danger: 'border border-danger/40 bg-danger-tint text-danger hover:bg-danger/15',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, size = 'md', variant = 'ghost', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-control focus-ring transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[18px]',
        size === 'sm' ? 'size-8' : 'size-10',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
})
