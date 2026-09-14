import { useState } from 'react'
import { clientsApi } from '@/api/clients'
import { FormError } from '@/components/common'
import { Button, DatePicker, Input, Modal, Select } from '@/components/ui'
import { useMutation } from '@/hooks/useMutation'
import { useInvalidate } from '@/hooks/useQuery'
import { toast } from '@/store/toast'
import type { AutoMandate } from '@/types'

const banks = ['HDFC BANK', 'ICICI BANK', 'SBI', 'AXIS BANK', 'KOTAK MAHINDRA BANK'].map(
  (bank) => ({ value: bank, label: bank }),
)

const amountPresets = [25000, 50000, 100000, 150000]

function addYears(date: Date, years: number) {
  const next = new Date(date)
  next.setFullYear(next.getFullYear() + years)
  return next
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

interface CreateMandateModalProps {
  open: boolean
  onClose: () => void
  clientId: string
  onCreated?: (mandate: AutoMandate) => void
}

export function CreateMandateModal({
  open,
  onClose,
  clientId,
  onCreated,
}: CreateMandateModalProps) {
  const [bank, setBank] = useState<string | undefined>()
  const [accountNumber, setAccountNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [validTill, setValidTill] = useState<Date | undefined>(() => addYears(new Date(), 15))
  const [touched, setTouched] = useState(false)
  const create = useMutation(clientsApi.mandates.create)
  const invalidate = useInvalidate()

  const amountValue = Number(amount)
  const errors = {
    bank: !bank ? 'Choose a bank' : undefined,
    accountNumber: !/^\d{9,18}$/.test(accountNumber)
      ? 'Enter a valid account number (9–18 digits)'
      : undefined,
    amount: !amountValue || amountValue < 1000 ? 'Enter an amount of at least ₹1,000' : undefined,
    validTill: !validTill ? 'Choose a validity date' : undefined,
  }
  const hasErrors = Object.values(errors).some(Boolean)

  const submit = async () => {
    setTouched(true)
    if (hasErrors || !bank || !validTill) return
    const mandate = await create.mutate(clientId, {
      bank,
      accountNumber,
      amountLimit: amountValue,
      validTill: toIsoDate(validTill),
    })
    if (!mandate) return
    invalidate(`clients:mandates:${clientId}`)
    toast.success('Mandate request submitted for processing')
    onCreated?.(mandate)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create new mandate"
      description="Set up a bank mandate to auto-debit SIP instalments for this client."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={create.loading}>
            Cancel
          </Button>
          <Button onClick={submit} loading={create.loading} disabled={touched && hasErrors}>
            Create mandate
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Bank"
          placeholder="Choose bank"
          value={bank}
          onChange={setBank}
          options={banks}
          error={touched ? errors.bank : undefined}
        />
        <Input
          label="Account number"
          placeholder="Enter bank account number"
          inputMode="numeric"
          autoComplete="off"
          maxLength={18}
          value={accountNumber}
          onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, ''))}
          error={touched ? errors.accountNumber : undefined}
        />
        <div className="space-y-2">
          <Input
            label="Maximum debit amount"
            placeholder="1,50,000"
            inputMode="numeric"
            leftIcon={<span className="text-sm">₹</span>}
            value={amount}
            onChange={(event) => setAmount(event.target.value.replace(/\D/g, ''))}
            error={touched ? errors.amount : undefined}
            hint="The highest amount that can be debited in a single instalment."
          />
          <div className="flex flex-wrap gap-2">
            {amountPresets.map((preset) => (
              <Button
                key={preset}
                type="button"
                size="sm"
                variant={amountValue === preset ? 'secondary' : 'outline'}
                onClick={() => setAmount(String(preset))}
              >
                ₹{preset.toLocaleString('en-IN')}
              </Button>
            ))}
          </div>
        </div>
        <DatePicker
          label="Valid till"
          value={validTill}
          onChange={setValidTill}
          minDate={addYears(new Date(), 1)}
          maxDate={addYears(new Date(), 40)}
          error={touched ? errors.validTill : undefined}
        />
        <FormError error={create.error} />
      </div>
    </Modal>
  )
}
