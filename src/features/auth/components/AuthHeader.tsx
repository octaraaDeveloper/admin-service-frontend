import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface BackLink {
  to: string
  label: string
  state?: object
}

interface AuthHeaderProps {
  title: string
  description: ReactNode
  back?: BackLink
}

export function AuthHeader({ title, description, back }: AuthHeaderProps) {
  return (
    <header>
      {back && (
        <Link
          to={back.to}
          state={back.state}
          className="mb-5 inline-flex items-center gap-1.5 rounded-sm text-sm text-text-muted focus-ring transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {back.label}
        </Link>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h2>
      <p className="mt-1.5 text-base text-text-muted">{description}</p>
    </header>
  )
}
