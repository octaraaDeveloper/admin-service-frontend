import { Check, ChevronRight, Forward, Trash2, X } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'

import { Avatar, Button, Modal } from '@/components/ui'
import { formatCurrency, formatDateTime, formatDecimal, formatPercent } from '@/lib/format'
import { cn, pluralize } from '@/lib/utils'
import type { Transaction, TransactionEvent } from '@/types'

import { orderTypeLabels } from '../labels'
import { AssetBadge, TransactionStatusBadge } from './TransactionsTable'

interface TransactionDetailsModalProps {
  /** `null` closes the modal; the last transaction stays rendered for the exit animation. */
  transaction: Transaction | null
  onClose: () => void
  showClient: boolean
  onResend: (row: Transaction) => void
  onCancel: (row: Transaction) => void
  resending?: boolean
}

function Detail({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-text-primary">{children}</dd>
    </div>
  )
}

const markerStyles: Record<TransactionEvent['state'], string> = {
  done: 'border-success bg-success text-white',
  current: 'border-warning bg-warning-tint text-warning',
  failed: 'border-danger bg-danger text-white',
  upcoming: 'border-border-strong bg-surface-raised',
}

function TimelineItem({ event, last }: { event: TransactionEvent; last: boolean }) {
  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      {!last && <span className="absolute top-5 bottom-0 left-2 w-px bg-border" aria-hidden />}
      <span
        className={cn(
          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 [&_svg]:size-2.5 [&_svg]:stroke-[3]',
          markerStyles[event.state],
        )}
        aria-hidden
      >
        {event.state === 'done' && <Check />}
        {event.state === 'failed' && <X />}
        {event.state === 'current' && <span className="size-1.5 rounded-full bg-current" />}
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            'text-sm font-medium',
            event.state === 'upcoming' ? 'text-text-muted' : 'text-text-primary',
          )}
        >
          {event.label}
        </p>
        {event.description && <p className="text-xs text-text-secondary">{event.description}</p>}
        {event.at && <p className="mt-0.5 text-xs text-text-muted">{formatDateTime(event.at)}</p>}
      </div>
    </li>
  )
}

export function TransactionDetailsModal({
  transaction,
  onClose,
  showClient,
  onResend,
  onCancel,
  resending,
}: TransactionDetailsModalProps) {
  // Keep the last transaction so the dialog can animate out after `transaction` becomes null.
  const [current, setCurrent] = useState(transaction)
  if (transaction && transaction !== current) setCurrent(transaction)
  if (!current) return null

  const pending = current.status === 'pending'

  return (
    <Modal
      open={Boolean(transaction)}
      onClose={onClose}
      title="Order details"
      description={current.id}
      footer={
        pending ? (
          <>
            <Button
              variant="outline"
              leftIcon={<Forward />}
              onClick={() => onResend(current)}
              loading={resending}
            >
              Resend link
            </Button>
            <Button variant="danger" leftIcon={<Trash2 />} onClick={() => onCancel(current)}>
              Cancel order
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )
      }
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3 rounded-card bg-surface-sunken p-4">
          <div>
            <p className="text-xs text-text-muted">{orderTypeLabels[current.orderType]}</p>
            <p className="mt-0.5 text-xl font-semibold text-text-primary">
              {formatCurrency(current.amount)}
            </p>
            <p className="mt-1 text-xs text-text-muted">{formatDateTime(current.createdAt)}</p>
          </div>
          <TransactionStatusBadge status={current.status} />
        </div>

        {showClient && (
          <Link
            to={`/clients/${current.clientId}`}
            className="flex items-center gap-3 rounded-control border border-border p-3 focus-ring transition-colors hover:bg-surface-sunken"
          >
            <Avatar name={current.clientName} src={current.clientAvatarUrl} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-text-primary">
                {current.clientName}
              </span>
              <span className="block text-xs text-text-muted">{current.clientId}</span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-text-muted" />
          </Link>
        )}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          <Detail label="Asset" className="col-span-2">
            <span className="flex items-center gap-2">
              <AssetBadge asset={current.asset} />
              <span className="truncate">{current.assetName}</span>
            </span>
            <span className="mt-0.5 block text-xs font-normal text-text-muted">
              {current.assetMeta}
            </span>
          </Detail>
          {current.asset === 'MF' ? (
            <>
              <Detail label="Units">
                {current.units === null ? '—' : formatDecimal(current.units)}
              </Detail>
              <Detail label="NAV">
                {current.nav === null ? '—' : `₹${formatDecimal(current.nav)}`}
              </Detail>
            </>
          ) : (
            <>
              <Detail label="Tenure">
                {current.tenureMonths === null
                  ? '—'
                  : `${current.tenureMonths} ${pluralize(current.tenureMonths, 'month')}`}
              </Detail>
              <Detail label="Interest rate">
                {current.interestRate === null
                  ? '—'
                  : `${formatPercent(current.interestRate, 2)} p.a.`}
              </Detail>
            </>
          )}
          <Detail label="Payment mode">{current.paymentMode}</Detail>
          <Detail label="Placed on">{formatDateTime(current.createdAt)}</Detail>
        </dl>

        {current.failureReason && (
          <p className="rounded-control border border-danger/30 bg-danger-tint px-3 py-2 text-sm text-danger">
            {current.failureReason}
          </p>
        )}

        <section>
          <h3 className="text-sm font-semibold text-text-primary">Timeline</h3>
          <ol className="mt-3">
            {current.timeline.map((event, index) => (
              <TimelineItem
                key={event.label}
                event={event}
                last={index === current.timeline.length - 1}
              />
            ))}
          </ol>
        </section>
      </div>
    </Modal>
  )
}
