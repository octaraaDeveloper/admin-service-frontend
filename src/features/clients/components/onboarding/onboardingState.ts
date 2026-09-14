import type {
  BankVerification,
  Nominee,
  OnboardingData,
  OnboardingStep,
  VerificationLinkResult,
} from '@/types'

export const ONBOARDING_STEPS = [
  { key: 'personal', title: 'Personal Details', label: 'Personal' },
  { key: 'bank', title: 'Bank Details', label: 'Bank' },
  { key: 'fatca', title: 'FATCA Details', label: 'FATCA' },
  { key: 'nominees', title: 'Nominee details', label: 'Nominees' },
  { key: 'verification', title: 'Send Verification Link', label: 'Verify' },
] as const

export const MAX_NOMINEES = 3

export type FieldErrors = Record<string, string>
export type BankPhase = 'form' | 'verifying' | 'verified'

export interface WizardState {
  stepIndex: number
  data: OnboardingData
  errors: FieldErrors
  /** Incremented every time validation fails, so steps can react (e.g. expand the invalid card). */
  validationCount: number
  bankPhase: BankPhase
  bankVerification: BankVerification | null
  linkResult: VerificationLinkResult | null
}

type UpdateAction = {
  [S in Exclude<OnboardingStep, 'nominees'>]: {
    type: 'update'
    step: S
    patch: Partial<OnboardingData[S]>
  }
}[Exclude<OnboardingStep, 'nominees'>]

export type WizardAction =
  | UpdateAction
  | { type: 'update-nominee'; id: string; patch: Partial<Nominee> }
  | { type: 'add-nominee' }
  | { type: 'remove-nominee'; id: string }
  | { type: 'set-errors'; errors: FieldErrors }
  | { type: 'go'; stepIndex: number }
  | { type: 'bank-phase'; phase: BankPhase; verification?: BankVerification }
  | { type: 'link-sent'; result: VerificationLinkResult }
  | { type: 'reset'; data: OnboardingData }

export function createWizardState(data: OnboardingData): WizardState {
  return {
    stepIndex: 0,
    data,
    errors: {},
    validationCount: 0,
    bankPhase: 'form',
    bankVerification: null,
    linkResult: null,
  }
}

export function nomineeField(id: string, field: keyof Nominee) {
  return `${id}.${field}`
}

function emptyNominee(index: number, allocation: number): Nominee {
  return {
    id: `nominee-${index}-${Date.now()}`,
    name: '',
    relationship: undefined,
    dateOfBirth: undefined,
    allocation,
    guardianName: '',
    guardianRelationship: undefined,
  }
}

function withoutKeys(errors: FieldErrors, keys: string[]) {
  if (!keys.some((key) => key in errors)) return errors
  const next = { ...errors }
  for (const key of keys) delete next[key]
  return next
}

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        data: {
          ...state.data,
          [action.step]: { ...state.data[action.step], ...action.patch },
        },
        errors: withoutKeys(state.errors, Object.keys(action.patch)),
        bankPhase: action.step === 'bank' ? 'form' : state.bankPhase,
        bankVerification: action.step === 'bank' ? null : state.bankVerification,
      }
    case 'update-nominee':
      return {
        ...state,
        data: {
          ...state.data,
          nominees: {
            nominees: state.data.nominees.nominees.map((nominee) =>
              nominee.id === action.id ? { ...nominee, ...action.patch } : nominee,
            ),
          },
        },
        errors: withoutKeys(state.errors, [
          'allocation',
          ...Object.keys(action.patch).map((key) => nomineeField(action.id, key as keyof Nominee)),
        ]),
      }
    case 'add-nominee': {
      const current = state.data.nominees.nominees
      if (current.length >= MAX_NOMINEES) return state
      const allocated = current.reduce((sum, nominee) => sum + nominee.allocation, 0)
      const remaining = Math.max(0, 100 - allocated)
      return {
        ...state,
        data: {
          ...state.data,
          nominees: { nominees: [...current, emptyNominee(current.length + 1, remaining)] },
        },
        errors: withoutKeys(state.errors, ['allocation']),
      }
    }
    case 'remove-nominee':
      return {
        ...state,
        data: {
          ...state.data,
          nominees: {
            nominees: state.data.nominees.nominees.filter((nominee) => nominee.id !== action.id),
          },
        },
        errors: withoutKeys(state.errors, ['allocation']),
      }
    case 'set-errors':
      return { ...state, errors: action.errors, validationCount: state.validationCount + 1 }
    case 'go':
      return { ...state, stepIndex: action.stepIndex, errors: {} }
    case 'bank-phase':
      return {
        ...state,
        bankPhase: action.phase,
        bankVerification:
          action.verification ?? (action.phase === 'verified' ? state.bankVerification : null),
      }
    case 'link-sent':
      return { ...state, linkResult: action.result }
    case 'reset':
      return createWizardState(action.data)
  }
}
