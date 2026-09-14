import { Check, ChevronDown, Download, Plus, Redo2 } from 'lucide-react'
import { useState } from 'react'
import { clientsApi } from '@/api/clients'
import { PageHeader } from '@/components/common'
import { Button, DropdownMenu, IconButton, SearchInput } from '@/components/ui'
import { useMutation } from '@/hooks/useMutation'
import { useQuery } from '@/hooks/useQuery'
import { formatDate, formatNumber } from '@/lib/format'
import { downloadCsv, pluralize } from '@/lib/utils'
import { toast } from '@/store/toast'
import type { ClientProfile, KycStatus } from '@/types'
import { ClientsTable } from '../components/ClientsTable'
import { OnboardClientModal } from '../components/OnboardClientModal'

type KycFilter = 'all' | KycStatus

const PAGE_SIZE = 8

const kycOptions: { value: KycFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
]

function exportClients(rows: ClientProfile[]) {
  downloadCsv(
    `clients-${new Date().toISOString().slice(0, 10)}.csv`,
    ['User ID', 'Name', 'Email', 'Mobile', 'PAN', 'AUM', 'KYC status', 'Risk profile', 'Joined on'],
    rows.map((client) => [
      client.id,
      client.name,
      client.email,
      client.mobile,
      client.pan,
      client.aum,
      client.kycStatus,
      client.riskProfile,
      formatDate(client.joinedAt),
    ]),
  )
}

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [kyc, setKyc] = useState<KycFilter>('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [onboardOpen, setOnboardOpen] = useState(false)
  const [onboardKey, setOnboardKey] = useState(0)

  const request = { page, limit: PAGE_SIZE, search, filters: { kyc } }
  const list = useQuery(`clients:list:${JSON.stringify(request)}`, () => clientsApi.list(request))
  const summary = useQuery('clients:summary', clientsApi.summary)
  const resend = useMutation(clientsApi.resendLink)

  const updateSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const updateKyc = (value: KycFilter) => {
    setKyc(value)
    setPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setKyc('all')
    setPage(1)
  }

  const openOnboarding = () => {
    setOnboardKey((key) => key + 1)
    setOnboardOpen(true)
  }

  const handleExport = () => {
    const rows = list.data?.rows ?? []
    const chosen = selected.size > 0 ? rows.filter((row) => selected.has(row.id)) : rows
    if (chosen.length === 0) {
      toast.info('Nothing to export yet')
      return
    }
    exportClients(chosen)
    toast.success(`Exported ${chosen.length} ${pluralize(chosen.length, 'client')}`)
  }

  const handleResend = async () => {
    const result = await resend.mutate([...selected])
    if (!result) {
      toast.error(resend.error?.message ?? 'Could not resend the link')
      return
    }
    toast.success(`Verification link sent to ${result.sent} ${pluralize(result.sent, 'client')}`)
    setSelected(new Set())
  }

  const description = summary.data
    ? `${formatNumber(summary.data.total)} ${pluralize(summary.data.total, 'client')} · ${formatNumber(summary.data.pendingKyc)} pending KYC verification`
    : 'Loading client summary…'

  const kycLabel = kycOptions.find((option) => option.value === kyc)?.label ?? 'All'

  return (
    <div className="space-y-5">
      <PageHeader
        title="Client Management"
        description={description}
        actions={
          <>
            <IconButton
              label="Onboard new user"
              onClick={openOnboarding}
              className="bg-brand text-brand-foreground hover:bg-brand-hover md:hidden"
            >
              <Plus />
            </IconButton>
            <Button
              leftIcon={<Plus className="size-4" />}
              onClick={openOnboarding}
              className="hidden md:inline-flex"
            >
              Onboard new user
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchInput
          value={search}
          onChange={updateSearch}
          placeholder="Search by name, PAN or user ID"
          className="md:w-80"
        />
        <div className="-mx-4 scrollbar-none flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          <DropdownMenu
            align="start"
            trigger={
              <Button variant="outline" rightIcon={<ChevronDown className="size-4" />}>
                KYC: {kycLabel}
              </Button>
            }
            items={kycOptions.map((option) => ({
              label: option.label,
              icon: option.value === kyc ? <Check /> : <span className="size-4" />,
              onSelect: () => updateKyc(option.value),
            }))}
          />
          <Button
            variant="outline"
            leftIcon={<Download className="size-4" />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="outline"
            leftIcon={<Redo2 className="size-4" />}
            disabled={selected.size === 0}
            loading={resend.loading}
            onClick={handleResend}
          >
            Resend link
            {selected.size > 0 && (
              <span className="rounded-full bg-brand-tint px-1.5 text-2xs font-semibold text-brand">
                {selected.size}
              </span>
            )}
          </Button>
        </div>
      </div>

      <ClientsTable
        data={list.data}
        loading={list.loading}
        error={list.error}
        onRetry={list.refetch}
        selection={{ selected, onChange: setSelected }}
        onPageChange={setPage}
        onClear={clearFilters}
      />

      <OnboardClientModal
        key={onboardKey}
        open={onboardOpen}
        onClose={() => setOnboardOpen(false)}
      />
    </div>
  )
}
