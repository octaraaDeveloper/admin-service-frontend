import { mock, mockFailure } from '@/mocks'
import { clientById } from '@/mocks/clients'
import { buildOnboardingDraft, onboardingDrafts, onboardingFormOptions } from '@/mocks/onboarding'
import { maskAccountNumber } from '@/lib/utils'
import type {
  BankDetails,
  BankVerification,
  OnboardingData,
  OnboardingFormOptions,
  OnboardingStep,
  StepSaveResult,
  VerificationLinkResult,
} from '@/types'

const PENNY_DROP_DELAY_MS = 1500

export const onboardingApi = {
  getFormOptions: (): Promise<OnboardingFormOptions> => mock(onboardingFormOptions),

  getDraft: (clientId: string): Promise<OnboardingData> => {
    const client = clientById(clientId)
    if (!client) return mockFailure('Client not found')
    return mock(onboardingDrafts.get(clientId) ?? buildOnboardingDraft(client))
  },

  saveStep: <S extends OnboardingStep>(
    clientId: string,
    step: S,
    data: OnboardingData[S],
  ): Promise<StepSaveResult> => {
    const client = clientById(clientId)
    if (!client) return mockFailure('Client not found')
    const draft = onboardingDrafts.get(clientId) ?? buildOnboardingDraft(client)
    onboardingDrafts.set(clientId, { ...draft, [step]: structuredClone(data) })
    return mock({ clientId, step, savedAt: new Date().toISOString() })
  },

  verifyBank: (clientId: string, details: BankDetails): Promise<BankVerification> => {
    const client = clientById(clientId)
    const bank = onboardingFormOptions.banks.find((item) => item.id === details.bankId)
    if (!client || !bank) return mockFailure('Bank details are incomplete', PENNY_DROP_DELAY_MS)
    if (details.accountNumber.endsWith('0000')) {
      return mockFailure(
        'We could not verify this account. Check the account number and IFSC code, then try again.',
        PENNY_DROP_DELAY_MS,
      )
    }
    return mock(
      {
        accountHolderName: client.name.toUpperCase(),
        bankName: bank.name,
        accountNumber: maskAccountNumber(details.accountNumber),
        ifsc: details.ifsc,
        verifiedAt: new Date().toISOString(),
      },
      PENNY_DROP_DELAY_MS,
    )
  },

  sendVerificationLink: (clientId: string): Promise<VerificationLinkResult> => {
    const client = clientById(clientId)
    if (!client) return mockFailure('Client not found')
    return mock({ email: client.email, mobile: client.mobile, sentAt: new Date().toISOString() })
  },
}
