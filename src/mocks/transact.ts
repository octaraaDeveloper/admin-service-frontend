import type {
  FdHolding,
  FdProvider,
  FdSchemeVariant,
  FixedDepositScheme,
  FundDetails,
  FundCategory,
  HoldingPoint,
  MfHolding,
  MutualFund,
  SipMandate,
} from '@/types'
import { fixedDepositSchemes, mutualFunds } from './funds'

const NAV_DATE = '2026-09-11'

const launchDates: Record<string, string> = {
  'mf-001': '2022-08-22',
  'mf-002': '2002-07-17',
  'mf-003': '2009-09-09',
  'mf-004': '2006-12-30',
  'mf-005': '2011-10-20',
  'mf-006': '2015-12-28',
  'mf-007': '2007-11-21',
  'mf-008': '2007-03-30',
  'mf-009': '2003-12-09',
  'mf-010': '2010-07-09',
  'mf-011': '2013-05-24',
  'mf-012': '2018-06-28',
  'mf-013': '2010-06-29',
  'mf-014': '1995-12-31',
  'mf-015': '2009-12-29',
}

const exitLoads: Record<FundCategory, string> = {
  'Large Cap': '1% < 1yr',
  'Mid Cap': '1% < 1yr',
  'Small Cap': '1% < 1yr',
  'Flexi Cap': '1% < 1yr',
  Hybrid: '1% < 1yr',
  Debt: 'Nil',
  Index: '0.25% < 7d',
  Sectoral: '1% < 1yr',
  'Commodity Gold': '1% < 15d',
  ELSS: 'Nil (3Y lock-in)',
}

export function toFundDetails(fund: MutualFund): FundDetails {
  return {
    ...fund,
    plan: 'Growth',
    navDate: NAV_DATE,
    exitLoad: exitLoads[fund.category],
    launchedAt: launchDates[fund.id] ?? '2012-01-02',
  }
}

export const fundDetailsList: FundDetails[] = mutualFunds.map(toFundDetails)

interface HoldingSeed {
  clientId: string
  fundId: string
  invested: number
  currentValue: number
  lastInvestedAt: string
  holdingSince: string
}

const mfHoldingSeeds: HoldingSeed[] = [
  {
    clientId: 'USER-9021456',
    fundId: 'mf-003',
    invested: 200000,
    currentValue: 245620,
    lastInvestedAt: '2026-07-18',
    holdingSince: '2025-01-10',
  },
  {
    clientId: 'USER-9021456',
    fundId: 'mf-002',
    invested: 150000,
    currentValue: 162300,
    lastInvestedAt: '2026-08-05',
    holdingSince: '2024-06-05',
  },
  {
    clientId: 'USER-9021456',
    fundId: 'mf-004',
    invested: 100000,
    currentValue: 112080,
    lastInvestedAt: '2026-09-05',
    holdingSince: '2024-03-15',
  },
  {
    clientId: 'USER-9021457',
    fundId: 'mf-011',
    invested: 400000,
    currentValue: 512400,
    lastInvestedAt: '2026-09-02',
    holdingSince: '2023-11-02',
  },
  {
    clientId: 'USER-9021457',
    fundId: 'mf-008',
    invested: 300000,
    currentValue: 361200,
    lastInvestedAt: '2026-08-02',
    holdingSince: '2024-02-02',
  },
  {
    clientId: 'USER-9021459',
    fundId: 'mf-013',
    invested: 1500000,
    currentValue: 1621000,
    lastInvestedAt: '2026-06-15',
    holdingSince: '2022-06-15',
  },
  {
    clientId: 'USER-9021459',
    fundId: 'mf-009',
    invested: 800000,
    currentValue: 843000,
    lastInvestedAt: '2026-08-20',
    holdingSince: '2025-02-20',
  },
  {
    clientId: 'USER-9021463',
    fundId: 'mf-014',
    invested: 500000,
    currentValue: 561000,
    lastInvestedAt: '2026-09-01',
    holdingSince: '2023-04-19',
  },
  {
    clientId: 'USER-9021463',
    fundId: 'mf-010',
    invested: 400000,
    currentValue: 452000,
    lastInvestedAt: '2026-09-01',
    holdingSince: '2024-01-19',
  },
  {
    clientId: 'USER-9021464',
    fundId: 'mf-011',
    invested: 1000000,
    currentValue: 1340000,
    lastInvestedAt: '2026-09-08',
    holdingSince: '2021-12-08',
  },
  {
    clientId: 'USER-9021464',
    fundId: 'mf-003',
    invested: 800000,
    currentValue: 1010000,
    lastInvestedAt: '2026-09-08',
    holdingSince: '2022-05-08',
  },
  {
    clientId: 'USER-9021467',
    fundId: 'mf-013',
    invested: 900000,
    currentValue: 985000,
    lastInvestedAt: '2026-07-11',
    holdingSince: '2022-02-11',
  },
]

