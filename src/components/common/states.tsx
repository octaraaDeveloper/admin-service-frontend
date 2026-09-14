import { AlertTriangle, Inbox, SearchX, WifiOff } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ApiError } from '@/api/client'
import { Button, LinkButton } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface StateProps {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  compact?: boolean
  className?: string
}

export function StateBlock({ icon, title, description, action, compact, className }: StateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'px-4 py-12' : 'min-h-[50vh] px-4 py-16',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-surface-sunken text-text-muted [&_svg]:size-6">
          {icon}
        </div>
      )}
      <h3 className="text-md font-semibold text-text-primary">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-text-muted">{description}</p>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}

export function EmptyState(props: Omit<StateProps, 'icon'> & { icon?: ReactNode }) {
  return <StateBlock icon={<Inbox />} {...props} />
}

interface ErrorStateProps extends Omit<StateProps, 'title' | 'description' | 'icon'> {
  error?: ApiError | null
  title?: ReactNode
  onRetry?: () => void
}

export function ErrorState({ error, title, onRetry, action, ...props }: ErrorStateProps) {
  if (error?.isNetworkError) return <OfflineState onRetry={onRetry} {...props} />
  return (
    <StateBlock
      icon={<AlertTriangle className="text-danger" />}
      title={title ?? 'Something went wrong'}
      description={error?.message ?? 'We could not load this content. Please try again.'}
      action={
        action ??
        (onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        ))
      }
      {...props}
    />
  )
}

export function OfflineState({
  onRetry,
  ...props
}: Omit<StateProps, 'title' | 'icon'> & { onRetry?: () => void }) {
  return (
    <StateBlock
      icon={<WifiOff />}
      title="You're offline"
      description="Check your internet connection and try again."
      action={
        onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Retry
          </Button>
        )
      }
      {...props}
    />
  )
}

export function NotFoundPage() {
  return (
    <StateBlock
      icon={<SearchX />}
      title="Page not found"
      description="The page you are looking for doesn't exist or has been moved."
      action={<LinkButton to="/">Go to dashboard</LinkButton>}
    />
  )
}
