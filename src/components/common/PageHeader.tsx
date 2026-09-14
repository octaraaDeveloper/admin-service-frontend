import { ArrowLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { breadcrumbsFor, type Crumb } from '@/config/navigation'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  crumbs?: Crumb[]
  backTo?: string | true
  actions?: ReactNode
  className?: string
}

export type { Crumb }

export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-xs text-text-muted', className)}
    >
      <Link to="/" className="hover:text-text-primary">
        Home
      </Link>
      {crumbs.map((crumb, index) => (
        <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
          <ChevronRight className="size-3" aria-hidden />
          {crumb.to && index < crumbs.length - 1 ? (
            <Link to={crumb.to} className="hover:text-text-primary">
              {crumb.label}
            </Link>
          ) : (
            <span
              className={cn(index === crumbs.length - 1 && 'text-text-secondary')}
              aria-current={index === crumbs.length - 1 ? 'page' : undefined}
            >
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function PageHeader({
  title,
  description,
  crumbs,
  backTo,
  actions,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const resolvedCrumbs = crumbs ?? breadcrumbsFor(pathname)
  const back = backTo && (
    <button
      type="button"
      onClick={() => (backTo === true ? navigate(-1) : navigate(backTo))}
      aria-label="Go back"
      className="-ml-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-text-secondary focus-ring hover:bg-surface-sunken"
    >
      <ArrowLeft className="size-5" />
    </button>
  )

  return (
    <header className={cn('flex flex-col gap-3', className)}>
      <Breadcrumbs crumbs={resolvedCrumbs} className="md:hidden" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          {back}
          <div className="min-w-0">
            <h1 className="text-lg font-medium tracking-[0.5px] text-text-primary md:text-xl">
              {title}
            </h1>
            {description && (
              <p className="mt-0.5 text-xs text-text-muted md:text-sm">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