function monthStart(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1)
}

function buildSeries(seed: HoldingSeed): HoldingPoint[] {
  const start = new Date(seed.holdingSince)
  const today = new Date()
  const months = Math.max(
    3,
    (today.getFullYear() - start.getFullYear()) * 12 + today.getMonth() - start.getMonth(),
  )
  const window = Math.min(months, 12)
  const first = monthStart(today, -window)
  return Array.from({ length: window + 1 }, (_, index) => {
    const progress = index / window
    const date = index === window ? today : monthStart(first, index)
    const contribution = seed.invested * (0.45 + 0.55 * progress)
    const growth = (seed.currentValue / seed.invested - 1) * progress
    const wobble = 1 + 0.035 * Math.sin(progress * 9 + seed.fundId.length)
    const value =
      index === window ? seed.currentValue : Math.round(contribution * (1 + growth) * wobble)
    return { date: date.toISOString().slice(0, 10), value }
  })
}

function toHolding(seed: HoldingSeed): MfHolding {
  const fund = mutualFunds.find((item) => item.id === seed.fundId)
  const nav = fund?.nav ?? 100
  const units = Math.round((seed.currentValue / nav) * 1000) / 1000
  return {
    fundId: seed.fundId,
    invested: seed.invested,
    currentValue: seed.currentValue,
    units,
    avgNav: Math.round((seed.invested / units) * 100) / 100,
    lastInvestedAt: seed.lastInvestedAt,
    holdingSince: seed.holdingSince,
    series: buildSeries(seed),
  }
}

export function mfHoldingFor(clientId: string, fundId: string): MfHolding | null {
  const seed = mfHoldingSeeds.find((item) => item.clientId === clientId && item.fundId === fundId)
  return seed ? toHolding(seed) : null
}

const mandatesByClient: Record<string, SipMandate[]> = {
  'USER-9021456': [
    {
      id: 'mnd-4521',
      bankName: 'HDFC Bank',
      accountMasked: '•••• 4521',
      limit: 100000,
      validTill: '2029-12-31',
      status: 'active',
    },
    {
      id: 'mnd-1234',
      bankName: 'IDFC FIRST Bank',
      accountMasked: '•••• 1234',
      limit: 200000,
      validTill: '2030-06-30',
      status: 'active',
    },
  ],
  'USER-9021457': [
    {
      id: 'mnd-8890',
      bankName: 'ICICI Bank',
      accountMasked: '•••• 8890',
      limit: 250000,
      validTill: '2031-03-31',
      status: 'active',
    },
  ],
  'USER-9021459': [
    {
      id: 'mnd-0042',
      bankName: 'State Bank of India',
      accountMasked: '•••• 0042',
      limit: 500000,
      validTill: '2032-01-31',
      status: 'active',
    },
  ],
  'USER-9021463': [
    {
      id: 'mnd-7731',
      bankName: 'Kotak Mahindra Bank',
      accountMasked: '•••• 7731',
      limit: 150000,
      validTill: '2030-09-30',
      status: 'pending',
    },
  ],
  'USER-9021464': [
    {
      id: 'mnd-5610',
      bankName: 'Axis Bank',
      accountMasked: '•••• 5610',
      limit: 300000,
      validTill: '2031-12-31',
      status: 'active',
    },
  ],
}

export function mandatesFor(clientId: string): SipMandate[] {
  return mandatesByClient[clientId] ?? []
}

const tenureRateOffsets: Record<number, number> = {
  12: -0.45,
  18: -0.3,
  24: -0.15,
  36: 0,
  44: 0.1,
  48: 0.1,
  60: 0.2,
  120: -0.25,
}

