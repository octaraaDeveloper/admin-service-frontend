import { useMemo } from 'react'
import { Monogram } from '@/components/common'
import { Input, Select } from '@/components/ui'
import type { BankDetails, OnboardingFormOptions } from '@/types'
import { SearchableSelect } from '../SearchableSelect'
import type { FieldErrors } from '../onboardingState'
import { ACCOUNT_MISMATCH } from '../validation'

interface BankDetailsStepProps {
  value: BankDetails
  onChange: (patch: Partial<BankDetails>) => void
  errors: FieldErrors
  options: OnboardingFormOptions
}

const digitsOnly = (value: string) => value.replace(/\D/g, '').slice(0, 18)

export function BankDetailsStep({ value, onChange, errors, options }: BankDetailsStepProps) {
  const bankOptions = useMemo(
    () =>
      options.banks.map((bank) => ({
        value: bank.id,
        label: bank.name,
        leading: <Monogram label={bank.initials} color={bank.color} />,
      })),
    [options.banks],
  )
  const matched =
    value.confirmAccountNumber.length > 0 && value.confirmAccountNumber === value.accountNumber
  const mismatch =
    value.confirmAccountNumber.length > 0 && value.confirmAccountNumber !== value.accountNumber

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Account Type"
        value={value.accountType}
        onChange={(accountType) => onChange({ accountType })}
        options={options.accountTypes}
        placeholder="Select Account Type"
        error={errors.accountType}
      />
      <SearchableSelect
        label="Bank Name"
        value={value.bankId}
        onChange={(bankId) => onChange({ bankId })}
        options={bankOptions}
        placeholder="Search Bank Name"
        searchPlaceholder="Search Bank Name"
        error={errors.bankId}
      />
      <Input
        label="Account Number"
        inputMode="numeric"
        autoComplete="off"
        value={value.accountNumber}
        onChange={(event) => onChange({ accountNumber: digitsOnly(event.target.value) })}
        placeholder="Enter account number"
        error={errors.accountNumber}
      />
      <Input
        label="Confirm Account Number"
        inputMode="numeric"
        autoComplete="off"
        value={value.confirmAccountNumber}
        onChange={(event) => onChange({ confirmAccountNumber: digitsOnly(event.target.value) })}
        onPaste={(event) => event.preventDefault()}
        placeholder="Re-enter account number"
        error={errors.confirmAccountNumber ?? (mismatch ? ACCOUNT_MISMATCH : undefined)}
        hint={matched ? <span className="text-success">Account number matched</span> : undefined}
      />
      <Input
        label="IFSC Code"
        value={value.ifsc}
        onChange={(event) =>
          onChange({
            ifsc: event.target.value
              .toUpperCase()
              .replace(/[^A-Z0-9]/g, '')
              .slice(0, 11),
          })
        }
        placeholder="ENTER IFSC CODE"
        autoComplete="off"
        className="uppercase"
        error={errors.ifsc}
      />
    </div>
  )
}
