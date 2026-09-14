import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

const sizes = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: keyof typeof sizes
  hideClose?: boolean
  className?: string
  bodyClassName?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  hideClose,
  className,
  bodyClassName,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-surface-overlay backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          ref={contentRef}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            contentRef.current?.focus()
          }}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] w-full flex-col rounded-t-2xl border border-border bg-surface-raised shadow-2xl outline-none',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-8 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-8',
            'sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[88dvh] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95',
            sizes[size],
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-md font-semibold text-text-primary">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="mt-0.5 text-sm text-text-muted">
                  {description}
                </DialogPrimitive.Description>
              ) : (
                <DialogPrimitive.Description className="sr-only">
                  {title}
                </DialogPrimitive.Description>
              )}
            </div>
            {!hideClose && (
              <DialogPrimitive.Close
                aria-label="Close"
                className="-m-1 rounded-md p-1 text-text-muted focus-ring transition-colors hover:bg-surface-sunken hover:text-text-primary"
              >
                <X className="size-5" />
              </DialogPrimitive.Close>
            )}
          </div>
          <div
            className={cn('min-h-0 flex-1 overflow-y-auto px-5 py-4 safe-bottom', bodyClassName)}
          >
            {children}
          </div>
          {footer && (
            <div className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 safe-bottom sm:flex-row sm:justify-end">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: ReactNode
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'primary'
  loading?: boolean
  icon?: ReactNode
  children?: ReactNode
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  loading,
  icon,
  children,
}: ConfirmModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-surface-overlay backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-x-4 top-1/2 z-50 mx-auto w-auto max-w-sm -translate-y-1/2 rounded-card border border-border bg-surface-raised p-6 text-center shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2">
          {icon && (
            <div
              className={cn(
                'mx-auto mb-4 flex size-12 items-center justify-center rounded-full [&_svg]:size-6',
                tone === 'danger' ? 'bg-danger-tint text-danger' : 'bg-brand-tint text-brand',
              )}
            >
              {icon}
            </div>
          )}
          <DialogPrimitive.Title className="text-lg font-semibold text-text-primary">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description
            className={cn('mt-2 text-sm text-text-muted', !description && 'sr-only')}
          >
            {description ?? title}
          </DialogPrimitive.Description>
          {children}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button
              variant={tone === 'danger' ? 'danger' : 'primary'}
              onClick={onConfirm}
              loading={loading}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
