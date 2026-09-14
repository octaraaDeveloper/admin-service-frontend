import { IFSC_PATTERN } from '@/lib/validation'
import type { BankDetails, FatcaDetails, Nominee, PersonalDetails } from '@/types'
import { nomineeField, type FieldErrors } from './onboardingState'

const ACCOUNT_NUMBER_PATTERN = /^\d{9,18}$/
export const ACCOUNT_MISMATCH = "Account number doesn't match."

export function validatePersonal(data: PersonalDetails): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.firstName.trim()) errors.firstName = 'Enter first name'
  if (!data.lastName.trim()) errors.lastName = 'Enter last name'
  if (!data.gender) errors.gender = 'Select gender'
  if (!data.maritalStatus) errors.maritalStatus = 'Select marital status'
  if (!data.address.trim()) errors.address = 'Enter address'
  if (!data.nationality) errors.nationality = 'Select nationality'
  else if (data.nationality !== 'indian' && !data.country) errors.country = 'Select country'
  if (!data.pep) errors.pep = 'Select an option'
  return errors
}

export function validateBank(data: BankDetails): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.accountType) errors.accountType = 'Select account type'
  if (!data.bankId) errors.bankId = 'Select bank'
  if (!ACCOUNT_NUMBER_PATTERN.test(data.accountNumber))
    errors.accountNumber = 'Enter a valid account number (9–18 digits)'
  if (data.confirmAccountNumber !== data.accountNumber)
    errors.confirmAccountNumber = ACCOUNT_MISMATCH
  if (!IFSC_PATTERN.test(data.ifsc)) errors.ifsc = 'Enter a valid 11-character IFSC code'
  return errors
}

export function validateFatca(data: FatcaDetails): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.placeOfBirth) errors.placeOfBirth = 'Select place of birth'
  if (!data.countryOfBirth) errors.countryOfBirth = 'Select country of birth'
  if (!data.sourceOfWealth) errors.sourceOfWealth = 'Select source of wealth'
  if (!data.incomeSlab) errors.incomeSlab = 'Select income slab'
  if (!data.occupation) errors.occupation = 'Select occupation'
  if (!data.pep) errors.pep = 'Select an option'
  return errors
}

export function isMinor(dateOfBirth: string | undefined) {
  if (!dateOfBirth) return false
  const dob = new Date(dateOfBirth)
  const adult = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate())
  return adult > new Date()
}

export function totalAllocation(nominees: Nominee[]) {
  return nominees.reduce((sum, nominee) => sum + nominee.allocation, 0)
}

export function validateNominees(nominees: Nominee[]): FieldErrors {
  const errors: FieldErrors = {}
  for (const nominee of nominees) {
    if (!nominee.name.trim()) errors[nomineeField(nominee.id, 'name')] = 'Enter nominee name'
    if (!nominee.relationship)
      errors[nomineeField(nominee.id, 'relationship')] = 'Select relationship'
    if (!nominee.dateOfBirth)
      errors[nomineeField(nominee.id, 'dateOfBirth')] = 'Select date of birth'
    if (nominee.allocation <= 0 || nominee.allocation > 100)
      errors[nomineeField(nominee.id, 'allocation')] = 'Enter a percentage between 1 and 100'
    if (isMinor(nominee.dateOfBirth)) {
      if (!nominee.guardianName.trim())
        errors[nomineeField(nominee.id, 'guardianName')] = 'Enter guardian name'
      if (!nominee.guardianRelationship)
        errors[nomineeField(nominee.id, 'guardianRelationship')] = 'Select guardian relationship'
    }
  }
  if (totalAllocation(nominees) !== 100)
    errors.allocation = 'Allocation across nominees must total 100% before you continue.'
  return errors
}
