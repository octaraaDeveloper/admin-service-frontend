import { NavLink } from 'react-router-dom'
import { navItems } from '@/config/navigation'
import { cn } from '@/lib/utils'

export function MobileNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface-raised/95 safe-bottom backdrop-blur lg:hidden"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn(
              'relative flex flex-1 flex-col items-center gap-1 pt-2.5 pb-2 text-2xs font-medium focus-ring',
              isActive ? 'text-brand' : 'text-text-muted',
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-0 h-0.5 w-10 rounded-full bg-brand" aria-hidden />
              )}
              <item.icon className="size-6" strokeWidth={isActive ? 2 : 1.75} />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