const round2 = (value: number) => Math.round(value * 100) / 100

function schemeVariants(seniorBonus: number): FdSchemeVariant[] {
  return [
    {
      id: 'regular',
      name: 'Regular Fixed Deposit',
      description: 'Standard deposit for resident individuals',
      rateBonus: 0,
      seniorCitizen: false,
      lockInMonths: null,
    },
    {
      id: 'senior-citizen',
      name: 'Senior Citizen Fixed Deposit',
      description: `Extra ${seniorBonus.toFixed(2)}% p.a. for depositors aged 60+`,
      rateBonus: 0,
      seniorCitizen: true,
      lockInMonths: null,
    },
    {
      id: 'tax-saver',
      name: 'Tax Saver Fixed Deposit',
      description: '5-year lock-in, eligible under Section 80C',
      rateBonus: 0,
      seniorCitizen: false,
      lockInMonths: 60,
    },
    {
      id: 'flexi',
      name: 'Flexi Fixed Deposit',
      description: 'Partial withdrawal without breaking the deposit',
      rateBonus: -0.25,
      seniorCitizen: false,
      lockInMonths: null,
    },
    {
      id: 'corporate',
      name: 'Corporate Fixed Deposit',
      description: 'For companies, trusts and partnership firms',
      rateBonus: -0.1,
      seniorCitizen: false,
      lockInMonths: null,
    },
    {
      id: 'nre',
      name: 'NRE Fixed Deposit',
      description: 'For non-resident Indians, fully repatriable',
      rateBonus: -0.15,
      seniorCitizen: false,
      lockInMonths: null,
    },
  ]
}

function toProvider(scheme: FixedDepositScheme): FdProvider {
  return {
    ...scheme,
    tenures: scheme.tenureMonths.map((months) => {
      const offset = tenureRateOffsets[months] ?? 0
      return {
        months,
        rate: round2(scheme.interestRate + offset),
        seniorCitizenRate: round2(scheme.seniorCitizenRate + offset),
      }
    }),
    schemes: schemeVariants(round2(scheme.seniorCitizenRate - scheme.interestRate)),
  }
}

export const fdProviders: FdProvider[] = fixedDepositSchemes.map(toProvider)

const fdHoldingsByClient: Record<string, FdHolding[]> = {
  'USER-9021456': [
    {
      providerId: 'fd-bajaj',
      schemeName: 'Regular Fixed Deposit',
      principal: 550000,
      currentValue: 588420,
      interestRate: 7.6,
      returnType: 'cumulative',
      depositedAt: '2025-10-18',
      maturesAt: '2027-10-18',
      tenureMonths: 24,
      maturityInstruction: 'auto-renew-principal-interest',
    },
  ],
  'USER-9021457': [
    {
      providerId: 'fd-shriram',
      schemeName: 'Regular Fixed Deposit',
      principal: 300000,
      currentValue: 318900,
      interestRate: 8.32,
      returnType: 'quarterly',
      depositedAt: '2025-12-02',
      maturesAt: '2027-12-02',
      tenureMonths: 24,
      maturityInstruction: 'credit-savings',
    },
  ],
  'USER-9021459': [
    {
      providerId: 'fd-lic',
      schemeName: 'Senior Citizen Fixed Deposit',
      principal: 1000000,
      currentValue: 1052300,
      interestRate: 7.75,
      returnType: 'cumulative',
      depositedAt: '2026-01-15',
      maturesAt: '2029-01-15',
      tenureMonths: 36,
      maturityInstruction: 'auto-renew-principal',
    },
  ],
  'USER-9021467': [
    {
      providerId: 'fd-mahindra',
      schemeName: 'Regular Fixed Deposit',
      principal: 600000,
      currentValue: 631200,
      interestRate: 7.75,
      returnType: 'monthly',
      depositedAt: '2026-02-11',
      maturesAt: '2029-02-11',
      tenureMonths: 36,
      maturityInstruction: 'close',
    },
  ],
}

export function fdHoldingFor(clientId: string, providerId: string): FdHolding | null {
  return (fdHoldingsByClient[clientId] ?? []).find((item) => item.providerId === providerId) ?? null
}
