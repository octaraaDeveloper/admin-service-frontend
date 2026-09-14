import { Download } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { clientsApi } from '@/api/clients'
import { EmptyState, ErrorState, Monogram, ReturnValue, amcMonogram } from '@/components/common'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DataTable,
  Skeleton,
  type Column,
} from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { formatCompactCurrency, formatCurrency, formatDate, formatPercent } from '@/lib/format'
import { downloadCsv } from '@/lib/utils'
import { toast } from '@/store/toast'
import type { ClientAllocationSlice, ClientHolding, ClientProfile, ClientReport } from '@/types'
import { SummaryTiles } from './PortfolioTab'

const chartColors = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
]

const headerClass = 'text-xs tracking-wide'

const fundColumns: Column<ClientHolding>[] = [
  {
    key: 'fund',
    header: 'FUND NAME',
    headerClassName: headerClass,
    className: 'whitespace-normal',
    cell: (holding) => (
      <div className="flex items-center gap-3">
        <Monogram label={amcMonogram(holding.amcShortName)} color={holding.amcColor} size="sm" />
        <div className="min-w-0">
          <p className="font-medium text-text-primary">{holding.fundName}</p>
          <p className="text-xs text-text-muted">Direct Growth · Folio {holding.folio}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'CATEGORY',
    headerClassName: headerClass,
    cell: (holding) => <Badge tone="info">{holding.category}</Badge>,
  },
  {
    key: 'invested',
    header: 'INVESTED',
    align: 'right',
    headerClassName: headerClass,
    cell: (holding) => <span className="tabular-nums">{formatCurrency(holding.invested)}</span>,
  },
  {
    key: 'current',
    header: 'CURRENT VALUE',
    align: 'right',
    headerClassName: headerClass,
    cell: (holding) => <span className="tabular-nums">{formatCurrency(holding.current)}</span>,
  },
  {
    key: 'returns',
    header: 'RETURNS',
    align: 'right',
    headerClassName: headerClass,
    cell: (holding) => {
      const gain = holding.current - holding.invested
      return (
        <div className="tabular-nums">
          <p className={gain >= 0 ? 'font-medium text-success' : 'font-medium text-danger'}>
            {gain >= 0 ? '+' : '-'}
            {formatCurrency(Math.abs(gain))}
          </p>
          <p className="text-xs text-text-muted">({formatPercent(holding.returnsPct, 2)})</p>
        </div>
      )
    },
  },
  {
    key: 'xirr',
    header: 'XIRR',
    align: 'right',
    headerClassName: headerClass,
    cell: (holding) => <ReturnValue value={holding.xirr} digits={2} />,
  },
  {
    key: 'sip',
    header: 'SIP',
    align: 'right',
    headerClassName: headerClass,
    cell: (holding) =>
      holding.sipAmount ? (
        <div className="flex flex-col items-end gap-0.5">
          <Badge tone="brand">SIP</Badge>
          <span className="text-xs text-text-muted">{formatCurrency(holding.sipAmount)}/mo</span>
        </div>
      ) : (
        <span className="text-text-muted">-</span>
      ),
  },
]

function FundCard({ holding }: { holding: ClientHolding }) {
  const gain = holding.current - holding.invested
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Monogram label={amcMonogram(holding.amcShortName)} color={holding.amcColor} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-base font-medium text-text-primary">{holding.fundName}</p>
            <p className="text-xs text-text-muted">{holding.category}</p>
          </div>
        </div>
        {holding.sipAmount && <Badge tone="brand">SIP</Badge>}
      </div>
      <dl className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-2xs font-semibold tracking-wide text-text-muted uppercase">
            Invested
          </dt>
          <dd className="mt-0.5 font-medium text-text-primary tabular-nums">
            {formatCurrency(holding.invested)}
          </dd>
        </div>
        <div>
          <dt className="text-2xs font-semibold tracking-wide text-text-muted uppercase">
            Current
          </dt>
          <dd className="mt-0.5 font-medium text-text-primary tabular-nums">
            {formatCurrency(holding.current)}
          </dd>
        </div>
        <div className="text-right">
          <dt className="text-2xs font-semibold tracking-wide text-text-muted uppercase">XIRR</dt>
          <dd className="mt-0.5">
            <ReturnValue value={holding.xirr} digits={2} />
          </dd>
        </div>
      </dl>
      <p
        className={
          gain >= 0 ? 'text-xs font-medium text-success' : 'text-xs font-medium text-danger'
        }
      >
        {gain >= 0 ? '+' : '-'}
        {formatCurrency(Math.abs(gain))} ({formatPercent(holding.returnsPct, 2)}) returns
      </p>
    </div>
  )
}

