import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'
import { fundsApi } from '@/api/funds'
import { IconButton, Select, type SelectOption } from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { cn } from '@/lib/utils'
import type { AmcSummary, FundSortKey, RiskLevel } from '@/types'
import type { MutualFundQuery } from '../hooks/useExploreParams'

const riskLevels: RiskLevel[] = ['Low', 'Medium', 'High', 'Very High']

export const sortOptions: SelectOption<FundSortKey>[] = [
  { value: 'returns1y', label: '1Y returns' },
  { value: 'returns3y', label: '3Y returns' },
  { value: 'returns5y', label: '5Y returns' },
  { value: 'aum', label: 'AUM' },
]

type FilterValues = Pick<MutualFundQuery, 'category' | 'risk' | 'amcId' | 'sortBy' | 'sortOrder'>

interface FundFiltersProps {
  value: FilterValues
  onChange: (patch: Partial<FilterValues>) => void
  amcs: AmcSummary[] | undefined
  layout: 'row' | 'stack'
}

export function FundFilters({ value, onChange, amcs, layout }: FundFiltersProps) {
  const { data: categories } = useQuery('funds:categories', fundsApi.listCategories)
  const stacked = layout === 'stack'
  const labelFor = (label: string) => (stacked ? label : undefined)
  const selectClass = stacked ? undefined : 'w-auto min-w-36'

  const categoryOptions: SelectOption[] = [
    { value: 'all', label: 'All categories' },
    ...(categories ?? []).map((category) => ({ value: category, label: category })),
  ]
  const riskOptions: SelectOption[] = [
    { value: 'all', label: 'All risk levels' },
    ...riskLevels.map((risk) => ({ value: risk, label: risk })),
  ]
  const amcOptions: SelectOption[] = [
    { value: 'all', label: 'All AMCs' },
    ...(amcs ?? []).map((amc) => ({ value: amc.id, label: amc.name })),
  ]

  return (
    <div className={cn(stacked ? 'flex flex-col gap-4' : 'flex flex-wrap items-center gap-2')}>
      <Select
        label={labelFor('Category')}
        value={value.category}
        onChange={(category) => onChange({ category })}
        options={categoryOptions}
        className={selectClass}
      />
      <Select
        label={labelFor('Risk level')}
        value={value.risk}
        onChange={(risk) => onChange({ risk })}
        options={riskOptions}
        className={selectClass}
      />
      <Select
        label={labelFor('AMC')}
        value={value.amcId}
        onChange={(amcId) => onChange({ amcId })}
        options={amcOptions}
        className={selectClass}
        contentClassName="min-w-64"
      />
      <div className={cn('flex items-end gap-2', stacked && 'w-full [&>div:first-child]:flex-1')}>
        <Select<FundSortKey>
          label={labelFor('Sort by')}
          value={value.sortBy}
          onChange={(sortBy) => onChange({ sortBy })}
          options={sortOptions}
          className={selectClass}
        />
        <IconButton
          variant="outline"
          label={value.sortOrder === 'desc' ? 'Sorted high to low' : 'Sorted low to high'}
          onClick={() => onChange({ sortOrder: value.sortOrder === 'desc' ? 'asc' : 'desc' })}
        >
          {value.sortOrder === 'desc' ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
        </IconButton>
      </div>
    </div>
  )
}
