import { Landmark, Trash2 } from 'lucide-react'
import { Card, IconButton } from '@/components/ui'
import { formatCurrency, formatDate, formatMonthYear } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AutoMandate } from '@/types'

const statusClass: Record<AutoMandate['status'], string> = {
  Active: 'text-success',
  Processing: 'text-warning',
}

export function MandateCard({
  mandate,
  onDelete,
}: {
  mandate: AutoMandate
  onDelete: (mandate: AutoMandate) => void
}) {
  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
          <Landmark className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="truncate text-base font-semibold text-text-primary md:text-md">
              #{mandate.umrn}
            </p>
            <span
              className={cn(
                'flex shrink-0 items-center gap-1.5 text-sm font-medium',
                statusClass[mandate.status],
              )}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {mandate.status}
            </span>
          </div>

          <dl className="mt-3 hidden text-sm text-text-secondary md:block">
            <dd>
              {mandate.bank} • {mandate.accountLast4}
            </dd>
            <dd className="mt-1">
              {formatCurrency(mandate.amountLimit)} • Valid till{' '}
              {formatMonthYear(mandate.validTill)}
            </dd>
          </dl>

          <dl className="mt-3 grid grid-cols-3 gap-2 text-sm md:hidden">
            <div>
              <dt className="text-2xs font-semibold tracking-wide text-text-muted uppercase">
                Bank
              </dt>
              <dd className="mt-0.5 font-medium text-text-primary">
                {mandate.bank} • {mandate.accountLast4}
              </dd>
            </div>
            <div>
              <dt className="text-2xs font-semibold tracking-wide text-text-muted uppercase">
                Amount
              </dt>
              <dd className="mt-0.5 font-medium text-text-primary tabular-nums">
                {formatCurrency(mandate.amountLimit)}
              </dd>
            </div>
            <div>
              <dt className="text-2xs font-semibold tracking-wide text-text-muted uppercase">
                Validity
              </dt>
              <dd className="mt-0.5 font-medium text-text-primary">
                {formatMonthYear(mandate.validTill)}
              </dd>
            </div>
          </dl>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-text-muted">Created on {formatDate(mandate.createdAt)}</p>
            <IconButton
              label="Delete mandate"
              size="sm"
              variant="danger"
              onClick={() => onDelete(mandate)}
            >
              <Trash2 className="size-4" />
            </IconButton>
          </div>
        </div>
      </div>
    </Card>
  )
}
