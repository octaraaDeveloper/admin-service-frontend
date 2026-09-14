import { useState } from 'react'
import { clientsApi } from '@/api/clients'
import { FormError } from '@/components/common'
import { Button, Modal } from '@/components/ui'
import { useInvalidate } from '@/hooks/useQuery'
import { useMutation } from '@/hooks/useMutation'
import type { ClientProfile } from '@/types'
import {
  ContactStep,
  emptyContact,
  isContactComplete,
  type ContactValues,
} from './onboard/ContactStep'
import { DoneStep } from './onboard/DoneStep'
import { emptyKyc, isKycComplete, KycStep, type KycValues } from './onboard/KycStep'
import { StepProgress } from './onboard/StepProgress'

const stepLabels = ['Contact verification', 'KYC details', 'Done']

interface OnboardClientModalProps {
  open: boolean
  onClose: () => void
  onCreated?: (client: ClientProfile) => void
}

export function OnboardClientModal({ open, onClose, onCreated }: OnboardClientModalProps) {
  const [step, setStep] = useState(0)
  const [contact, setContact] = useState<ContactValues>(emptyContact)
  const [kyc, setKyc] = useState<KycValues>(emptyKyc)
  const [created, setCreated] = useState<ClientProfile | null>(null)
  const onboard = useMutation(clientsApi.onboard)
  const invalidate = useInvalidate()

  const submit = async () => {
    if (!kyc.verification || !kyc.dob) return
    const client = await onboard.mutate({
      mobile: contact.mobile,
      email: contact.email,
      pan: kyc.verification.pan,
      name: kyc.verification.name,
      address: kyc.verification.address,
      dob: kyc.dob.toISOString().slice(0, 10),
    })
    if (!client) return
    setCreated(client)
    setStep(2)
    invalidate('clients:')
    onCreated?.(client)
  }

  const footer =
    step === 0 ? (
      <Button className="w-full" disabled={!isContactComplete(contact)} onClick={() => setStep(1)}>
        Continue
      </Button>
    ) : step === 1 ? (
      <>
        <Button variant="outline" className="sm:flex-1" onClick={() => setStep(0)}>
          Back
        </Button>
        <Button
          className="sm:flex-1"
          disabled={!isKycComplete(kyc)}
          loading={onboard.loading}
          onClick={submit}
        >
          Continue
        </Button>
      </>
    ) : (
      <Button className="w-full" onClick={onClose}>
        Done
      </Button>
    )

  return (
    <Modal open={open} onClose={onClose} title="Onboard new user" footer={footer} size="md">
      <div className="space-y-6">
        <StepProgress total={stepLabels.length} current={step} label={stepLabels[step]} />
        {step === 0 && <ContactStep values={contact} onChange={setContact} />}
        {step === 1 && (
          <>
            <KycStep values={kyc} onChange={setKyc} />
            <FormError error={onboard.error} />
          </>
        )}
        {step === 2 && created && <DoneStep name={`${created.name} · ${created.id}`} />}
      </div>
    </Modal>
  )
}
