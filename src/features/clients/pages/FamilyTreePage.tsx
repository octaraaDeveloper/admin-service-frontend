import { Plus, TriangleAlert, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { clientsApi } from '@/api/clients'
import { EmptyState, ErrorState, PageHeader } from '@/components/common'
import { Button, Card, ConfirmModal, Skeleton } from '@/components/ui'
import { useMutation } from '@/hooks/useMutation'
import { useInvalidate, useQuery } from '@/hooks/useQuery'
import { toast } from '@/store/toast'
import type { FamilyMember } from '@/types'
import { AddFamilyMemberModal } from '../components/family/AddFamilyMemberModal'
import { FamilyListPanel } from '../components/family/FamilyListPanel'
import { FamilyTree } from '../components/family/FamilyTree'

export default function FamilyTreePage() {
  const { clientId = '' } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const invalidate = useInvalidate()
  const client = useQuery(`clients:detail:${clientId}`, () => clientsApi.get(clientId))
  const family = useQuery(`clients:family:${clientId}`, () => clientsApi.family.list(clientId))
  const remove = useMutation(clientsApi.family.remove)
  const [addOpen, setAddOpen] = useState(false)
  const [addKey, setAddKey] = useState(0)
  const [pendingRemove, setPendingRemove] = useState<FamilyMember | null>(null)

  const openAdd = () => {
    setAddKey((key) => key + 1)
    setAddOpen(true)
  }

  const confirmRemove = async () => {
    if (!pendingRemove) return
    const result = await remove.mutate(clientId, pendingRemove.id)
    if (!result) {
      toast.error('Could not remove the family member. Please try again.')
      return
    }
    invalidate(`clients:family`)
    invalidate(`clients:report:${clientId}`)
    toast.success(`${pendingRemove.name} removed from the family`)
    setPendingRemove(null)
  }

  const error = client.error ?? family.error
  if (error) {
    return (
      <ErrorState
        error={error}
        title="Could not load the family tree"
        onRetry={() => {
          void client.refetch()
          void family.refetch()
        }}
        action={
          <Button variant="outline" onClick={() => navigate(`/clients/${clientId}`)}>
            Back to profile
          </Button>
        }
      />
    )
  }

  const loading = !client.data || !family.data
  const members: FamilyMember[] = client.data
    ? [
        {
          id: 'self',
          name: client.data.name,
          relationship: 'Self',
          linkedClientId: client.data.id,
          aum: client.data.aum,
        },
        ...(family.data ?? []),
      ]
    : []
  const hasLinkedMembers = (family.data?.length ?? 0) > 0

  return (
    <div className="space-y-5 pb-20 md:space-y-6 lg:pb-0">
      <PageHeader
        title="Family Tree"
        description="Linked family accounts for consolidated wealth view"
        backTo={`/clients/${clientId}`}
        crumbs={[
          { label: 'Clients', to: '/clients' },
          { label: 'Profile', to: `/clients/${clientId}` },
          { label: 'Family tree' },
        ]}
        actions={
          <Button
            leftIcon={<Plus className="size-4" />}
            onClick={openAdd}
            disabled={loading}
            className="hidden lg:inline-flex"
          >
            Add member
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-72" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
          <Card className="p-2 md:p-4">
            {hasLinkedMembers ? (
              <FamilyTree members={members} />
            ) : (
              <EmptyState
                icon={<Users className="size-6" />}
                title="No family members linked"
                description="Link spouse, parents or children to see a consolidated view of the family's wealth."
                compact
                action={
                  <Button leftIcon={<Plus className="size-4" />} onClick={openAdd}>
                    Add member
                  </Button>
                }
              />
            )}
          </Card>
          <FamilyListPanel members={members} onRemove={setPendingRemove} />
        </div>
      )}

      <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-20 border-t border-border bg-surface-raised/95 p-3 backdrop-blur lg:hidden">
        <Button
          className="w-full"
          leftIcon={<Plus className="size-4" />}
          onClick={openAdd}
          disabled={loading}
        >
          Add Member(s)
        </Button>
      </div>

      <AddFamilyMemberModal
        key={addKey}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        clientId={clientId}
      />

      <ConfirmModal
        open={pendingRemove !== null}
        onClose={() => setPendingRemove(null)}
        onConfirm={confirmRemove}
        tone="danger"
        icon={<TriangleAlert className="size-5" />}
        title="Remove family member?"
        description={
          pendingRemove
            ? `${pendingRemove.name} will be unlinked from this family. Their own account and investments are not affected.`
            : ''
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        loading={remove.loading}
      />
    </div>
  )
}
