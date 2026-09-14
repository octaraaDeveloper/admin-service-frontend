import { Suspense } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import logoLight from '@/assets/logo-light.svg'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { AuthRouteSkeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/store/auth'

export function AuthLayout() {
  const token = useAuthStore((state) => state.token)
  const { state } = useLocation()
  const from = typeof state?.from === 'string' && state.from.startsWith('/') ? state.from : '/'
  if (token) return <Navigate to={from} replace />

  return (
    <div className="flex min-h-dvh flex-col bg-surface-sunken lg:flex-row">
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#070f5e_0%,#050c6c_55%,#0a0630_100%)] px-6 pt-8 pb-10 text-white lg:flex lg:w-[44%] lg:max-w-[620px] lg:flex-col lg:justify-center lg:px-14 lg:py-16">
        <div
          className="pointer-events-none absolute -top-40 -right-24 size-[520px] rounded-full bg-[radial-gradient(circle,rgb(254_127_0/0.22)_0%,transparent_70%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-28 size-[360px] rounded-full bg-[radial-gradient(circle,rgb(90_110_255/0.18)_0%,transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto flex w-full max-w-md flex-col lg:mx-0 lg:max-w-none">
          <div className="flex items-center justify-between">
            <img src={logoLight} alt="Octaraa" className="h-12 lg:h-16" />
            <span className="rounded-full border border-white/20 px-2.5 py-0.5 text-2xs font-medium text-[#b9c0ff]">
              Admin
            </span>
          </div>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight lg:mt-14 lg:text-3xl">
            The control center for your wealth platform.
          </h1>
          <p className="mt-3 max-w-md text-sm text-[#c7ccf0] lg:mt-4 lg:text-md lg:leading-relaxed">
            Manage clients, mutual funds, transactions and mandates across the platform.
          </p>
        </div>
      </section>

      <section className="relative flex flex-1 items-start justify-center px-4 pt-6 pb-10 lg:items-center lg:bg-surface-raised lg:px-6 lg:py-10">
        <ThemeToggle className="absolute top-3 right-3 hidden lg:inline-flex" />
        <div className="-mt-12 w-full max-w-[448px] card p-6 shadow-xl sm:p-8 lg:mt-0 lg:max-w-[400px] lg:border-0 lg:p-0 lg:shadow-none">
          <Suspense fallback={<AuthRouteSkeleton />}>
            <Outlet />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
