import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface InvestorCellProps {
  clientId: string
  name: string
  avatarUrl?: string | null
  meta?: string
  className?: string
}

export function InvestorCell({ clientId, name, avatarUrl, meta, className }: InvestorCellProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <Avatar name={name} src={avatarUrl} size="sm" />
      <div className="min-w-0">
        <Link
          to={`/clients/${clientId}`}
          className="block truncate rounded-sm font-medium text-text-secondary focus-ring hover:text-brand hover:underline"
          onClick={(event) => event.stopPropagation()}
        >
          {name}
        </Link>
        <p className="truncate text-2xs font-medium text-text-placeholder">{meta ?? clientId}</p>
      </div>
    </div>
  )
}
