import { SlidersHorizontal } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { fundsApi } from '@/api/funds'
import { EmptyState, Monogram, ReturnValue, RiskBadge, amcMonogram } from '@/components/common'
import {
  Button,
  DataTable,
  IconButton,
  keyOf,
  Pagination,
  SearchInput,
  type Column,
} from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { formatCompactCurrency, formatPercent } from '@/lib/format'
import type { FundSortKey, ListRequest, MutualFundListItem } from '@/types'
import { useExploreParams } from '../hooks/useExploreParams'
import { FundDetailsModal } from './FundDetailsModal'
import { FundFilters } from './FundFilters'
import { FundFiltersSheet } from './FundFiltersSheet'
import { FundMobileCard } from './FundMobileCard'
import { RatingStars } from './RatingStars'
import { SortableHeader } from './SortableHeader'

const PAGE_SIZE = 10

type SortableRenderer = (label: string, key: FundSortKey) => ReactNode

const renderFundCard = (fund: MutualFundListItem) => <FundMobileCard fund={fund} />

function buildColumns(sortable: SortableRenderer): Column<MutualFundListItem>[] {
  return [
    {
      key: 'name',
      header: 'Fund Name',
      className: 'min-w-64 max-w-80 whitespace-normal',
      cell: (fund) => (
        <div className="flex items-center gap-3">
          <Monogram label={amcMonogram(fund.amc.shortName)} color={fund.amc.logoColor} />
          <div className="min-w-0">
            <p className="font-medium text-text-primary">{fund.name}</p>
            <p className="text-xs text-text-secondary">{fund.amc.shortName}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', cell: (fund) => fund.category },
    {
      key: 'returns1y',
      header: sortable('1Y', 'returns1y'),
      align: 'right',
      cell: (fund) => <ReturnValue value={fund.returns1y} />,
    },
    {
      key: 'returns3y',
      header: sortable('3Y', 'returns3y'),
      align: 'right',
      cell: (fund) => <ReturnValue value={fund.returns3y} />,
    },
    {
      key: 'returns5y',
      header: sortable('5Y', 'returns5y'),
      align: 'right',
      cell: (fund) => <ReturnValue value={fund.returns5y} />,
    },
    {
      key: 'rating',
      header: 'Rating',
      align: 'center',
      cell: (fund) => <RatingStars rating={fund.rating} className="justify-center" />,
    },
    {
      key: 'expenseRatio',
      header: 'Exp. Ratio',
      align: 'center',
      className: 'tabular-nums',
      cell: (fund) => formatPercent(fund.expenseRatio, 2),
    },
    {
      key: 'aum',
      header: sortable('AUM', 'aum'),
      align: 'right',
      className: 'tabular-nums',
      cell: (fund) => formatCompactCurrency(fund.aum),
    },
    {
      key: 'risk',
      header: 'Risk',
      align: 'center',
      cell: (fund) => <RiskBadge risk={fund.risk} />,
    },
  ]
}

export function MutualFundsTab() {
  const { query, setQuery, resetFilters, activeFilterCount } = useExploreParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null)

  const request: ListRequest = {
    page: query.page,
    limit: PAGE_SIZE,
    search: query.search,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    filters: { category: query.category, risk: query.risk, amcId: query.amcId },
  }
  const { data, error, loading, refetch } = useQuery(`funds:mf:${JSON.stringify(request)}`, () =>
    fundsApi.listMutualFunds(request),
  )
  const { data: amcs } = useQuery('funds:amcs', () => fundsApi.listAmcs())

  const toggleSort = (key: FundSortKey) =>
    setQuery(
      query.sortBy === key
        ? { sortOrder: query.sortOrder === 'desc' ? 'asc' : 'desc' }
        : { sortBy: key, sortOrder: 'desc' },
    )

  const sortable = (label: string, key: FundSortKey) => (
    <SortableHeader
      label={label}
      sortKey={key}
      activeKey={query.sortBy}
      order={query.sortOrder}
      onSort={toggleSort}
    />
  )

  const columns = buildColumns(sortable)

  const hasActiveFilters = activeFilterCount > 0 || query.search.length > 0

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-10 -mx-4 bg-surface px-4 py-2 md:static md:mx-0 md:bg-transparent md:p-0">
        <div className="flex items-center gap-2 md:flex-wrap">
          <SearchInput
            value={query.search}
            onChange={(search) => setQuery({ search })}
            placeholder="Search funds or AMCs"
            className="min-w-0 flex-1 md:w-72 md:flex-none"
          />
          <IconButton
            label="Filters"
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            className="relative md:hidden"
          >
            <SlidersHorizontal />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand text-2xs font-semibold text-brand-foreground">
                {activeFilterCount}
              </span>
            )}
          </IconButton>
          <div className="hidden md:contents">
            <FundFilters layout="row" value={query} onChange={setQuery} amcs={amcs} />
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={data?.rows}
        rowKey={keyOf}
        loading={loading}
        error={error}
        onRetry={refetch}
        onRowClick={(fund) => setSelectedFundId(fund.id)}
        mobileCard={renderFundCard}
        minWidth={980}
        empty={
          <EmptyState
            compact
            title="No funds match your filters"
            description="Try a different search term or clear the filters to see all mutual funds."
            action={
              hasActiveFilters && (
                <Button variant="outline" onClick={resetFilters}>
                  Clear filters
                </Button>
              )
            }
          />
        }
        footer={
          data &&
          data.total > 0 && (
            <Pagination
              page={data.page}
              pages={data.pages}
              total={data.total}
              limit={data.limit}
              onChange={(page) => setQuery({ page })}
            />
          )
        }
      />

      <FundFiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={query}
        onApply={setQuery}
        amcs={amcs}
      />
      <FundDetailsModal fundId={selectedFundId} onClose={() => setSelectedFundId(null)} />
    </div>
  )
}