const renderFundCard = (holding: ClientHolding) => <FundCard holding={holding} />

function AllocationCard({
  allocation,
  total,
}: {
  allocation: ClientAllocationSlice[]
  total: number
}) {
  return (
    <Card>
      <CardHeader title="Asset Allocation" />
      <CardBody className="flex flex-col items-center gap-4 sm:flex-row">
        {allocation.length === 0 ? (
          <p className="text-sm text-text-muted">No investments to allocate yet.</p>
        ) : (
          <>
            <div className="relative size-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={44}
                    outerRadius={64}
                    paddingAngle={3}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {allocation.map((slice, index) => (
                      <Cell key={slice.label} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-semibold text-text-primary">
                  {formatCompactCurrency(total)}
                </span>
                <span className="text-2xs text-text-muted">Total value</span>
              </div>
            </div>
            <ul className="w-full flex-1 space-y-2">
              {allocation.map((slice, index) => (
                <li key={slice.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-text-secondary">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    {slice.label === 'Other' ? 'Other assets' : `${slice.label} funds`}
                  </span>
                  <span className="font-semibold text-text-primary tabular-nums">
                    {formatPercent(slice.share, 1)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardBody>
    </Card>
  )
}

function MembersCard({ report }: { report: ClientReport }) {
  return (
    <Card>
      <CardHeader
        title="Family breakdown"
        description="Share of the consolidated family portfolio by member"
      />
      <CardBody className="space-y-3">
        {report.members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar name={member.name} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-text-primary">
                  {member.name}
                  <span className="ml-1.5 text-xs font-normal text-text-muted">
                    {member.relationship}
                  </span>
                </p>
                <p className="text-sm font-semibold text-text-primary tabular-nums">
                  {formatPercent(member.share, 0)}
                </p>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${Math.max(2, member.share)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-text-muted tabular-nums">
                Invested {formatCompactCurrency(member.invested)} ·{' '}
                <ReturnValue value={member.gainPct} digits={1} className="font-normal" />
              </p>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

function exportReport(client: ClientProfile, report: ClientReport) {
  downloadCsv(
    `${client.id}-report.csv`,
    [
      'Fund',
      'Category',
      'Folio',
      'Units',
      'Invested',
      'Current value',
      'Returns %',
      'XIRR %',
      'SIP',
    ],
    report.holdings.map((holding) => [
      holding.fundName,
      holding.category,
      holding.folio,
      holding.units,
      holding.invested,
      holding.current,
      holding.returnsPct.toFixed(2),
      holding.xirr.toFixed(2),
      holding.sipAmount ?? '-',
    ]),
  )
}

export function ReportTab({ client }: { client: ClientProfile }) {
  const report = useQuery(`clients:report:${client.id}`, () => clientsApi.report(client.id))

  if (report.error) return <ErrorState error={report.error} onRetry={report.refetch} compact />

  const data = report.data

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Investment report</h3>
          <p className="text-xs text-text-muted">
            {data ? `Generated ${formatDate(data.generatedAt)}` : 'Preparing report…'}
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<Download className="size-4" />}
          disabled={!data || data.holdings.length === 0}
          onClick={() => {
            if (!data) return
            exportReport(client, data)
            toast.success('Report downloaded')
          }}
        >
          Download report
        </Button>
      </div>

      <SummaryTiles
        summary={data?.summary}
        loading={report.loading}
        labels={['Total Invested', 'Current Value', 'Current Gains']}
      />

      {data ? (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <AllocationCard allocation={data.allocation} total={data.summary.current} />
          <MembersCard report={data} />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
        </div>
      )}

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-text-primary">
          Mutual Funds {data && `(${data.holdings.length})`}
        </h3>
        <DataTable
          columns={fundColumns}
          rows={data?.holdings}
          rowKey={(holding) => holding.id}
          loading={report.loading}
          minWidth={900}
          skeletonRows={3}
          mobileCard={renderFundCard}
          empty={
            <EmptyState
              title="No funds to report"
              description="Holdings will appear here once the client starts investing."
              compact
            />
          }
        />
      </section>
    </div>
  )
}
