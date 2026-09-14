import { createApiError } from '@/api/client'
import { env } from '@/config/env'
import { matchesSearch, mock, mockFailure } from '@/mocks'
import { clientById } from '@/mocks/clients'
import { amcById, amcs, fundById } from '@/mocks/funds'
import {
  fdHoldingFor,
  fdProviders,
  fundDetailsList,
  mandatesFor,
  mfHoldingFor,
  toFundDetails,
} from '@/mocks/transact'
import type {
  Amc,
  Client,
  FdHolding,
  FdProvider,
  FundDetails,
  MfHolding,
  OrderRequest,
  PaymentLinkResult,
  SipMandate,
} from '@/types'

export interface FundListRequest {
  amcId?: string | null
  search?: string
}

function rejectWithFieldError<T = never>(field: string, message: string): Promise<T> {
  return new Promise((_resolve, reject) => {
    setTimeout(
      () =>
        reject(
          createApiError({
            status: 400,
            code: 'VALIDATION_ERROR',
            message,
            fieldErrors: { [field]: message },
          }),
        ),
      env.mockDelayMs,
    )
  })
}

function nextOrderId() {
  return `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`
}

function paymentLink(
  order: OrderRequest,
  client: Client,
  title: string,
): Promise<PaymentLinkResult> {
  const orderId = nextOrderId()
  return mock(
    {
      orderId,
      title,
      amount: order.amount,
      link: `https://pay.octaraa.com/o/${orderId.toLowerCase()}`,
      sentTo: { mobile: client.mobile, email: client.email },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    900,
  )
}

export const transactApi = {
  client(clientId: string): Promise<Client> {
    const client = clientById(clientId)
    return client ? mock(client) : mockFailure('Client not found')
  },

  amcs(): Promise<Amc[]> {
    return mock(amcs.toSorted((a, b) => a.name.localeCompare(b.name)))
  },

  funds(request: FundListRequest = {}): Promise<FundDetails[]> {
    const rows = fundDetailsList
      .filter(
        (fund) =>
          (!request.amcId || fund.amcId === request.amcId) &&
          matchesSearch(request.search ?? '', [
            fund.name,
            fund.category,
            fund.assetClass,
            amcById(fund.amcId)?.name,
          ]),
      )
      .toSorted((a, b) => a.name.localeCompare(b.name))
    return mock(rows, 250)
  },

  fund(fundId: string): Promise<FundDetails> {
    const fund = fundById(fundId)
    return fund ? mock(toFundDetails(fund)) : mockFailure('Fund not found')
  },

  mfHolding(clientId: string, fundId: string): Promise<MfHolding | null> {
    return mock(mfHoldingFor(clientId, fundId), 600)
  },

  mandates(clientId: string): Promise<SipMandate[]> {
    return mock(mandatesFor(clientId))
  },

  fdProviders(): Promise<FdProvider[]> {
    return mock(fdProviders)
  },

  fdHolding(clientId: string, providerId: string): Promise<FdHolding | null> {
    return mock(fdHoldingFor(clientId, providerId), 600)
  },

  sendPaymentLink(order: OrderRequest): Promise<PaymentLinkResult> {
    const client = clientById(order.clientId)
    if (!client) return mockFailure('Client not found')
    if (client.kycStatus === 'rejected' || client.kycStatus === 'expired') {
      return mockFailure(
        `Payment links can only be sent to KYC-verified clients. ${client.name}'s KYC is ${client.kycStatus}.`,
      )
    }

    if (order.product === 'mutual-funds') {
      const fund = fundById(order.fundId)
      if (!fund) return mockFailure('Fund not found')
      const minimum = order.orderType === 'sip' ? fund.minSip : fund.minLumpsum
      if (order.side === 'buy' && order.amount < minimum) {
        return rejectWithFieldError(
          'amount',
          `Minimum ${order.orderType === 'sip' ? 'SIP' : 'investment'} for this fund is ₹${minimum.toLocaleString('en-IN')}.`,
        )
      }
      if (order.orderType === 'sip' && !order.sip?.mandateId) {
        return rejectWithFieldError('mandateId', 'Select an auto mandate to set up the SIP.')
      }
      const prefix =
        order.side === 'sell' ? 'Redemption' : order.orderType === 'sip' ? 'SIP' : 'Lumpsum'
      return paymentLink(order, client, `${prefix} · ${fund.name}`)
    }

    const provider = fdProviders.find((item) => item.id === order.providerId)
    if (!provider) return mockFailure('Fixed deposit provider not found')
    if (order.amount < provider.minAmount) {
      return rejectWithFieldError(
        'amount',
        `Minimum deposit with ${provider.bank} is ₹${provider.minAmount.toLocaleString('en-IN')}.`,
      )
    }
    const scheme = provider.schemes.find((item) => item.id === order.schemeId)
    return paymentLink(order, client, `${scheme?.name ?? 'Fixed Deposit'} · ${provider.bank}`)
  },
}
