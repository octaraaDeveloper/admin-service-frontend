import { Landmark } from 'lucide-react'
import { useState } from 'react'
import { transactApi } from '@/api/transact'
import { RadioGroup, Select, Skeleton } from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatDate, formatPercent } from '@/lib/format'
import type { Client, FdMaturityInstruction, FdOrderRequest, FdReturnType } from '@/types'
import { AmountField } from './AmountField'
import { addMonths, projectFixedDeposit } from './calculations'
import { ExistingInvestmentCard, FdHoldingDetails } from './ExistingInvestmentCard'
import { InvestmentSummary, type SummaryRow, type SummaryTile } from './InvestmentSummary'
import {
  maturityInstructionOptions,
  payoutLabels,
  returnTypeOptions,
  sideOptions,
  tenureLabel,
} from './options'
import { OrderLayout } from './OrderLayout'
import { PaymentLinkSentModal } from './PaymentLinkSentModal'
import { usePaymentLink } from './usePaymentLink'

interface FdFormState {
  providerId: string | null
  schemeId: string | null
  tenureMonths: string | null
  returnType: FdReturnType
  maturityInstruction: FdMaturityInstruction | null
  amount: number
}

const initialState: FdFormState = {
  providerId: null,
  schemeId: null,
  tenureMonths: null,
  returnType: 'cumulative',
  maturityInstruction: null,
  amount: 0,
}

const buyOnly = sideOptions.filter((option) => option.value === 'buy')
const round2 = (value: number) => Math.round(value * 100) / 100

const payoutEvery: Partial<Record<FdReturnType, string>> = {
  monthly: 'Payout every month',
  quarterly: 'Payout every quarter',
  'half-yearly': 'Payout every 6 months',
  annual: 'Payout every year',
}

