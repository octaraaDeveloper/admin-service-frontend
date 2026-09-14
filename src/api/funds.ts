import { matchesSearch, mock, mockFailure, paginate } from '@/mocks'
import {
  amcSummaries,
  fixedDepositDetailsById,
  fixedDepositSchemes,
  fundCategories,
  fundDetailsById,
  mutualFunds,
  withAmc,
} from '@/mocks/funds'
import type {
  AmcSummary,
  ExploreSummary,
  FixedDepositDetails,
  FixedDepositScheme,
  FundSortKey,
  ListRequest,
  MutualFundDetails,
  MutualFundListItem,
  Paginated,
} from '@/types'

const sortKeys = new Set<string>(['returns1y', 'returns3y', 'returns5y', 'aum'])

function isSortKey(value: string | undefined): value is FundSortKey {
  return value !== undefined && sortKeys.has(value)
}

function isActive(value: string | undefined) {
  return Boolean(value) && value !== 'all'
}

function filterMutualFunds(request: ListRequest): MutualFundListItem[] {
  const filters = request.filters ?? {}
  const sortBy = isSortKey(request.sortBy) ? request.sortBy : 'returns5y'
  const direction = request.sortOrder === 'asc' ? 1 : -1
  return mutualFunds
    .map(withAmc)
    .filter(
      (fund) =>
        matchesSearch(request.search ?? '', [
          fund.name,
          fund.amc.name,
          fund.amc.shortName,
          fund.category,
        ]) &&
        (!isActive(filters.category) || fund.category === filters.category) &&
        (!isActive(filters.risk) || fund.risk === filters.risk) &&
        (!isActive(filters.amcId) || fund.amcId === filters.amcId),
    )
    .toSorted((a, b) => (a[sortBy] - b[sortBy]) * direction || a.name.localeCompare(b.name))
}

function filterFixedDeposits(search = ''): FixedDepositScheme[] {
  return fixedDepositSchemes
    .filter((scheme) => matchesSearch(search, [scheme.bank, scheme.name, scheme.rating]))
    .toSorted((a, b) => b.interestRate - a.interestRate)
}

function filterAmcs(search = ''): AmcSummary[] {
  return amcSummaries()
    .filter((amc) => matchesSearch(search, [amc.name, amc.shortName]))
    .toSorted((a, b) => b.totalAum - a.totalAum)
}

export const fundsApi = {
  summary: (): Promise<ExploreSummary> =>
    mock({
      mutualFunds: mutualFunds.length,
      fixedDeposits: fixedDepositSchemes.length,
      amcs: amcSummaries().length,
    }),

  listMutualFunds: (request: ListRequest): Promise<Paginated<MutualFundListItem>> =>
    mock(paginate(filterMutualFunds(request), request.page, request.limit)),

  getMutualFund: (id: string): Promise<MutualFundDetails> => {
    const details = fundDetailsById(id)
    return details ? mock(details) : mockFailure('Fund not found')
  },

  listCategories: () => mock(fundCategories),

  listFixedDeposits: (request: { search?: string } = {}): Promise<FixedDepositScheme[]> =>
    mock(filterFixedDeposits(request.search)),

  getFixedDeposit: (id: string): Promise<FixedDepositDetails> => {
    const details = fixedDepositDetailsById(id)
    return details ? mock(details) : mockFailure('Scheme not found')
  },

  listAmcs: (request: { search?: string } = {}): Promise<AmcSummary[]> =>
    mock(filterAmcs(request.search)),
}
