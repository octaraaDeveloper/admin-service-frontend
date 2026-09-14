import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { NotFoundPage } from '@/components/common/states'
import { Toaster } from '@/components/common/Toaster'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const VerifyOtpPage = lazy(() => import('@/features/auth/pages/VerifyOtpPage'))
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))
const ResetSuccessPage = lazy(() => import('@/features/auth/pages/ResetSuccessPage'))

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const BusinessUpdatePage = lazy(() => import('@/features/dashboard/pages/BusinessUpdatePage'))
const MfInvestorsPage = lazy(() => import('@/features/dashboard/pages/MfInvestorsPage'))
const FdInvestorsPage = lazy(() => import('@/features/dashboard/pages/FdInvestorsPage'))
const AumBreakdownPage = lazy(() => import('@/features/dashboard/pages/AumBreakdownPage'))
const SipInvestorsPage = lazy(() => import('@/features/dashboard/pages/SipInvestorsPage'))

const ClientsPage = lazy(() => import('@/features/clients/pages/ClientsPage'))
const ClientProfilePage = lazy(() => import('@/features/clients/pages/ClientProfilePage'))
const FamilyTreePage = lazy(() => import('@/features/clients/pages/FamilyTreePage'))
const TransactPage = lazy(() => import('@/features/clients/pages/TransactPage'))

const TransactionsPage = lazy(() => import('@/features/transactions/pages/TransactionsPage'))
const ExplorePage = lazy(() => import('@/features/explore/pages/ExplorePage'))

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/reset-success" element={<ResetSuccessPage />} />
          </Route>

          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/dashboard/business-update" element={<BusinessUpdatePage />} />
            <Route path="/dashboard/mf-investors" element={<MfInvestorsPage />} />
            <Route path="/dashboard/fd-investors" element={<FdInvestorsPage />} />
            <Route path="/dashboard/aum-breakdown" element={<AumBreakdownPage />} />
            <Route path="/dashboard/sip-investors" element={<SipInvestorsPage />} />

            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:clientId/family" element={<FamilyTreePage />} />
            <Route path="/clients/:clientId/transact" element={<TransactPage />} />
            <Route path="/clients/:clientId/:tab?" element={<ClientProfilePage />} />

            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ErrorBoundary>
  )
}
