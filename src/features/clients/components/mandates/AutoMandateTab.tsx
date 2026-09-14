import { Landmark, Plus, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { clientsApi } from '@/api/clients'
import { EmptyState, ErrorState } from '@/components/common'
import { Button, ConfirmModal, Skeleton } from '@/components/ui'
import { useMutation } from '@/hooks/useMutation'
import { useInvalidate, useQuery } from '@/hooks/useQuery'
import { toast } from '@/store/toast'
import type { AutoMandate, ClientProfile } from '@/types'
import { CreateMandateModal } from './CreateMandateModal'
import { MandateCard } from './MandateCard'

export function AutoMandateTab({ client }: { client: ClientProfile }) {
  const mandates = useQuery(`clients:mandates:${client.id}`, () =>
    clientsApi.mandates.list(client.id),
  )
  const invalidate = useInvalidate()
  const remove = useMutation(clientsApi.mandates.remove)
  const [createOpen, setCreateOpen] = useState(false)
  const [createKey, setCreateKey] = useState(0)
  const [pendingDelete, setPendingDelete] = useState<AutoMandate | null>(null)

  const openCreate = () => {
    setCreateKey((key) => key + 1)
    setCreateOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const result = await remove.mutate(client.id, pendingDelete.id)
    if (!result) {
      toast.error('Could not delete the mandate. Please try again.')
      return
    }
    invalidate(`clients:mandates:${client.id}`)
    toast.success('Mandate deleted')
    setPendingDelete(null)
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Auto Mandate</h3>
          <p className="text-xs text-text-muted">
            Bank mandates that auto-debit SIP instalments for this client.
          </p>
        </div>
        <Button leftIcon={<Plus className="size-4" />} onClick={openCreate}>
          Create New mandate
        </Button>
      </div>

      {mandates.error ? (
        <ErrorState error={mandates.error} onRetry={mandates.refetch} compact />
      ) : mandates.loading && !mandates.data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className="h-36" />
          ))}
        </div>
      ) : mandates.data && mandates.data.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {mandates.data.map((mandate) => (
            <MandateCard key={mandate.id} mandate={mandate} onDelete={setPendingDelete} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Landmark className="size-6" />}
          title="No mandates yet"
          description="Create a bank mandate so SIP instalments can be debited automatically."
          compact
          action={
            <Button leftIcon={<Plus className="size-4" />} onClick={openCreate}>
              Create New mandate
            </Button>
          }
        />
      )}

      <CreateMandateModal
        key={createKey}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        clientId={client.id}
      />

      <ConfirmModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        tone="danger"
        icon={<TriangleAlert className="size-5" />}
        title="Delete Mandate?"
        description="Your bank mandate will be permanently deleted. You will not be able to cancel this deletion request once you continue. Do you still wish to proceed?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={remove.loading}
      />
    </div>
  )
}
