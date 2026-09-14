import { Bell, Menu, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/PageHeader'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { IconButton } from '@/components/ui/IconButton'
import { breadcrumbsFor } from '@/config/navigation'
import { useUiStore } from '@/store/ui'
import { Logo } from './Sidebar'

export function Topbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const openSidebar = useUiStore((state) => state.openSidebar)
  const crumbs = breadcrumbsFor(pathname)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/85 px-4 backdrop-blur md:px-6">
      <IconButton label="Open menu" onClick={openSidebar} className="-ml-2 lg:hidden">
        <Menu className="size-6" />
      </IconButton>
      <Logo className="h-9 lg:hidden" />
      <Breadcrumbs
        crumbs={crumbs}
        className="hidden text-lg font-medium text-text-primary lg:flex [&_a]:text-text-primary [&_span]:text-text-primary"
      />

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={() => navigate('/clients')}
          className="hidden h-10 w-70 items-center gap-2.5 rounded-control border border-border bg-surface-sunken px-3 text-left text-sm text-text-placeholder focus-ring transition-colors hover:border-border-strong md:flex"
        >
          <Search className="size-4" />
          Search clients, funds, transactions…
        </button>
        <IconButton label="Search" onClick={() => navigate('/clients')} className="md:hidden">
          <Search />
        </IconButton>
        <ThemeToggle className="hidden sm:inline-flex" />
        <IconButton label="Notifications" variant="outline" className="relative">
          <Bell />
          <span
            className="absolute top-2 right-2.5 size-2 rounded-full bg-accent ring-2 ring-surface-raised"
            aria-hidden
          />
        </IconButton>
      </div>
    </header>
  )
}
