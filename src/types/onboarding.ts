export type Gender = 'male' | 'female' | 'other'
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed'
export type Nationality = 'indian' | 'nri' | 'foreign'
export type YesNo = 'yes' | 'no'
export type BankAccountType = 'savings' | 'current'
export type SourceOfWealth = 'salary' | 'business' | 'investments' | 'inheritance'
export type IncomeSlab = 'below-1l' | '1-5l' | '5-10l' | '10-25l' | '25-50l' | 'above-50l'
export type Occupation = 'salaried' | 'self-employed' | 'business' | 'professional' | 'retired'
export type NomineeRelationship =
  'spouse' | 'son' | 'daughter' | 'father' | 'mother' | 'brother' | 'sister' | 'other'

export interface PersonalDetails {
  firstName: string
  lastName: string
  gender: Gender | undefined
  maritalStatus: MaritalStatus | undefined
  address: string
  nationality: Nationality | undefined
  country: string | undefined
  pep: YesNo | undefined
}

export interface BankDetails {
  accountType: BankAccountType | undefined
  bankId: string | undefined
  accountNumber: string
  confirmAccountNumber: string
  ifsc: string
}

export interface FatcaDetails {
  placeOfBirth: string | undefined
  countryOfBirth: string | undefined
  sourceOfWealth: SourceOfWealth | undefined
  incomeSlab: IncomeSlab | undefined
  occupation: Occupation | undefined
  pep: YesNo | undefined
}

export interface Nominee {
  id: string
  name: string
  relationship: NomineeRelationship | undefined
  dateOfBirth: string | undefined
  allocation: number
  guardianName: string
  guardianRelationship: NomineeRelationship | undefined
}

export interface NomineeDetails {
  nominees: Nominee[]
}

export interface OnboardingData {
  personal: PersonalDetails
  bank: BankDetails
  fatca: FatcaDetails
  nominees: NomineeDetails
}

export type OnboardingStep = keyof OnboardingData

export interface Bank {
  id: string
  name: string
  initials: string
  color: string
}

export interface OnboardingOption<T extends string = string> {
  value: T
  label: string
}

export interface OnboardingFormOptions {
  genders: OnboardingOption<Gender>[]
  maritalStatuses: OnboardingOption<MaritalStatus>[]
  nationalities: OnboardingOption<Nationality>[]
  countries: OnboardingOption[]
  cities: OnboardingOption[]
  accountTypes: OnboardingOption<BankAccountType>[]
  banks: Bank[]
  sourcesOfWealth: OnboardingOption<SourceOfWealth>[]
  incomeSlabs: OnboardingOption<IncomeSlab>[]
  occupations: OnboardingOption<Occupation>[]
  relationships: OnboardingOption<NomineeRelationship>[]
  yesNo: OnboardingOption<YesNo>[]
}

export interface BankVerification {
  accountHolderName: string
  bankName: string
  accountNumber: string
  ifsc: string
  verifiedAt: string
}

export interface StepSaveResult {
  clientId: string
  step: OnboardingStep
  savedAt: string
}

export interface VerificationLinkResult {
  email: string
  mobile: string
  sentAt: string
}
