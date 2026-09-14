import { ArrowRight, Check } from 'lucide-react'
import { fundsApi } from '@/api/funds'
import { ErrorState } from '@/components/common/states'
import {
  Avatar,
  Badge,
  Button,
  LinkButton,
  Modal,
  Skeleton,
  Table,
  TableScroll,
  TableWrapper,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatPercent } from '@/lib/format'
import { cn, pluralize } from '@/lib/utils'
import type { FixedDepositDetails } from '@/types'
import { DetailList } from './DetailList'

interface FdDetailsModalProps {
  schemeId: string | null
  onClose: () => void
}

function RateTile({
  label,
  value,
  highlight,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div className="rounded-card border border-border bg-surface-sunken px-3 py-2.5">
      <p className="text-xs text-text-muted">{label}</p>
      <p
        className={cn(
          'mt-0.5 text-lg font-semibold tabular-nums',
          highlight ? 'text-success' : 'text-text-primary',
        )}
      >
        {formatPercent(value, 2)}
      </p>
    </div>
  )
}

function FdDetailsBody({ scheme }: { scheme: FixedDepositDetails }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Avatar name={scheme.bank} size="lg" />
        <div className="min-w-0">
          <p className="text-base font-medium text-text-primary">{scheme.bank}</p>
          <Badge tone="info" className="mt-1">
            {scheme.rating}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <RateTile label="Interest rate p.a." value={scheme.interestRate} highlight />
        <RateTile label="Senior citizen rate p.a." value={scheme.seniorCitizenRate} />
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Scheme details</h3>
        <DetailList
          items={[
            { label: 'Minimum amount', value: formatCurrency(scheme.minAmount) },
            { label: 'Maximum amount', value: formatCurrency(scheme.maxAmount) },
            {
              label: 'Tenures',
              value: `${scheme.tenureMonths[0]}–${scheme.tenureMonths[scheme.tenureMonths.length - 1]} months`,
            },
            { label: 'Payout options', value: scheme.payoutOptions.join(', ') },
            { label: 'Premature withdrawal', value: scheme.prematureWithdrawal },
            {
              label: 'Deposit insurance',
              value: scheme.insuredUpTo
                ? `DICGC insured up to ${formatCurrency(scheme.insuredUpTo)}`
                : 'Not applicable',
            },
          ]}
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Tenure-wise interest rates</h3>
        <TableWrapper>
          <TableScroll>
            <Table className="text-sm">
              <THead>
                <tr>
                  <TH className="h-9 px-3">Tenure</TH>
                  <TH className="h-9 px-3" align="right">
                    Regular
                  </TH>
                  <TH className="h-9 px-3" align="right">
                    Senior citizen
                  </TH>
                </tr>
              </THead>
              <TBody>
                {scheme.tenureRates.map((row) => (
                  <TR key={row.months}>
                    <TD className="px-3 py-2.5 font-medium text-text-primary">
                      {row.months} {pluralize(row.months, 'month')}
                    </TD>
                    <TD className="px-3 py-2.5 tabular-nums" align="right">
                      {formatPercent(row.rate, 2)}
                    </TD>
                    <TD className="px-3 py-2.5 tabular-nums" align="right">
                      {formatPercent(
                        row.rate + (scheme.seniorCitizenRate - scheme.interestRate),
                        2,
                      )}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableScroll>
        </TableWrapper>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Highlights</h3>
        <ul className="space-y-2">
          {scheme.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function FdDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <Skeleton className="h-48" />
    </div>
  )
}

export function FdDetailsModal({ schemeId, onClose }: FdDetailsModalProps) {
  const { data, error, refetch } = useQuery(
    `funds:fd:detail:${schemeId}`,
    () => fundsApi.getFixedDeposit(schemeId ?? ''),
    Boolean(schemeId),
  )

  return (
    <Modal
      open={Boolean(schemeId)}
      onClose={onClose}
      size="md"
      title={data?.name ?? 'Scheme details'}
      description={data ? `${data.bank} · ${data.rating}` : undefined}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <LinkButton to="/clients" rightIcon={<ArrowRight className="size-4" />}>
            Transact for a client
          </LinkButton>
        </>
      }
    >
      {error ? (
        <ErrorState error={error} onRetry={refetch} compact />
      ) : data ? (
        <FdDetailsBody scheme={data} />
      ) : (
        <FdDetailsSkeleton />
      )}
    </Modal>
  )
}
