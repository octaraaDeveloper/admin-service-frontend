import { CheckCircle2, Copy } from 'lucide-react'
import { Button, LinkButton, Modal } from '@/components/ui'
import { formatCurrency, formatDateTime } from '@/lib/format'
import { toast } from '@/store/toast'
import type { Client, PaymentLinkResult } from '@/types'

interface PaymentLinkSentModalProps {
  result: PaymentLinkResult | null
  client: Client
  onDone: () => void
}

export function PaymentLinkSentModal({ result, client, onDone }: PaymentLinkSentModalProps) {
  const copy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.link)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Could not copy the link. Please copy it manually.')
    }
  }

  return (
    <Modal
      open={Boolean(result)}
      onClose={onDone}
      title="Payment link sent"
      description={`${client.name} will receive the link on SMS and email.`}
      size="sm"
      footer={
        <>
          <LinkButton to={`/clients/${client.id}/transactions`} variant="outline">
            View transactions
          </LinkButton>
          <Button onClick={onDone}>Done</Button>
        </>
      }
    >
      {result && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-control bg-success-tint px-3.5 py-3 text-sm text-success">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <p>
              Sent to <span className="font-semibold">{result.sentTo.mobile}</span> and{' '}
              <span className="font-semibold break-all">{result.sentTo.email}</span>
            </p>
          </div>
          <dl className="divide-y divide-border text-sm">
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-text-muted">Order</dt>
              <dd className="text-right font-medium text-text-primary">{result.title}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-text-muted">Amount</dt>
              <dd className="font-medium text-text-primary tabular-nums">
                {formatCurrency(result.amount)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-text-muted">Order ID</dt>
              <dd className="font-medium text-text-primary">{result.orderId}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-text-muted">Link expires</dt>
              <dd className="text-right font-medium text-text-primary">
                {formatDateTime(result.expiresAt)}
              </dd>
            </div>
          </dl>
          <div className="flex items-center gap-2 rounded-control border border-border bg-surface-sunken px-3 py-2">
            <code className="min-w-0 flex-1 truncate text-xs text-text-secondary">
              {result.link}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copy}
              leftIcon={<Copy className="size-3.5" />}
            >
              Copy
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
