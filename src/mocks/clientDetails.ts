import { clients } from './clients'
import { amcById, fundById, mutualFunds } from './funds'
import type {
  AddFamilyMemberInput,
  AutoMandate,
  Client,
  ClientHolding,
  ClientPortfolio,
  ClientPortfolioSummary,
  ClientProfile,
  ClientReport,
  CreateAutoMandateInput,
  FamilyCandidate,
  FamilyMember,
  OnboardClientInput,
  PanVerification,
} from '@/types'

const addresses = [
  'Flat 101, Blue Towers, Pune',
  '22, Palm Residency, Bandra West, Mumbai',
  'B-14, Sector 62, Noida',
  '7, Lake View Apartments, Powai, Mumbai',
  '45, Anna Nagar East, Chennai',
  'C-303, Prestige Lakeside, Bengaluru',
  '18, Civil Lines, Jaipur',
  '9, Marine Drive, Kochi',
  'H-2, Vasant Kunj, New Delhi',
  '31, Jubilee Hills, Hyderabad',
  '12, Salt Lake Sector V, Kolkata',
  '5, Model Town, Ludhiana',
  '204, Sky Heights, Ahmedabad',
  '66, Koregaon Park, Pune',
  '3, Banjara Hills, Hyderabad',
  '77, Indiranagar, Bengaluru',
]

const birthDates = [
  '1985-04-12',
  '1990-08-23',
  '1996-01-15',
  '1978-11-03',
  '1982-06-30',
  '1991-02-18',
  '1998-09-09',
  '1987-12-25',
  '1975-03-14',
  '1993-07-07',
  '1989-10-21',
  '1984-05-05',
  '1995-08-16',
  '1979-01-29',
  '1992-04-02',
  '1986-09-19',
]

const extras = new Map<string, { address: string; dob: string }>()
const deletedClientIds = new Set<string>()
const holdingOverrides = new Map<string, ClientHolding[]>()
const mandatesByClient = new Map<string, AutoMandate[]>()
const familyByClient = new Map<string, FamilyMember[]>()

let nextClientNumber = 9021472
let nextMandateNumber = 4923851
let nextMemberNumber = 100

function clientIndex(client: Client) {
  return Math.max(
    0,
    clients.findIndex((item) => item.id === client.id),
  )
}

function extrasFor(client: Client) {
  const known = extras.get(client.id)
  if (known) return known
  const index = clientIndex(client)
  return {
    address: addresses[index % addresses.length],
    dob: birthDates[index % birthDates.length],
  }
}

function withProfile(client: Client): ClientProfile {
  return { ...client, ...extrasFor(client) }
}

export function activeClients(): ClientProfile[] {
  return clients.filter((client) => !deletedClientIds.has(client.id)).map(withProfile)
}

export function clientProfileById(id: string): ClientProfile | undefined {
  if (deletedClientIds.has(id)) return undefined
  const client = clients.find((item) => item.id === id)
  return client && withProfile(client)
}

export function clientByPan(pan: string) {
  return activeClients().find((client) => client.pan === pan)
}

export function panLookup(pan: string): PanVerification {
  const names = ['ROHAN SINGH', 'MEERA JOSHI', 'ARJUN NAIR', 'ISHITA RAO', 'DEV MALHOTRA']
  const cities = [
    '11, VASHI PLAZA, SEC 17, VASHI, NAVI MUMBAI, MUMBAI, MAHARASHTRA, 400703',
    '402, SUNRISE TOWERS, ANDHERI EAST, MUMBAI, MAHARASHTRA, 400069',
    '23, RESIDENCY ROAD, BENGALURU, KARNATAKA, 560025',
    'PLOT 8, SECTOR 21, GURUGRAM, HARYANA, 122016',
    '16, ALWARPET, CHENNAI, TAMIL NADU, 600018',
  ]
  const seed = pan.charCodeAt(4) + pan.charCodeAt(8)
  return { pan, name: names[seed % names.length], address: cities[seed % cities.length] }
}

export function addClient(input: OnboardClientInput): ClientProfile {
  const client: Client = {
    id: `USER-${nextClientNumber++}`,
    name: titleCase(input.name),
    email: input.email,
    mobile: input.mobile,
    pan: input.pan,
    avatarUrl: null,
    aum: 0,
    kycStatus: 'pending',
    riskProfile: 'Medium',
    joinedAt: new Date().toISOString().slice(0, 10),
    sipCount: 0,
    monthlySip: 0,
  }
  clients.push(client)
  extras.set(client.id, { address: input.address, dob: input.dob })
  holdingOverrides.set(client.id, [])
  mandatesByClient.set(client.id, [])
  familyByClient.set(client.id, [])
  return withProfile(client)
}

