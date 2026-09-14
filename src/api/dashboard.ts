import { matchesSearch, mock, paginate } from '@/mocks'
import {
  assetAllocationFor,
  aumBreakdownRows,
  aumTrendFor,
  businessUpdateCounts,
  businessUpdateRowsFor,
  dashboardSummaries,
  fdInvestors,
  mfInvestors,
  recentInvestorsFor,
  sipClientOptions,
  sipInvestorsFor,
  upcomingSipsFor,
} from '@/mocks/dashboard'
import type {
  AssetAllocation,
  AumBreakdownRow,
  AumTrendPoint,
  AumTrendRange,
  BusinessUpdateRequest,
  BusinessUpdateResponse,
  DashboardPeriod,
  DashboardSummary,
  FdInvestor,
  ListRequest,
  MfInvestor,
  Paginated,
  RecentInvestor,
  RecentInvestorsRequest,
  SipClientOption,
  SipInvestor,
  SipInvestorsRequest,
  UpcomingSip,
  UpcomingSipsRequest,
} from '@/types'

export const dashboardApi = {
  summary(period: DashboardPeriod): Promise<DashboardSummary> {
    return mock(dashboardSummaries[period])
  },

  aumTrend(range: AumTrendRange): Promise<AumTrendPoint[]> {
    return mock(aumTrendFor(range))
  },

  assetAllocation(period: DashboardPeriod): Promise<AssetAllocation> {
    return mock(assetAllocationFor(period))
  },

  recentInvestors(request: RecentInvestorsRequest = {}): Promise<RecentInvestor[]> {
    return mock(recentInvestorsFor(request))
  },

  upcomingSips(request: UpcomingSipsRequest = {}): Promise<UpcomingSip[]> {
    return mock(upcomingSipsFor(request))
  },

  sipClients(): Promise<SipClientOption[]> {
    return mock(sipClientOptions)
  },

  businessUpdate(request: BusinessUpdateRequest): Promise<BusinessUpdateResponse> {
    const rows = businessUpdateRowsFor(request.frequency ?? 'monthly')
    const filter = request.filter ?? 'all'
    const filtered = rows.filter((row) => filter === 'all' || row.type === filter)
    return mock({
      ...paginate(filtered, request.page, request.limit),
      counts: businessUpdateCounts(rows),
    })
  },

  mfInvestors(request: ListRequest): Promise<Paginated<MfInvestor>> {
    const rows = mfInvestors.filter((row) =>
      matchesSearch(request.search ?? '', [row.name, row.clientId, row.pan]),
    )
    return mock(paginate(rows, request.page, request.limit))
  },

  fdInvestors(request: ListRequest): Promise<Paginated<FdInvestor>> {
    const rows = fdInvestors.filter((row) =>
      matchesSearch(request.search ?? '', [row.name, row.clientId, row.pan]),
    )
    return mock(paginate(rows, request.page, request.limit))
  },

  sipInvestors(request: SipInvestorsRequest): Promise<Paginated<SipInvestor>> {
    const rows = sipInvestorsFor(request.range ?? '1m').filter((row) =>
      matchesSearch(request.search ?? '', [row.name, row.clientId, row.pan]),
    )
    return mock(paginate(rows, request.page, request.limit))
  },

  aumBreakdown(request: ListRequest): Promise<Paginated<AumBreakdownRow>> {
    const rows = aumBreakdownRows.filter((row) =>
      matchesSearch(request.search ?? '', [
        row.fundName,
        row.amcName,
        row.amcShortName,
        row.category,
      ]),
    )
    return mock(paginate(rows, request.page, request.limit))
  },
}
