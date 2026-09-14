import { AlertTriangle, Info, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { transactApi } from '@/api/transact'
import { RadioGroup, SegmentedControl, Select, Skeleton, Tooltip } from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatDate, formatDecimal } from '@/lib/format'
import type {
  Amc,
  Client,
  FundDetails,
  MfOrderRequest,
  MfOrderType,
  OrderSide,
  SipFrequency,
} from '@/types'
import { AmcMark } from './AmcMark'
import { AmountField } from './AmountField'
import { estimateUnits, nextSipDate } from './calculations'
import { ExistingInvestmentCard, MfHoldingDetails } from './ExistingInvestmentCard'
import { FundPicker } from './FundPicker'
import { InvestmentSummary, type SummaryRow, type SummaryTile } from './InvestmentSummary'
import {
  orderTypeLabels,
  orderTypeOptions,
  ordinal,
  sideOptions,
  sipDayOptions,
  sipFrequencyLabels,
  sipFrequencyOptions,
} from './options'
import { OrderLayout } from './OrderLayout'
import { PaymentLinkSentModal } from './PaymentLinkSentModal'
import { usePaymentLink } from './usePaymentLink'

interface MfFormState {
  orderType: MfOrderType
  side: OrderSide
  amcId: string | null
  fund: FundDetails | null
  amount: number
  frequency: SipFrequency
  sipDay: string
  mandateId: string | null
}

const initialState: MfFormState = {
  orderType: 'lumpsum',
  side: 'buy',
  amcId: null,
  fund: null,
  amount: 0,
  frequency: 'monthly',
  sipDay: '1',
  mandateId: null,
}

const buyOnly = sideOptions.filter((option) => option.value === 'buy')
const noAmcs: Amc[] = []

function LabelWithInfo({ label, info }: { label: string; info: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <Tooltip content={info}>
        <button
          type="button"
          aria-label={`About ${label.toLowerCase()}`}
          className="rounded-full text-text-muted focus-ring hover:text-text-primary"
        >
          <Info className="size-3.5" />
        </button>
      </Tooltip>
    </span>
  )
}

