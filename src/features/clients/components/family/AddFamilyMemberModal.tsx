import { useState } from 'react'
import { clientsApi } from '@/api/clients'
import { FormError } from '@/components/common'
import { Button, Modal, Select } from '@/components/ui'
import { useMutation } from '@/hooks/useMutation'
import { useInvalidate, useQuery } from '@/hooks/useQuery'
import { toast } from '@/store/toast'
import type { FamilyRelationship } from '@/types'

type LinkableRelationship = Exclude<FamilyRelationship, 'Self'>

const relationships: { value: LinkableRelationship; label: string }[] = [
  { value: 'Father', label: 'Father' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Son', label: 'Son' },
  { value: 'Daughter', label: 'Daughter' },
]

interface AddFamilyMemberModalProps {
  open: boolean
  onClose: () => void
  clientId: string
}

export function AddFamilyMemberModal({ open, onClose, clientId }: AddFamilyMemberModalProps) {
  const candidates = useQuery(
    `clients:family-candidates:${clientId}`,
    () => clientsApi.family.candidates(clientId),
    open,
  )
  const add = useMutation(clientsApi.family.add)
  const invalidate = useInvalidate()
  const [candidateId, setCandidateId] = useState<string | undefined>()
  const [relationship, setRelationship] = useState<LinkableRelationship | undefined>()
  const [touched, setTouched] = useState(false)

  const options = (candidates.data ?? []).map((candidate) => ({
    value: candidate.id,
    label: candidate.name,
    description: candidate.id,
  }))

  const submit = async () => {
    setTouched(true)
    if (!candidateId || !relationship) return
    const member = await add.mutate(clientId, { candidateId, relationship })
    if (!member) return
    invalidate(`clients:family:${clientId}`)
    invalidate(`clients:family-candidates:${clientId}`)
    invalidate(`clients:report:${clientId}`)
    toast.success(`${member.name} added to the family`)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add family member"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={add.loading}>
            Cancel
          </Button>
          <Button onClick={submit} loading={add.loading}>
            Add member
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Choose family member"
          placeholder={candidates.loading ? 'Loading clients…' : 'choose family member'}
          value={candidateId}
          onChange={setCandidateId}
          options={options}
          disabled={candidates.loading || options.length === 0}
          error={touched && !candidateId ? 'Choose a family member' : undefined}
          hint={
            !candidates.loading && options.length === 0
              ? 'All existing clients are already linked. Onboard a new client first.'
              : undefined
          }
        />
        <Select
          label="Relationship"
          placeholder="Select relationship"
          value={relationship}
          onChange={setRelationship}
          options={relationships}
          error={touched && !relationship ? 'Choose a relationship' : undefined}
        />
        <FormError error={add.error ?? candidates.error} />
      </div>
    </Modal>
  )
}
