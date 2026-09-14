import { AlertCircle } from 'lucide-react'
import type { ApiError } from '@/api/client'
import { cn } from '@/lib/utils'

export function FormError({
  error,
  className,
}: {
  error: ApiError | string | null | undefined
  className?: string
}) {
  if (!error) return null
  const message = typeof error === 'string' ? error : error.message
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-control border border-danger/30 bg-danger-tint px-3.5 py-2.5 text-sm text-danger',
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
