import type {
  AssetAllocation,
  AssetClass,
  AumBreakdownRow,
  AumTrendPoint,
  AumTrendRange,
  BusinessUpdateFilter,
  BusinessUpdateFrequency,
  BusinessUpdateRow,
  DashboardPeriod,
  DashboardSummary,
  FdInvestor,
  InstrumentType,
  MfInvestor,
  RecentInvestor,
  RecentInvestorsRequest,
  SipClientOption,
  SipInvestor,
  SipOptionsRange,
  UpcomingSip,
  UpcomingSipsRequest,
} from '@/types'
import { clients } from './clients'
import { amcById, mutualFunds } from './funds'

const CRORE = 10_000_000
const LAKH = 100_000

function noise(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function between(seed: number, min: number, max: number, step = 1) {
  const raw = min + noise(seed) * (max - min)
  return Math.round(raw / step) * step
}

function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function shiftDays(base: Date, days: number) {
  const next = new Date(base)
  next.setDate(next.getDate() + days)
  return next
}

function shiftMonths(base: Date, months: number) {
  const next = new Date(base)
  next.setMonth(next.getMonth() + months)
  return next
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

export const dashboardSummaries: Record<DashboardPeriod, DashboardSummary> = {
  'this-month': {
    mutualFundAum: 4216 * CRORE,
    monthlySip: 1.84 * CRORE,
    importedFunds: 612 * CRORE,
    totalSipInvestors: 8930,
    totalSipCount: 14206,
    equityAum: 3004 * CRORE,
    debtAum: 921 * CRORE,
    otherAum: 291 * CRORE,
    totalInvested: 3612 * CRORE,
    totalFdAum: 631 * CRORE,
    depositCount: 1164,
    fdInvestorCount: 312,
  },
  'last-month': {
    mutualFundAum: 4058 * CRORE,
    monthlySip: 1.71 * CRORE,
    importedFunds: 558 * CRORE,
    totalSipInvestors: 8614,
    totalSipCount: 13692,
    equityAum: 2887 * CRORE,
    debtAum: 893 * CRORE,
    otherAum: 278 * CRORE,
    totalInvested: 3491 * CRORE,
    totalFdAum: 617 * CRORE,
    depositCount: 1128,
    fdInvestorCount: 304,
  },
  'this-quarter': {
    mutualFundAum: 4216 * CRORE,
    monthlySip: 1.79 * CRORE,
    importedFunds: 1736 * CRORE,
    totalSipInvestors: 8930,
    totalSipCount: 14206,
    equityAum: 3004 * CRORE,
    debtAum: 921 * CRORE,
    otherAum: 291 * CRORE,
    totalInvested: 3612 * CRORE,
    totalFdAum: 631 * CRORE,
    depositCount: 1164,
    fdInvestorCount: 312,
  },
  'this-year': {
    mutualFundAum: 4216 * CRORE,
    monthlySip: 1.62 * CRORE,
    importedFunds: 5912 * CRORE,
    totalSipInvestors: 8930,
    totalSipCount: 14206,
    equityAum: 3004 * CRORE,
    debtAum: 921 * CRORE,
    otherAum: 291 * CRORE,
    totalInvested: 3612 * CRORE,
    totalFdAum: 631 * CRORE,
    depositCount: 1164,
    fdInvestorCount: 312,
  },
}

const allocationValues: Record<DashboardPeriod, [number, number, number, number]> = {
  'this-month': [3004, 921, 631, 291],
  'last-month': [2840, 910, 640, 285],
  'this-quarter': [3004, 921, 631, 291],
  'this-year': [2962, 948, 652, 285],
}

const allocationPercents: Record<DashboardPeriod, [number, number, number, number]> = {
  'this-month': [62, 19, 13, 6],
  'last-month': [61, 19, 14, 6],
  'this-quarter': [62, 19, 13, 6],
  'this-year': [61, 20, 13, 6],
}

export function assetAllocationFor(period: DashboardPeriod): AssetAllocation {
  const values = allocationValues[period]
  const percents = allocationPercents[period]
  const labels = ['Equity', 'Debt', 'Fixed deposits', 'Gold & others'] as const
  const keys = ['equity', 'debt', 'fixed-deposits', 'gold-others'] as const
  return {
    total: values.reduce((sum, value) => sum + value, 0) * CRORE,
    slices: keys.map((key, index) => ({
      key,
      label: labels[index],
      value: values[index] * CRORE,
      percent: percents[index],
    })),
  }
}

interface TrendShape {
  points: number
  step: (base: Date, index: number) => Date
  growth: number
  volatility: number
}

const trendShapes: Record<AumTrendRange, TrendShape> = {
  '1D': {
    points: 13,
    step: (base, index) => new Date(base.getTime() + (9.25 * 60 + index * 30) * 60_000),
    growth: 0.004,
    volatility: 0.002,
  },
  '1W': {
    points: 7,
    step: (base, index) => shiftDays(base, index - 6),
    growth: 0.012,
    volatility: 0.006,
  },
  '1M': {
    points: 30,
    step: (base, index) => shiftDays(base, index - 29),
    growth: 0.031,
    volatility: 0.01,
  },
  '3M': {
    points: 13,
    step: (base, index) => shiftDays(base, (index - 12) * 7),
    growth: 0.074,
    volatility: 0.018,
  },
  '1Y': {
    points: 12,
    step: (base, index) => shiftMonths(base, index - 11),
    growth: 0.21,
    volatility: 0.03,
  },
  ALL: {
    points: 36,
    step: (base, index) => shiftMonths(base, index - 35),
    growth: 0.86,
    volatility: 0.035,
  },
}

function walk(points: number, growth: number, volatility: number, seed: number, end: number) {
  const values: number[] = []
  let current = 1
  for (let index = 0; index < points; index += 1) {
    const drift = growth / Math.max(1, points - 1)
    const shock = (noise(seed * 97 + index) - 0.5) * 2 * volatility
    current *= 1 + drift + shock
    values.push(current)
  }
  const last = values[values.length - 1] ?? 1
  return values.map((value) => Math.round((value / last) * end))
}

export function aumTrendFor(range: AumTrendRange): AumTrendPoint[] {
  const shape = trendShapes[range]
  const base = startOfToday()
  const seed = Object.keys(trendShapes).indexOf(range) + 1
  const summary = dashboardSummaries['this-month']
  const mfSeries = walk(shape.points, shape.growth, shape.volatility, seed, summary.mutualFundAum)
  const fdSeries = walk(
    shape.points,
    shape.growth * 0.55,
    shape.volatility * 0.4,
    seed + 11,
    summary.totalFdAum,
  )
  return mfSeries.map((value, index) => ({
    date: shape.step(base, index).toISOString(),
    mutualFunds: value,
    fixedDeposit: fdSeries[index] ?? summary.totalFdAum,
  }))
}

export function recentInvestorsFor(request: RecentInvestorsRequest): RecentInvestor[] {
  const search = request.search ?? ''
  const kyc = request.kyc ?? 'all'
  return [...clients]
    .toSorted((a, b) => b.joinedAt.localeCompare(a.joinedAt))
    .filter((client) => kyc === 'all' || client.kycStatus === kyc)
    .filter((client) => {
      const needle = search.trim().toLowerCase()
      if (!needle) return true
      return [client.name, client.id, client.pan].some((field) =>
        field.toLowerCase().includes(needle),
      )
    })
    .slice(0, 6)
    .map((client) => ({
      id: client.id,
      clientId: client.id,
      name: client.name,
      avatarUrl: client.avatarUrl,
      joinedAt: client.joinedAt,
      aum: client.aum,
      kycStatus: client.kycStatus,
    }))
}

const upcomingSips: UpcomingSip[] = clients
  .filter((client) => client.sipCount > 0)
  .flatMap((client, clientIndex) =>
    Array.from({ length: Math.min(client.sipCount, 3) }, (_, sipIndex) => {
      const seed = clientIndex * 7 + sipIndex
      const fund = mutualFunds[(clientIndex * 3 + sipIndex * 5) % mutualFunds.length]
      const share = client.sipCount === 1 ? 1 : 1 / Math.min(client.sipCount, 3)
      return {
        id: `sip-${client.id}-${sipIndex + 1}`,
        clientId: client.id,
        clientName: client.name,
        avatarUrl: client.avatarUrl,
        fundId: fund.id,
        fundName: fund.name,
        sipDate: isoDate(shiftDays(startOfToday(), between(seed, 0, 27))),
        amount: Math.max(500, Math.round((client.monthlySip * share) / 500) * 500),
      }
    }),
  )

export const sipClientOptions: SipClientOption[] = clients
  .filter((client) => upcomingSips.some((sip) => sip.clientId === client.id))
  .map((client) => ({ id: client.id, name: client.name }))

export function upcomingSipsFor(request: UpcomingSipsRequest): UpcomingSip[] {
  const window = request.window ?? 'this-week'
  const today = startOfToday()
  const [from, to] = window === 'this-week' ? [0, 7] : window === 'next-week' ? [7, 14] : [0, 31]
  const start = isoDate(shiftDays(today, from))
  const end = isoDate(shiftDays(today, to))
  return upcomingSips
    .filter((sip) => sip.sipDate >= start && sip.sipDate < end)
    .filter((sip) => !request.clientId || sip.clientId === request.clientId)
    .toSorted((a, b) => a.sipDate.localeCompare(b.sipDate))
    .slice(0, 6)
}

const INVESTOR_ROWS = 40

function investorBase(index: number) {
  const client = clients[index % clients.length]
  return {
    clientId: client.id,
    name: client.name,
    avatarUrl: client.avatarUrl,
    pan: client.pan,
    kycStatus: client.kycStatus,
  }
}

export const mfInvestors: MfInvestor[] = Array.from({ length: INVESTOR_ROWS }, (_, index) => {
  const investment = between(index + 1, 2 * LAKH, 48 * LAKH, 5000)
  const gain = 1 + between(index + 101, 4, 42) / 100
  return {
    id: `mf-investor-${index + 1}`,
    ...investorBase(index),
    investment,
    currentValue: Math.round((investment * gain) / 100) * 100,
    folios: between(index + 201, 1, 14),
    sips: between(index + 301, 0, 8),
  }
})

export const fdInvestors: FdInvestor[] = Array.from({ length: INVESTOR_ROWS }, (_, index) => {
  const investment = between(index + 401, 1 * LAKH, 25 * LAKH, 5000)
  const gain = 1 + between(index + 501, 3, 19) / 100
  return {
    id: `fd-investor-${index + 1}`,
    ...investorBase(index + 5),
    investment,
    currentValue: Math.round((investment * gain) / 100) * 100,
    fds: between(index + 601, 1, 12),
  }
})

const sipRangeMonths: Record<SipOptionsRange, number> = {
  '1m': 1,
  '3m': 3,
  '6m': 6,
  '1y': 12,
  '2y': 24,
  '3y': 36,
  '5y': 60,
}

export function sipInvestorsFor(range: SipOptionsRange): SipInvestor[] {
  const months = sipRangeMonths[range]
  return Array.from({ length: INVESTOR_ROWS }, (_, index) => {
    const monthly = between(index + 701, 2000, 60000, 500)
    const activeSips = between(index + 801, 1, 10)
    const closedSips = Math.min(
      activeSips + 4,
      Math.round((months / 60) * between(index + 901, 2, 14)),
    )
    return {
      id: `sip-investor-${index + 1}`,
      ...investorBase(index + 9),
      totalSipAmount: monthly * months,
      activeSips,
      closedSips,
    }
  })
}

const splitByAssetClass: Record<AssetClass, [number, number, number, number]> = {
  Equity: [0.86, 0.06, 0.05, 0.03],
  Debt: [0.04, 0.88, 0.05, 0.03],
  Hybrid: [0.42, 0.31, 0.22, 0.05],
  Other: [0.12, 0.08, 0.06, 0.74],
}

export const aumBreakdownRows: AumBreakdownRow[] = mutualFunds.map((fund, index) => {
  const amc = amcById(fund.amcId)
  const total = between(index + 1001, 6 * LAKH, 96 * LAKH, 5000)
  const [equityShare, debtShare, hybridShare] = splitByAssetClass[fund.assetClass]
  const equity = Math.round((total * equityShare) / 1000) * 1000
  const debt = Math.round((total * debtShare) / 1000) * 1000
  const hybrid = Math.round((total * hybridShare) / 1000) * 1000
  const other = Math.max(0, total - equity - debt - hybrid)
  return {
    id: `aum-${fund.id}`,
    fundId: fund.id,
    fundName: fund.name,
    category: fund.category,
    amcId: fund.amcId,
    amcName: amc?.name ?? fund.amcId,
    amcShortName: amc?.shortName ?? fund.amcId,
    amcColor: amc?.logoColor ?? '#050c6c',
    equity,
    debt,
    hybrid,
    other,
    total,
  }
})

const instrumentTypes: InstrumentType[] = ['Hybrid', 'Debt', 'FD']

const investmentRanges: Record<InstrumentType, [number, number]> = {
  Hybrid: [8 * LAKH, 30 * LAKH],
  Debt: [10 * LAKH, 45 * LAKH],
  FD: [20 * LAKH, 80 * LAKH],
}

const frequencyBuckets: Record<
  BusinessUpdateFrequency,
  { count: number; step: (base: Date, index: number) => Date }
> = {
  monthly: { count: 14, step: (base, index) => shiftDays(base, -index) },
  quarterly: { count: 13, step: (base, index) => shiftDays(base, -index * 7) },
  yearly: { count: 12, step: (base, index) => shiftMonths(base, -index) },
}

export function businessUpdateRowsFor(frequency: BusinessUpdateFrequency): BusinessUpdateRow[] {
  const bucket = frequencyBuckets[frequency]
  const base = startOfToday()
  const scale = frequency === 'monthly' ? 1 : frequency === 'quarterly' ? 5 : 22
  return Array.from({ length: bucket.count }, (_, bucketIndex) =>
    instrumentTypes.map((type, typeIndex) => {
      const seed = bucketIndex * 31 + typeIndex * 7 + scale
      const [min, max] = investmentRanges[type]
      const investment = between(seed, min * scale, max * scale, 1000)
      const redemption = Math.round((investment * between(seed + 3, 18, 72)) / 100 / 1000) * 1000
      return {
        id: `business-${frequency}-${bucketIndex}-${type.toLowerCase()}`,
        date: isoDate(bucket.step(base, bucketIndex)),
        type,
        investment,
        redemption,
        netInvestment: investment - redemption,
      }
    }),
  ).flat()
}

export function businessUpdateCounts(
  rows: BusinessUpdateRow[],
): Record<BusinessUpdateFilter, number> {
  return {
    all: rows.length,
    Hybrid: rows.filter((row) => row.type === 'Hybrid').length,
    Debt: rows.filter((row) => row.type === 'Debt').length,
    FD: rows.filter((row) => row.type === 'FD').length,
  }
}
