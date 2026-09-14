import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useToastStore, type Toast } from '@/store/toast'
import { cn } from '@/lib/utils'

const icons: Record<Toast['tone'], typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const colors: Record<Toast['tone'], string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-info',
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:top-auto sm:right-4 sm:bottom-4 sm:items-end">
      {toasts.map((toast) => {
        const Icon = icons[toast.tone]
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-in items-start gap-3 rounded-control border border-border bg-surface-raised px-4 py-3 shadow-lg fade-in-0 slide-in-from-top-2 sm:slide-in-from-bottom-2"
          >
            <Icon className={cn('mt-0.5 size-5 shrink-0', colors[toast.tone])} />
            <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="rounded-md text-text-muted focus-ring hover:text-text-primary"
            >
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
