import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ChevronsUpDown, LogOut, Moon, Sun, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.svg'
import logoLight from '@/assets/logo-light.svg'
import { Avatar } from '@/components/ui/Avatar'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { navItems } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'
import { useUiStore } from '@/store/ui'

export function Logo({ className }: { className?: string }) {
  return (
    <>
      <img src={logo} alt="Octaraa" className={cn('dark:hidden', className)} />
      <img src={logoLight} alt="Octaraa" className={cn('hidden dark:block', className)} />
    </>
  )
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-2" aria-label="Main">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex h-12 items-center gap-3 rounded-card border px-2.5 text-md font-medium focus-ring transition-colors',
              isActive
                ? 'border-nav-active-border bg-nav-active text-brand'
                : 'border-transparent text-text-muted hover:bg-surface-sunken hover:text-text-primary',
            )
          }
        >
          <item.icon className="size-6 shrink-0" strokeWidth={1.75} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

function UserMenu({ onNavigate }: { onNavigate?: () => void }) {
  const profile = useAuthStore((state) => state.profile)
  const logout = useAuthStore((state) => state.logout)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggle)
  const navigate = useNavigate()

  return (
    <div className="border-t border-border pt-3">
      <DropdownMenu
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width)"
        items={[
          {
            label: theme === 'dark' ? 'Light theme' : 'Dark theme',
            icon: theme === 'dark' ? <Sun /> : <Moon />,
            onSelect: toggleTheme,
          },
          {
            label: 'Sign out',
            icon: <LogOut />,
            tone: 'danger',
            separatorBefore: true,
            onSelect: () => {
              logout()
              onNavigate?.()
              navigate('/login')
            },
          },
        ]}
        trigger={
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-card px-1 py-1.5 text-left focus-ring transition-colors hover:bg-surface-sunken"
          >
            <Avatar name={profile?.name ?? 'Admin'} src={profile?.avatarUrl} size="md" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base font-medium text-text-primary">
                {profile?.name ?? 'Admin'}
              </span>
              <span className="block truncate text-xs text-text-muted">{profile?.email}</span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-text-muted" />
          </button>
        }
      />
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[269px] flex-col border-r border-border bg-surface-raised px-4 pt-7 pb-5 lg:flex">
      <div className="mb-8 px-2.5">
        <Logo className="h-14" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <NavList />
      </div>
      <UserMenu />
    </aside>
  )
}

export function MobileSidebar() {
  const open = useUiStore((state) => state.sidebarOpen)
  const close = useUiStore((state) => state.closeSidebar)

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && close()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-surface-overlay data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs flex-col bg-surface-raised px-4 pt-5 pb-5 shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left lg:hidden">
          <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Main navigation menu
          </DialogPrimitive.Description>
          <div className="mb-6 flex items-center justify-between px-1">
            <Logo className="h-11" />
            <DialogPrimitive.Close
              aria-label="Close menu"
              className="rounded-lg p-1.5 text-text-muted focus-ring hover:bg-surface-sunken"
            >
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <NavList onNavigate={close} />
          </div>
          <UserMenu onNavigate={close} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
