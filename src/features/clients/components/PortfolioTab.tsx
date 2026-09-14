import { clientsApi } from '@/api/clients'
import { StatTile } from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ClientPortfolioSummary, ClientProfile } from '@/types'
import { HoldingsTable } from './HoldingsTable'
import { ProfileDetailsCard } from './ProfileDetailsCard'

const defaultLabels: [string, string, string] = ['Total invested', 'Current value', 'Total returns']

export function SummaryTiles({
  summary,
  loading,
  labels = defaultLabels,
}: {
  summary: ClientPortfolioSummary | undefined
  loading: boolean
  labels?: [string, string, string]
}) {
  const positive = (summary?.returns ?? 0) >= 0
  const tileClass = 'p-3 md:p-4 [&_p]:text-base md:[&_p]:text-xl'
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4">
      <StatTile
        label={labels[0]}
        value={summary ? formatCurrency(summary.invested) : '—'}
        loading={loading}
        className={tileClass}
      />
      <StatTile
        label={labels[1]}
        value={summary ? formatCurrency(summary.current) : '—'}
        loading={loading}
        className={tileClass}
      />
      <StatTile
        label={labels[2]}
        loading={loading}
        className={tileClass}
        value={
          summary ? (
            <span className={cn(positive ? 'text-success' : 'text-danger')}>
              {positive ? '+' : '-'}
              {formatCurrency(Math.abs(summary.returns))}
              <small className="block text-2xs font-semibold md:ml-1 md:inline md:text-xs">
                ({formatPercent(summary.returnsPct, 2)})
              </small>
            </span>
          ) : (
            '—'
          )
        }
      />
    </div>
  )
}

export function PortfolioTab({ client }: { client: ClientProfile }) {
  const portfolio = useQuery(`clients:portfolio:${client.id}`, () =>
    clientsApi.portfolio(client.id),
  )

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-6">
      <ProfileDetailsCard client={client} className="min-w-0 self-start" />
      <div className="min-w-0 space-y-4 md:space-y-5">
        <SummaryTiles summary={portfolio.data?.summary} loading={portfolio.loading} />
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-text-primary">Holdings</h3>
          <HoldingsTable
            holdings={portfolio.data?.holdings}
            loading={portfolio.loading}
            error={portfolio.error}
            onRetry={portfolio.refetch}
            clientId={client.id}
          />
        </section>
      </div>
    </div>
  )
}