export function removeClient(id: string) {
  deletedClientIds.add(id)
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

function seeded(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 233280
  return value - Math.floor(value)
}

function buildHolding(
  clientId: string,
  fundId: string,
  invested: number,
  current: number,
  sipAmount: number | null,
  index: number,
): ClientHolding {
  const fund = fundById(fundId) ?? mutualFunds[0]
  const amc = amcById(fund.amcId)
  const returnsPct = ((current - invested) / invested) * 100
  return {
    id: `${clientId}-${fund.id}`,
    fundId: fund.id,
    fundName: fund.name,
    category: fund.category,
    assetClass: fund.assetClass,
    amcShortName: amc?.shortName ?? fund.name.slice(0, 2),
    amcColor: amc?.logoColor ?? 'var(--color-brand)',
    folio: `${String(1000 + index * 7).padStart(4, '0')}${clientId.slice(-4)}/${index + 1}`,
    units: Math.round((current / fund.nav) * 1000) / 1000,
    invested,
    current,
    returnsPct,
    xirr: Math.round(returnsPct * 0.74 * 100) / 100,
    sipAmount,
  }
}

const featuredHoldings: [string, number, number, number | null][] = [
  ['mf-001', 250000, 312400, 5000],
  ['mf-003', 250000, 298600, 5000],
  ['mf-005', 310000, 337203, 5000],
]

function holdingsFor(client: Client): ClientHolding[] {
  const override = holdingOverrides.get(client.id)
  if (override) return override
  const index = clientIndex(client)
  if (index === 0) {
    return featuredHoldings.map(([fundId, invested, current, sip], position) =>
      buildHolding(client.id, fundId, invested, current, sip, position),
    )
  }
  if (client.aum === 0) return []
  const count = Math.min(6, Math.max(2, Math.round(client.aum / 350000) + 1))
  const weights = Array.from(
    { length: count },
    (_, position) => 0.6 + seeded(index * 11 + position),
  )
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  return weights.map((weight, position) => {
    const fund = mutualFunds[(index * 5 + position * 3) % mutualFunds.length]
    const current = Math.round((client.aum * weight) / totalWeight / 100) * 100
    const growth = 0.86 + seeded(index * 17 + position) * 0.42
    const invested = Math.round(current / growth / 100) * 100
    const sip =
      position < client.sipCount ? Math.max(500, Math.round(client.monthlySip / 500) * 100) : null
    return buildHolding(client.id, fund.id, invested, current, sip, position)
  })
}

function summarize(holdings: ClientHolding[]): ClientPortfolioSummary {
  const invested = holdings.reduce((sum, holding) => sum + holding.invested, 0)
  const current = holdings.reduce((sum, holding) => sum + holding.current, 0)
  const returns = current - invested
  return {
    invested,
    current,
    returns,
    returnsPct: invested === 0 ? 0 : (returns / invested) * 100,
  }
}

export function portfolioFor(client: Client): ClientPortfolio {
  const holdings = holdingsFor(client)
  return { summary: summarize(holdings), holdings }
}

const banks = ['HDFC BANK', 'ICICI BANK', 'SBI', 'AXIS BANK', 'KOTAK MAHINDRA BANK']

function buildMandate(
  clientId: string,
  position: number,
  status: AutoMandate['status'],
  overrides: Partial<AutoMandate> = {},
): AutoMandate {
  const seed = clientId.charCodeAt(clientId.length - 1) + position
  return {
    id: `${clientId}-mandate-${position}`,
    umrn: `kk2738${82 + position}KH${4923848 + seed}`,
    bank: banks[seed % banks.length],
    accountLast4: String(1234 + seed * 37).slice(-4),
    amountLimit: [150000, 100000, 50000, 250000][seed % 4],
    validTill: `20${35 + (seed % 6)}-${String(1 + (seed % 12)).padStart(2, '0')}-01`,
    createdAt: `2025-0${1 + (seed % 9)}-${String(1 + (seed % 27)).padStart(2, '0')}`,
    status,
    ...overrides,
  }
}

export function mandatesFor(client: Client): AutoMandate[] {
  const known = mandatesByClient.get(client.id)
  if (known) return known
  const index = clientIndex(client)
  const list =
    index === 0
      ? [
          buildMandate(client.id, 0, 'Processing', {
            umrn: 'kk273882KH4923848',
            bank: 'HDFC BANK',
            accountLast4: '1234',
            amountLimit: 150000,
            validTill: '2040-03-01',
            createdAt: '2025-09-19',
          }),
          buildMandate(client.id, 1, 'Active', {
            bank: 'HDFC BANK',
            accountLast4: '1234',
            amountLimit: 150000,
            validTill: '2040-03-01',
            createdAt: '2025-09-19',
          }),
          buildMandate(client.id, 2, 'Processing', {
            bank: 'ICICI BANK',
            accountLast4: '8841',
            amountLimit: 100000,
          }),
        ]
      : Array.from({ length: index % 3 }, (_, position) =>
          buildMandate(client.id, position, position === 0 ? 'Active' : 'Processing'),
        )
  mandatesByClient.set(client.id, list)
  return list
}

export function addMandate(client: Client, input: CreateAutoMandateInput): AutoMandate {
  const list = mandatesFor(client)
  const mandate: AutoMandate = {
    id: `${client.id}-mandate-${nextMandateNumber}`,
    umrn: `kk2739${String(nextMandateNumber).slice(-2)}KH${nextMandateNumber}`,
    bank: input.bank,
    accountLast4: input.accountNumber.slice(-4),
    amountLimit: input.amountLimit,
    validTill: input.validTill,
    createdAt: new Date().toISOString().slice(0, 10),
    status: 'Processing',
  }
  nextMandateNumber += 1
  mandatesByClient.set(client.id, [mandate, ...list])
  return mandate
}

export function removeMandate(client: Client, mandateId: string) {
  mandatesByClient.set(
    client.id,
    mandatesFor(client).filter((mandate) => mandate.id !== mandateId),
  )
}

const featuredFamily: Omit<FamilyMember, 'id'>[] = [
  { name: 'Sunita Kumar', relationship: 'Spouse', linkedClientId: null, aum: 380000 },
  { name: 'Kamla Devi', relationship: 'Mother', linkedClientId: null, aum: 210000 },
  { name: 'Aarav Kumar', relationship: 'Son', linkedClientId: null, aum: 45000 },
  { name: 'Riya Kumar', relationship: 'Daughter', linkedClientId: null, aum: 32000 },
]

export function familyFor(client: Client): FamilyMember[] {
  const known = familyByClient.get(client.id)
  if (known) return known
  const index = clientIndex(client)
  const surname = client.name.split(' ').slice(-1)[0]
  const list: FamilyMember[] =
    index === 0
      ? featuredFamily.map((member, position) => ({
          id: `${client.id}-fam-${position}`,
          name: member.name,
          relationship: member.relationship,
          linkedClientId: member.linkedClientId,
          aum: member.aum,
        }))
      : index % 2 === 0
        ? [
            {
              id: `${client.id}-fam-0`,
              name: `${['Asha', 'Ravi', 'Meena', 'Karan'][index % 4]} ${surname}`,
              relationship: index % 4 === 0 ? 'Spouse' : 'Father',
              linkedClientId: null,
              aum: Math.round(client.aum * 0.35),
            },
          ]
        : []
  familyByClient.set(client.id, list)
  return list
}

export function familyCandidates(client: Client): FamilyCandidate[] {
  const linked = new Set(familyFor(client).map((member) => member.linkedClientId))
  return activeClients()
    .filter((candidate) => candidate.id !== client.id && !linked.has(candidate.id))
    .map((candidate) => ({ id: candidate.id, name: candidate.name }))
}

export function addFamilyMember(client: Client, input: AddFamilyMemberInput): FamilyMember {
  const candidate = clientProfileById(input.candidateId)
  const member: FamilyMember = {
    id: `${client.id}-fam-${nextMemberNumber++}`,
    name: candidate?.name ?? 'Family member',
    relationship: input.relationship,
    linkedClientId: candidate?.id ?? null,
    aum: candidate?.aum ?? 0,
  }
  familyByClient.set(client.id, [...familyFor(client), member])
  return member
}

export function removeFamilyMember(client: Client, memberId: string) {
  familyByClient.set(
    client.id,
    familyFor(client).filter((member) => member.id !== memberId),
  )
}

export function reportFor(client: Client): ClientReport {
  const holdings = holdingsFor(client)
  const summary = summarize(holdings)
  const byAsset = new Map<string, number>()
  for (const holding of holdings) {
    byAsset.set(holding.assetClass, (byAsset.get(holding.assetClass) ?? 0) + holding.current)
  }
  const allocation = [...byAsset.entries()]
    .map(([label, value]) => ({
      label,
      value,
      share: summary.current === 0 ? 0 : (value / summary.current) * 100,
    }))
    .toSorted((a, b) => b.value - a.value)
  const family = familyFor(client)
  const familyTotal = family.reduce((sum, member) => sum + member.aum, 0) + summary.current
  const members = [
    {
      id: client.id,
      name: client.name,
      relationship: 'Self',
      invested: summary.invested,
      returns: summary.returns,
      gainPct: summary.returnsPct,
      share: familyTotal === 0 ? 0 : (summary.current / familyTotal) * 100,
    },
    ...family.map((member, position) => {
      const growth = 1.04 + seeded(position + client.aum) * 0.18
      const invested = Math.round(member.aum / growth)
      return {
        id: member.id,
        name: member.name,
        relationship: member.relationship,
        invested,
        returns: member.aum - invested,
        gainPct: invested === 0 ? 0 : ((member.aum - invested) / invested) * 100,
        share: familyTotal === 0 ? 0 : (member.aum / familyTotal) * 100,
      }
    }),
  ]
  return { summary, allocation, members, holdings, generatedAt: new Date().toISOString() }
}
