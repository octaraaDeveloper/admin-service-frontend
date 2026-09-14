import { WifiOff } from 'lucide-react'
import { Suspense } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AppRouteSkeleton } from '@/components/ui/Skeleton'
import { useOnline } from '@/hooks/useOnline'
import { useAuthStore } from '@/store/auth'
import { MobileNav } from './MobileNav'
import { MobileSidebar, Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  const token = useAuthStore((state) => state.token)
  const online = useOnline()
  const location = useLocation()

  if (!token)
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    )

  return (
    <div className="min-h-dvh bg-surface">
      <Sidebar />
      <MobileSidebar />
      <div className="flex min-h-dvh flex-col lg:pl-[269px]">
        <Topbar />
        {!online && (
          <div
            className="flex items-center justify-center gap-2 bg-warning-tint px-4 py-2 text-xs font-medium text-warning"
            role="status"
          >
            <WifiOff className="size-4" />
            You are offline. Some data may be out of date.
          </div>
        )}
        <main className="flex-1 px-4 py-5 pb-24 md:px-6 md:py-6 lg:pb-6">
          <div className="mx-auto w-full max-w-[1200px]">
            <Suspense fallback={<AppRouteSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