export function FixedDepositForm({ client }: { client: Client }) {
  const [state, setState] = useState<FdFormState>(initialState)
  const update = (patch: Partial<FdFormState>) => setState((current) => ({ ...current, ...patch }))

  const { data: providers, loading: providersLoading } = useQuery(
    'transact:fd-providers',
    transactApi.fdProviders,
  )
  const { data: holding, loading: holdingLoading } = useQuery(
    `transact:fd-holding:${client.id}:${state.providerId ?? 'none'}`,
    () => transactApi.fdHolding(client.id, state.providerId ?? ''),
    Boolean(state.providerId),
  )
  const { send, loading: sending, error, reset, result, clearResult } = usePaymentLink()

  const provider = providers?.find((item) => item.id === state.providerId) ?? null
  const scheme = provider?.schemes.find((item) => item.id === state.schemeId) ?? null
  const tenures = provider
    ? provider.tenures.filter(
        (tenure) => !scheme?.lockInMonths || tenure.months >= scheme.lockInMonths,
      )
    : []
  const tenure = tenures.find((item) => String(item.months) === state.tenureMonths) ?? null
  const rate =
    tenure && scheme
      ? round2((scheme.seniorCitizen ? tenure.seniorCitizenRate : tenure.rate) + scheme.rateBonus)
      : null
  const minimum = provider?.minAmount
  const amountError =
    provider && minimum !== undefined && state.amount > 0 && state.amount < minimum
      ? `Minimum deposit with ${provider.bank} is ${formatCurrency(minimum)}`
      : undefined

  const canSubmit =
    Boolean(provider && scheme && tenure && rate !== null && state.maturityInstruction) &&
    state.amount > 0 &&
    !amountError

  const projection =
    rate !== null && tenure && state.amount > 0
      ? projectFixedDeposit(state.amount, rate, tenure.months, state.returnType)
      : null
  const maturityDate = tenure ? addMonths(new Date(), tenure.months) : null

  const clear = () => {
    setState(initialState)
    reset()
  }

  const submit = async () => {
    if (!provider || !scheme || !tenure || !state.maturityInstruction) return
    const order: FdOrderRequest = {
      product: 'fixed-deposits',
      clientId: client.id,
      providerId: provider.id,
      schemeId: scheme.id,
      amount: state.amount,
      tenureMonths: tenure.months,
      returnType: state.returnType,
      maturityInstruction: state.maturityInstruction,
    }
    await send(order)
  }

  const tiles: SummaryTile[] = [
    { label: 'Deposit Amount', value: state.amount > 0 ? formatCurrency(state.amount) : '—' },
    {
      label: 'Interest Rate (p.a.)',
      value: rate !== null ? formatPercent(rate, 2) : '—',
      hint: scheme?.name,
    },
    {
      label: 'Tenure',
      value: tenure ? tenureLabel(tenure.months) : '—',
      hint: maturityDate ? `Matures ${formatDate(maturityDate)}` : undefined,
    },
    {
      label: 'Return Type',
      value: state.returnType === 'cumulative' ? 'Cumulative' : 'Non-cumulative',
      hint: payoutLabels[state.returnType],
    },
  ]
  const rows: SummaryRow[] = [
    {
      label: 'Interest earned',
      value: projection ? `+${formatCurrency(Math.round(projection.interest))}` : '—',
    },
    ...(projection?.payout
      ? [
          {
            label: payoutEvery[state.returnType] ?? 'Payout',
            value: formatCurrency(Math.round(projection.payout)),
          },
        ]
      : []),
    {
      label: projection && projection.payout ? 'Principal returned at maturity' : 'Maturity amount',
      value: projection ? formatCurrency(Math.round(projection.maturityAmount)) : '—',
      emphasis: true,
    },
  ]

  const form = (
    <>
      <RadioGroup
        label="Select transaction type"
        value="buy"
        onChange={() => {}}
        options={buyOnly}
      />
      {providersLoading && !providers ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      ) : (
        <>
          <Select
            size="lg"
            label="FD name"
            placeholder="Select FD"
            value={state.providerId}
            onChange={(providerId) =>
              update({ providerId, schemeId: 'regular', tenureMonths: null })
            }
            options={(providers ?? []).map((item) => ({
              value: item.id,
              label: (
                <span className="inline-flex items-center gap-2">
                  <Landmark className="size-4 text-text-muted" />
                  {item.bank}
                </span>
              ),
              description: `${item.rating} · up to ${formatPercent(
                Math.max(...item.tenures.map((entry) => entry.rate)),
                2,
              )} p.a. · min ${formatCurrency(item.minAmount)}`,
            }))}
          />
          <Select
            size="lg"
            label="Select scheme"
            placeholder="Select scheme"
            disabled={!provider}
            value={state.schemeId}
            onChange={(schemeId) => {
              const next = provider?.schemes.find((item) => item.id === schemeId)
              const lockIn = next?.lockInMonths ?? 0
              update({
                schemeId,
                tenureMonths:
                  state.tenureMonths && Number(state.tenureMonths) >= lockIn
                    ? state.tenureMonths
                    : null,
              })
            }}
            options={(provider?.schemes ?? []).map((item) => ({
              value: item.id,
              label: item.name,
              description: item.description,
            }))}
          />
        </>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          size="lg"
          label="Maturity instruction"
          placeholder="Select instruction"
          value={state.maturityInstruction}
          onChange={(maturityInstruction) => update({ maturityInstruction })}
          options={maturityInstructionOptions}
        />
        <Select
          size="lg"
          label="Return type"
          value={state.returnType}
          onChange={(returnType) => update({ returnType })}
          options={returnTypeOptions}
        />
      </div>
      <Select
        size="lg"
        label="Choose duration"
        placeholder={provider ? 'Select duration' : 'Select an FD first'}
        disabled={!provider}
        value={state.tenureMonths}
        onChange={(tenureMonths) => update({ tenureMonths })}
        options={tenures.map((item) => ({
          value: String(item.months),
          label: tenureLabel(item.months),
          description: `${formatPercent(
            round2(
              (scheme?.seniorCitizen ? item.seniorCitizenRate : item.rate) +
                (scheme?.rateBonus ?? 0),
            ),
            2,
          )} p.a.`,
        }))}
        hint={
          scheme?.lockInMonths
            ? `${scheme.name} has a ${tenureLabel(scheme.lockInMonths).toLowerCase()} lock-in.`
            : undefined
        }
      />
      <AmountField
        label="Investment amount"
        value={state.amount}
        onChange={(amount) => update({ amount })}
        minimum={minimum}
        hint={minimum === undefined ? 'Select an FD to see the minimum deposit' : undefined}
        error={amountError ?? error?.fieldErrors.amount}
      />
    </>
  )

  return (
    <>
      <OrderLayout
        form={form}
        summary={
          <InvestmentSummary
            tiles={tiles}
            rows={rows}
            note="Interest is compounded quarterly for cumulative deposits. Figures are indicative and exclude TDS."
          />
        }
        aside={
          <ExistingInvestmentCard
            title="Existing Investment"
            portfolioTo={`/clients/${client.id}/portfolio`}
            selected={Boolean(provider)}
            loading={holdingLoading}
            held={Boolean(holding)}
            placeholder="Select an FD provider to see the client’s existing deposits with them."
            emptyTitle="No existing deposit"
            emptyDescription={`${client.name} has no fixed deposit with ${provider?.bank ?? 'this provider'} yet.`}
          >
            {holding && provider && <FdHoldingDetails holding={holding} provider={provider} />}
          </ExistingInvestmentCard>
        }
        error={error}
        submitLabel="Send payment link"
        canSubmit={canSubmit}
        submitting={sending}
        onSubmit={submit}
        onClear={clear}
      />
      <PaymentLinkSentModal
        result={result}
        client={client}
        onDone={() => {
          clearResult()
          clear()
        }}
      />
    </>
  )
}
