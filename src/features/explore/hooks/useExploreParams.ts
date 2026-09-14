import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { FundSortKey } from '@/types'

export type ExploreTab = 'mutual-funds' | 'fixed-deposits' | 'amcs'

export interface MutualFundQuery {
  search: string
  category: string
  risk: string
  amcId: string
  sortBy: FundSortKey
  sortOrder: 'asc' | 'desc'
  page: number
}

export const defaultQuery: MutualFundQuery = {
  search: '',
  category: 'all',
  risk: 'all',
  amcId: 'all',
  sortBy: 'returns5y',
  sortOrder: 'desc',
  page: 1,
}

const tabs = new Set<string>(['mutual-funds', 'fixed-deposits', 'amcs'])
const sortKeys = new Set<string>(['returns1y', 'returns3y', 'returns5y', 'aum'])

const paramNames: Record<keyof MutualFundQuery, string> = {
  search: 'q',
  category: 'category',
  risk: 'risk',
  amcId: 'amc',
  sortBy: 'sort',
  sortOrder: 'order',
  page: 'page',
}

function readQuery(params: URLSearchParams): MutualFundQuery {
  const sortBy = params.get(paramNames.sortBy)
  const page = Number(params.get(paramNames.page))
  return {
    search: params.get(paramNames.search) ?? defaultQuery.search,
    category: params.get(paramNames.category) ?? defaultQuery.category,
    risk: params.get(paramNames.risk) ?? defaultQuery.risk,
    amcId: params.get(paramNames.amcId) ?? defaultQuery.amcId,
    sortBy: sortBy !== null && sortKeys.has(sortBy) ? (sortBy as FundSortKey) : defaultQuery.sortBy,
    sortOrder: params.get(paramNames.sortOrder) === 'asc' ? 'asc' : defaultQuery.sortOrder,
    page: Number.isInteger(page) && page > 1 ? page : defaultQuery.page,
  }
}

function writeQuery(params: URLSearchParams, query: MutualFundQuery) {
  for (const key of Object.keys(paramNames) as (keyof MutualFundQuery)[]) {
    const value = query[key]
    if (value === defaultQuery[key]) params.delete(paramNames[key])
    else params.set(paramNames[key], String(value))
  }
  return params
}

export function useExploreParams() {
  const [params, setParams] = useSearchParams()

  const tabParam = params.get('tab')
  const tab: ExploreTab =
    tabParam !== null && tabs.has(tabParam) ? (tabParam as ExploreTab) : 'mutual-funds'
  const query = useMemo(() => readQuery(params), [params])

  const setTab = useCallback(
    (next: ExploreTab) =>
      setParams((prev) => {
        if (next === 'mutual-funds') prev.delete('tab')
        else prev.set('tab', next)
        return prev
      }),
    [setParams],
  )

  const setQuery = useCallback(
    (patch: Partial<MutualFundQuery>) =>
      setParams(
        (prev) => {
          const current = readQuery(prev)
          const resetsPage = Object.keys(patch).some((key) => key !== 'page')
          return writeQuery(prev, {
            ...current,
            ...(resetsPage ? { page: 1 } : {}),
            ...patch,
          })
        },
        { replace: true },
      ),
    [setParams],
  )

  const resetFilters = useCallback(
    () => setQuery({ category: 'all', risk: 'all', amcId: 'all', search: '' }),
    [setQuery],
  )

  const selectAmc = useCallback(
    (amcId: string) =>
      setParams((prev) => {
        prev.delete('tab')
        return writeQuery(prev, { ...defaultQuery, amcId })
      }),
    [setParams],
  )

  const activeFilterCount = [query.category, query.risk, query.amcId].filter(
    (value) => value !== 'all',
  ).length

  return { tab, setTab, query, setQuery, resetFilters, selectAmc, activeFilterCount }
}
