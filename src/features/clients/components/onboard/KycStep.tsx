import { clientsApi } from '@/api/clients'
import { Button, DatePicker, Input, Textarea } from '@/components/ui'
import { useMutation } from '@/hooks/useMutation'
import { PAN_PATTERN } from '@/lib/validation'
import type { PanVerification } from '@/types'
import { VerifiedPill } from './OtpField'

export interface KycValues {
  pan: string
  verification: PanVerification | null
  dob: Date | undefined
}

export const emptyKyc: KycValues = { pan: '', verification: null, dob: undefined }

export function isKycComplete(values: KycValues) {
  return values.verification !== null && values.dob !== undefined
}

const today = new Date()
const adultCutoff = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())

interface KycStepProps {
  values: KycValues
  onChange: (values: KycValues) => void
}

export function KycStep({ values, onChange }: KycStepProps) {
  const verify = useMutation(clientsApi.verifyPan)
  const verified = values.verification !== null

  const verifyPan = async () => {
    const result = await verify.mutate(values.pan)
    if (result) onChange({ ...values, pan: result.pan, verification: result })
  }

  return (
    <div className="space-y-5">
      <Input
        label="PAN number"
        placeholder="ABCDE1234F"
        value={values.pan}
        maxLength={10}
        autoCapitalize="characters"
        className="uppercase"
        readOnly={verified}
        error={verify.error?.message}
        onChange={(event) => {
          verify.reset()
          onChange({
            ...values,
            pan: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
            verification: null,
          })
        }}
        rightSlot={
          verified ? (
            <VerifiedPill />
          ) : (
            <Button
              variant="link"
              size="sm"
              disabled={!PAN_PATTERN.test(values.pan)}
              loading={verify.loading}
              onClick={verifyPan}
            >
              Verify
            </Button>
          )
        }
      />
      {values.verification && (
        <>
          <Input label="Name" value={values.verification.name} readOnly />
          <Textarea label="Address" value={values.verification.address} readOnly rows={2} />
          <DatePicker
            label="Date of Birth"
            placeholder="DD/MM/YYYY"
            value={values.dob}
            onChange={(dob) => onChange({ ...values, dob })}
            maxDate={adultCutoff}
          />
        </>
      )}
    </div>
  )
}
