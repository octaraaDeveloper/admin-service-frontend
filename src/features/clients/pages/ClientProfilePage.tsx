import { ShieldCheck, TriangleAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { clientsApi } from '@/api/clients'
import { ErrorState, FormError } from '@/components/common'
import { Button, ConfirmModal, SegmentedControl, Skeleton } from '@/components/ui'
import { useMutation } from '@/hooks/useMutation'
import { useInvalidate, useQuery } from '@/hooks/useQuery'
import { toast } from '@/store/toast'
import type { ClientProfile } from '@/types'
import { ClientProfileHeader } from '../components/ClientProfileHeader'
import { ClientTransactionsTab } from '../components/ClientTransactionsTab'
import { AutoMandateTab } from '../components/mandates/AutoMandateTab'
import { FurtherOnboardingFlow } from '../components/onboarding/FurtherOnboardingFlow'
import { PortfolioTab } from '../components/PortfolioTab'
import { ReportTab } from '../components/ReportTab'

const tabs = [
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'report', label: 'Report' },
  { value: 'transactions', label: 'Transactions' },
  { value: 'auto-mandate', label: 'Auto Mandates' },
] as const

type ProfileTab = (typeof tabs)[number]['value']

function isProfileTab(value: string | undefined): value is ProfileTab {
  return tabs.some((tab) => tab.value === value)
}

const kycNotice: Record<Exclude<ClientProfile['kycStatus'], 'verified'>, string> = {
  pending:
    'KYC verification is pending. Complete the onboarding details so this client can start investing.',
  rejected: 'KYC was rejected. Review and resubmit the onboarding details to re-initiate KYC.',
  expired: 'KYC has expired. Re-run onboarding to refresh the KYC details for this client.',
}

function KycNotice({ client, onContinue }: { client: ClientProfile; onContinue: () => void }) {
  if (client.kycStatus === 'verified') return null
  return (
    <div className="flex flex-col gap-3 rounded-card border border-warning/30 bg-warning-tint p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-warning" />
        <div>
          <p className="text-sm font-semibold text-text-primary">Onboarding incomplete</p>
          <p className="text-sm text-text-secondary">{kycNotice[client.kycStatus]}</p>
        </div>
      </div>
      <Button variant="secondary" onClick={onContinue} className="shrink-0">
        Complete onboarding
      </Button>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-10 w-full max-w-xl" />
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <Skeleton className="h-80" />
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-56" />
        </div>
      </div>
    </div>
  )
}

export default function ClientProfilePage() {
  const { clientId = '', tab } = useParams<{ clientId: string; tab?: string }>()
  const navigate = useNavigate()
  const invalidate = useInvalidate()
  const client = useQuery(`clients:detail:${clientId}`, () => clientsApi.get(clientId))
  const remove = useMutation(clientsApi.remove)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  // Keep the active tab visible when the segmented control scrolls horizontally on mobile.
  useEffect(() => {
    tabsRef.current
      ?.querySelector<HTMLElement>('[aria-checked="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [tab])

  if (tab !== undefined && !isProfileTab(tab)) {
    return <Navigate to={`/clients/${clientId}`} replace />
  }
  const activeTab: ProfileTab = tab ?? 'portfolio'

  const changeTab = (next: ProfileTab) => {
    navigate(next === 'portfolio' ? `/clients/${clientId}` : `/clients/${clientId}/${next}`)
  }

  const confirmDelete = async () => {
    const result = await remove.mutate(clientId)
    if (!result) return
    invalidate('clients:')
    toast.success('Client deleted')
    navigate('/clients', { replace: true })
  }

  if (client.error) {
    return (
      <ErrorState
        error={client.error}
        title="Could not load this client"
        onRetry={client.refetch}
        action={
          <Button variant="outline" onClick={() => navigate('/clients')}>
            Back to clients
          </Button>
        }
      />
    )
  }

  if (!client.data) return <ProfileSkeleton />

  const profile = client.data

  return (
    <div className="space-y-5 md:space-y-6">
      <ClientProfileHeader client={profile} onDelete={() => setDeleteOpen(true)} />

      <KycNotice client={profile} onContinue={() => setOnboardingOpen(true)} />

      <div ref={tabsRef}>
        <SegmentedControl
          value={activeTab}
          onChange={changeTab}
          options={[...tabs]}
          size="md"
          className="flex w-full [&>button]:flex-1 [&>button]:py-2"
        />
      </div>

      {activeTab === 'portfolio' && <PortfolioTab client={profile} />}
      {activeTab === 'report' && <ReportTab client={profile} />}
      {activeTab === 'transactions' && <ClientTransactionsTab clientId={profile.id} />}
      {activeTab === 'auto-mandate' && <AutoMandateTab client={profile} />}

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        tone="danger"
        icon={<TriangleAlert className="size-5" />}
        title="Delete client?"
        description="Are you sure you want to delete the client?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={remove.loading}
      >
        <div className="space-y-3">
          <p className="rounded-control bg-danger-tint px-3 py-2 text-xs text-danger">
            This action cannot be undone and will remove all associated portfolio data.
          </p>
          <FormError error={remove.error} />
        </div>
      </ConfirmModal>

      {onboardingOpen && (
        <FurtherOnboardingFlow
          open={onboardingOpen}
          onClose={() => {
            setOnboardingOpen(false)
            invalidate(`clients:detail:${clientId}`)
          }}
          client={profile}
        />
      )}
    </div>
  )
}
