import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { fundsApi } from '@/api/funds'
import { EmptyState, ErrorState } from '@/components/common/states'
import { Badge, Button, SearchInput, Skeleton } from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { formatCompactCurrency } from '@/lib/format'
import { pluralize } from '@/lib/utils'
import type { AmcSummary } from '@/types'
import { useExploreParams } from '../hooks/useExploreParams'
import { AmcLogo } from './AmcLogo'
import { ReturnValue } from './ReturnValue'

function AmcCard({ amc, onSelect }: { amc: AmcSummary; onSelect: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(amc.id)}
      className="flex w-full flex-col gap-3 card p-4 text-left focus-ring transition-colors hover:border-border-strong hover:bg-surface-raised"
    >
      <div className="flex items-center gap-3">
        <AmcLogo amc={amc} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-medium text-text-primary">{amc.name}</p>
          <p className="text-xs text-text-secondary">
            {amc.fundCount} {pluralize(amc.fundCount, 'fund')} ·{' '}
            {formatCompactCurrency(amc.totalAum)} AUM
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-text-muted" aria-hidden />
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-text-muted">Avg. 3Y returns</span>
        <ReturnValue value={amc.avgReturns3y} className="text-sm" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {amc.categories.slice(0, 3).map((category) => (
          <Badge key={category}>{category}</Badge>
        ))}
        {amc.categories.length > 3 && <Badge>+{amc.categories.length - 3}</Badge>}
      </div>
    </button>
  )
}

export function AmcsTab() {
  const [search, setSearch] = useState('')
  const { selectAmc } = useExploreParams()
  const { data, error, loading, refetch } = useQuery(`funds:amcs:${search}`, () =>
    fundsApi.listAmcs({ search }),
  )

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-10 -mx-4 bg-surface px-4 py-2 md:static md:mx-0 md:bg-transparent md:p-0">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search AMCs"
          className="md:w-72"
        />
      </div>
      {error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : loading || !data ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-36 rounded-card" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          title="No AMCs found"
          description="Try searching for a different asset management company."
          action={
            search && (
              <Button variant="outline" onClick={() => setSearch('')}>
                Clear search
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((amc) => (
            <AmcCard key={amc.id} amc={amc} onSelect={selectAmc} />
          ))}
        </div>
      )}
    </div>
  )
}
