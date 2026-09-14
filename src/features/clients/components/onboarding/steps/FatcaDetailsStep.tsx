import { Select } from '@/components/ui'
import type { FatcaDetails, OnboardingFormOptions } from '@/types'
import { PepField } from '../PepField'
import { SearchableSelect } from '../SearchableSelect'
import type { FieldErrors } from '../onboardingState'

interface FatcaDetailsStepProps {
  value: FatcaDetails
  onChange: (patch: Partial<FatcaDetails>) => void
  errors: FieldErrors
  options: OnboardingFormOptions
}

export function FatcaDetailsStep({ value, onChange, errors, options }: FatcaDetailsStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SearchableSelect
          label="Place Of Birth (city)"
          value={value.placeOfBirth}
          onChange={(placeOfBirth) => onChange({ placeOfBirth })}
          options={options.cities}
          placeholder="Select your birth city"
          searchPlaceholder="Search city"
          error={errors.placeOfBirth}
        />
        <SearchableSelect
          label="Country of Birth"
          value={value.countryOfBirth}
          onChange={(countryOfBirth) => onChange({ countryOfBirth })}
          options={options.countries}
          placeholder="Select your country of birth"
          searchPlaceholder="Search country"
          error={errors.countryOfBirth}
        />
      </div>
      <Select
        label="Source of Wealth"
        value={value.sourceOfWealth}
        onChange={(sourceOfWealth) => onChange({ sourceOfWealth })}
        options={options.sourcesOfWealth}
        placeholder="Select source of wealth"
        error={errors.sourceOfWealth}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Income Slab"
          value={value.incomeSlab}
          onChange={(incomeSlab) => onChange({ incomeSlab })}
          options={options.incomeSlabs}
          placeholder="Select income slab"
          error={errors.incomeSlab}
        />
        <Select
          label="Occupation"
          value={value.occupation}
          onChange={(occupation) => onChange({ occupation })}
          options={options.occupations}
          placeholder="Select occupation"
          error={errors.occupation}
        />
      </div>
      <PepField
        value={value.pep}
        onChange={(pep) => onChange({ pep })}
        options={options.yesNo}
        error={errors.pep}
      />
    </div>
  )
}
