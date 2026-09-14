import { matchesSearch, mock, mockFailure, paginate } from '@/mocks'
import {
  activeClients,
  addClient,
  addFamilyMember,
  addMandate,
  clientByPan,
  clientProfileById,
  familyCandidates,
  familyFor,
  mandatesFor,
  panLookup,
  portfolioFor,
  removeClient,
  removeFamilyMember,
  removeMandate,
  reportFor,
} from '@/mocks/clientDetails'
import { PAN_PATTERN } from '@/lib/validation'
import type {
  AddFamilyMemberInput,
  AutoMandate,
  ClientListSummary,
  ClientPortfolio,
  ClientProfile,
  ClientReport,
  CreateAutoMandateInput,
  FamilyCandidate,
  FamilyMember,
  ListRequest,
  OnboardClientInput,
  OtpChannel,
  OtpSendResult,
  Paginated,
  PanVerification,
  ResendLinkResult,
} from '@/types'

const VALID_OTP = '123456'
const OTP_EXPIRY_SECONDS = 45

export const clientsApi = {
  list: (request: ListRequest): Promise<Paginated<ClientProfile>> => {
    const kyc = request.filters?.kyc
    const rows = activeClients()
      .filter((client) => !kyc || kyc === 'all' || client.kycStatus === kyc)
      .filter((client) =>
        matchesSearch(request.search ?? '', [client.name, client.pan, client.id, client.email]),
      )
      .toSorted((a, b) => a.name.localeCompare(b.name))
    return mock(paginate(rows, request.page, request.limit))
  },

  summary: (): Promise<ClientListSummary> => {
    const rows = activeClients()
    return mock({
      total: rows.length,
      pendingKyc: rows.filter((client) => client.kycStatus === 'pending').length,
    })
  },

  get: (id: string): Promise<ClientProfile> => {
    const client = clientProfileById(id)
    return client ? mock(client) : mockFailure('Client not found')
  },

  remove: (id: string): Promise<{ id: string }> => {
    if (!clientProfileById(id)) return mockFailure('Client not found')
    removeClient(id)
    return mock({ id })
  },

  resendLink: (ids: string[]): Promise<ResendLinkResult> =>
    ids.length === 0 ? mockFailure('Select at least one client') : mock({ sent: ids.length }),

  sendOtp: (channel: OtpChannel, target: string): Promise<OtpSendResult> =>
    target.trim()
      ? mock({ channel, expiresInSeconds: OTP_EXPIRY_SECONDS })
      : mockFailure('Enter a value to send the code to'),

  verifyOtp: (channel: OtpChannel, code: string): Promise<{ channel: OtpChannel }> =>
    code === VALID_OTP ? mock({ channel }) : mockFailure('Invalid code'),

  verifyPan: (pan: string): Promise<PanVerification> => {
    const value = pan.trim().toUpperCase()
    if (!PAN_PATTERN.test(value)) return mockFailure('Enter a valid 10-character PAN')
    if (clientByPan(value)) return mockFailure('A client with this PAN already exists')
    return mock(panLookup(value), 900)
  },

  onboard: (input: OnboardClientInput): Promise<ClientProfile> => {
    if (clientByPan(input.pan)) return mockFailure('A client with this PAN already exists')
    return mock(addClient(input))
  },

  portfolio: (id: string): Promise<ClientPortfolio> => {
    const client = clientProfileById(id)
    return client ? mock(portfolioFor(client)) : mockFailure('Client not found')
  },

  report: (id: string): Promise<ClientReport> => {
    const client = clientProfileById(id)
    return client ? mock(reportFor(client)) : mockFailure('Client not found')
  },

  mandates: {
    list: (clientId: string): Promise<AutoMandate[]> => {
      const client = clientProfileById(clientId)
      return client ? mock(mandatesFor(client)) : mockFailure('Client not found')
    },
    create: (clientId: string, input: CreateAutoMandateInput): Promise<AutoMandate> => {
      const client = clientProfileById(clientId)
      if (!client) return mockFailure('Client not found')
      if (input.accountNumber.endsWith('0000')) {
        return mockFailure('We could not verify this bank account. Check the number and try again.')
      }
      return mock(addMandate(client, input), 900)
    },
    remove: (clientId: string, mandateId: string): Promise<{ id: string }> => {
      const client = clientProfileById(clientId)
      if (!client) return mockFailure('Client not found')
      removeMandate(client, mandateId)
      return mock({ id: mandateId })
    },
  },

  family: {
    list: (clientId: string): Promise<FamilyMember[]> => {
      const client = clientProfileById(clientId)
      return client ? mock(familyFor(client)) : mockFailure('Client not found')
    },
    candidates: (clientId: string): Promise<FamilyCandidate[]> => {
      const client = clientProfileById(clientId)
      return client ? mock(familyCandidates(client)) : mockFailure('Client not found')
    },
    add: (clientId: string, input: AddFamilyMemberInput): Promise<FamilyMember> => {
      const client = clientProfileById(clientId)
      if (!client) return mockFailure('Client not found')
      if (!input.candidateId) return mockFailure('Choose a family member')
      return mock(addFamilyMember(client, input))
    },
    remove: (clientId: string, memberId: string): Promise<{ id: string }> => {
      const client = clientProfileById(clientId)
      if (!client) return mockFailure('Client not found')
      removeFamilyMember(client, memberId)
      return mock({ id: memberId })
    },
  },
}