export function MutualFundForm({ client }: { client: Client }) {
  const [state, setState] = useState<MfFormState>(initialState)
  const update = (patch: Partial<MfFormState>) => setState((current) => ({ ...current, ...patch }))

  const isSip = state.orderType === 'sip'
  const isSell = state.side === 'sell'
  const fundId = state.fund?.id ?? null

  const { data: amcData } = useQuery('transact:amcs', transactApi.amcs)
  const amcs = amcData ?? noAmcs
  const { data: mandates, loading: mandatesLoading } = useQuery(
    `transact:mandates:${client.id}`,
    () => transactApi.mandates(client.id),
    isSip,
  )
  const { data: holding, loading: holdingLoading } = useQuery(
    `transact:mf-holding:${client.id}:${fundId ?? 'none'}`,
    () => transactApi.mfHolding(client.id, fundId ?? ''),
    Boolean(fundId),
  )

  const { send, loading: sending, error, reset, result, clearResult } = usePaymentLink()

  const selectedMandateId =
    state.mandateId ?? mandates?.find((mandate) => mandate.status === 'active')?.id ?? null
  const selectedMandate = mandates?.find((mandate) => mandate.id === selectedMandateId)
  const minimum = state.fund ? (isSip ? state.fund.minSip : state.fund.minLumpsum) : undefined

  let amountError: string | undefined
  if (state.fund && state.amount > 0) {
    if (!isSell && minimum !== undefined && state.amount < minimum) {
      amountError = `Minimum ${isSip ? 'SIP' : 'investment'} for this fund is ${formatCurrency(minimum)}`
    } else if (isSell && holding && state.amount > holding.currentValue) {
      amountError = `Exceeds the current value of ${formatCurrency(holding.currentValue)}`
    } else if (isSip && selectedMandate && state.amount > selectedMandate.limit) {
      amountError = `Exceeds the mandate limit of ${formatCurrency(selectedMandate.limit)}`
    }
  }
  const sellBlocked = isSell && holding === null
  const canSubmit =
    Boolean(state.fund) &&
    state.amount > 0 &&
    !amountError &&
    !sellBlocked &&
    (!isSip || Boolean(selectedMandateId))

  const clear = () => {
    setState(initialState)
    reset()
  }

  const submit = async () => {
    if (!state.fund) return
    const order: MfOrderRequest = {
      product: 'mutual-funds',
      clientId: client.id,
      fundId: state.fund.id,
      side: state.side,
      orderType: state.orderType,
      amount: state.amount,
      sip: isSip
        ? { frequency: state.frequency, day: Number(state.sipDay), mandateId: selectedMandateId }
        : null,
    }
    await send(order)
  }

  const units = state.fund && state.amount > 0 ? estimateUnits(state.amount, state.fund.nav) : null
  const tiles: SummaryTile[] = [
    {
      label: isSell ? 'Redemption Amount' : 'Investment Amount',
      value: state.amount > 0 ? formatCurrency(state.amount) : '—',
    },
    { label: 'Estimated Units', value: units ? `~ ${formatDecimal(units)}` : '—' },
    {
      label: state.fund ? `NAV (${formatDate(state.fund.navDate)})` : 'NAV',
      value: state.fund ? `₹${formatDecimal(state.fund.nav)}` : '—',
    },
    {
      label: 'Order Type',
      value: orderTypeLabels[state.orderType],
      hint: isSip
        ? `${sipFrequencyLabels[state.frequency]} · ${ordinal(Number(state.sipDay))}`
        : isSell
          ? 'Redemption'
          : 'One-time',
    },
  ]
  const rows: SummaryRow[] = isSip
    ? [
        { label: 'First instalment', value: formatDate(nextSipDate(Number(state.sipDay))) },
        {
          label: 'Debited via',
          value: selectedMandate
            ? `${selectedMandate.bankName} ${selectedMandate.accountMasked}`
            : '—',
        },
        {
          label: 'Per instalment',
          value: state.amount > 0 ? formatCurrency(state.amount) : '—',
          emphasis: true,
        },
      ]
    : [
        {
          label: isSell ? 'Estimated proceeds' : 'Total payable',
          value: state.amount > 0 ? formatCurrency(state.amount) : '—',
          emphasis: true,
        },
      ]

  const form = (
    <>
      <SegmentedControl
        value={state.orderType}
        onChange={(orderType) => update({ orderType, side: 'buy' })}
        options={orderTypeOptions}
        size="md"
        className="flex w-full p-1 sm:w-64 [&>button]:flex-1 [&>button]:py-2"
      />
      <RadioGroup
        label="Select transaction type"
        value={state.side}
        onChange={(side) => update({ side })}
        options={isSip ? buyOnly : sideOptions}
      />
      <Select
        size="lg"
        label={
          <LabelWithInfo
            label="Fund house"
            info="Filter mutual funds by the asset management company that runs them."
          />
        }
        placeholder="Select fund house"
        value={state.amcId}
        onChange={(amcId) => {
          update({ amcId, fund: state.fund?.amcId === amcId ? state.fund : null })
        }}
        options={amcs.map((amc) => ({
          value: amc.id,
          label: (
            <span className="inline-flex items-center gap-2">
              <AmcMark amc={amc} size="xs" />
              {amc.name}
            </span>
          ),
        }))}
      />
      <FundPicker
        amcId={state.amcId}
        amcs={amcs}
        value={state.fund}
        onChange={(fund) => update({ fund, amcId: fund.amcId })}
        onClearAmc={() => update({ amcId: null })}
      />
      <AmountField
        label={isSip ? 'SIP amount' : isSell ? 'Redemption amount' : 'Investment amount'}
        value={state.amount}
        onChange={(amount) => update({ amount })}
        minimum={isSell ? undefined : minimum}
        hint={
          isSell
            ? holding
              ? `Available to redeem ${formatCurrency(holding.currentValue)}`
              : 'Enter the amount to redeem'
            : undefined
        }
        error={amountError ?? error?.fieldErrors.amount}
      />
      {sellBlocked && (
        <div className="flex items-start gap-2 rounded-control bg-warning-tint px-3.5 py-3 text-sm text-warning">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            {client.name} doesn&apos;t hold {state.fund?.name}, so there are no units to redeem.
          </p>
        </div>
      )}
      {isSip && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              size="lg"
              label="SIP date"
              value={state.sipDay}
              onChange={(sipDay) => update({ sipDay })}
              options={sipDayOptions}
            />
            <Select
              size="lg"
              label="Frequency"
              value={state.frequency}
              onChange={(frequency) => update({ frequency })}
              options={sipFrequencyOptions}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-text-secondary">
                <LabelWithInfo
                  label="Auto Mandate (eNACH)"
                  info="SIP instalments are auto-debited from the client's bank account through this mandate."
                />
              </p>
              <Link
                to={`/clients/${client.id}/auto-mandate`}
                className="inline-flex items-center gap-1 rounded text-xs font-medium text-brand focus-ring hover:underline"
              >
                <Plus className="size-3.5" />
                Add mandate
              </Link>
            </div>
            {mandatesLoading && !mandates ? (
              <Skeleton className="h-12" />
            ) : mandates && mandates.length > 0 ? (
              <Select
                size="lg"
                placeholder="Select mandate"
                value={selectedMandateId}
                onChange={(mandateId) => update({ mandateId })}
                options={mandates.map((mandate) => ({
                  value: mandate.id,
                  label: `${mandate.bankName} ${mandate.accountMasked}`,
                  description: `${formatCurrency(mandate.limit)} limit · ${
                    mandate.status === 'active' ? 'Active' : 'Pending approval'
                  }`,
                  disabled: mandate.status !== 'active',
                }))}
                hint={
                  selectedMandate
                    ? `Limit ${formatCurrency(selectedMandate.limit)} · Valid till ${formatDate(selectedMandate.validTill)}`
                    : undefined
                }
                error={error?.fieldErrors.mandateId}
              />
            ) : (
              <div className="flex items-start gap-2 rounded-control bg-info-tint px-3.5 py-3 text-sm text-info">
                <Info className="mt-0.5 size-4 shrink-0" />
                <p>
                  No active mandate for {client.name}. Set up an eNACH mandate to auto-debit SIP
                  instalments.
                </p>
              </div>
            )}
          </div>
        </>
      )}
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
            note={
              isSell
                ? 'Redemption proceeds are credited to the client’s registered bank account in 2–3 working days. Exit load may apply.'
                : 'Units are allotted at the NAV applicable on the day the payment is realised. Estimated units are indicative.'
            }
          />
        }
        aside={
          <ExistingInvestmentCard
            title="Existing Investment"
            portfolioTo={`/clients/${client.id}/portfolio`}
            selected={Boolean(state.fund)}
            loading={holdingLoading}
            held={Boolean(holding)}
            placeholder="Select a mutual fund to see what the client already holds in it."
            emptyTitle="No existing investment"
            emptyDescription={`${client.name} hasn’t invested in ${state.fund?.name ?? 'this fund'} yet.${
              isSell
                ? ' Switch to Buy to place a first order in it.'
                : ' This will be their first order in it.'
            }`}
          >
            {holding && state.fund && <MfHoldingDetails holding={holding} fund={state.fund} />}
          </ExistingInvestmentCard>
        }
        error={error}
        submitLabel={isSell ? 'Send redemption link' : 'Send payment link'}
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
