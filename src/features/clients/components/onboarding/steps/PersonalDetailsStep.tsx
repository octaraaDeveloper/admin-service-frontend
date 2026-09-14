import { Input, Select, Textarea } from '@/components/ui'
import type { OnboardingFormOptions, PersonalDetails } from '@/types'
import { PepField } from '../PepField'
import { SearchableSelect } from '../SearchableSelect'
import type { FieldErrors } from '../onboardingState'

interface PersonalDetailsStepProps {
  value: PersonalDetails
  onChange: (patch: Partial<PersonalDetails>) => void
  errors: FieldErrors
  options: OnboardingFormOptions
}

export function PersonalDetailsStep({
  value,
  onChange,
  errors,
  options,
}: PersonalDetailsStepProps) {
  const needsCountry = value.nationality !== undefined && value.nationality !== 'indian'

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          value={value.firstName}
          onChange={(event) => onChange({ firstName: event.target.value })}
          placeholder="Enter first name"
          autoComplete="given-name"
          error={errors.firstName}
        />
        <Input
          label="Last Name"
          value={value.lastName}
          onChange={(event) => onChange({ lastName: event.target.value })}
          placeholder="Enter last name"
          autoComplete="family-name"
          error={errors.lastName}
        />
        <Select
          label="Gender"
          value={value.gender}
          onChange={(gender) => onChange({ gender })}
          options={options.genders}
          placeholder="Select gender"
          error={errors.gender}
        />
        <Select
          label="Marital Status"
          value={value.maritalStatus}
          onChange={(maritalStatus) => onChange({ maritalStatus })}
          options={options.maritalStatuses}
          placeholder="Select status"
          error={errors.maritalStatus}
        />
      </div>
      <Textarea
        label="Address"
        value={value.address}
        onChange={(event) => onChange({ address: event.target.value })}
        placeholder="House / street, area, city, PIN code"
        rows={2}
        className="min-h-14"
        error={errors.address}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Nationality"
          value={value.nationality}
          onChange={(nationality) =>
            onChange({ nationality, country: nationality === 'indian' ? undefined : value.country })
          }
          options={options.nationalities}
          placeholder="Select nationality"
          error={errors.nationality}
        />
        {needsCountry && (
          <SearchableSelect
            label={value.nationality === 'nri' ? 'Country of residence' : 'Country of citizenship'}
            value={value.country}
            onChange={(country) => onChange({ country })}
            options={options.countries}
            placeholder="Search country"
            searchPlaceholder="Search country"
            error={errors.country}
          />
        )}
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
