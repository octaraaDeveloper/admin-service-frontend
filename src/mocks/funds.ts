import type {
  AllocationSlice,
  Amc,
  AmcSummary,
  AssetClass,
  FixedDepositDetails,
  FixedDepositScheme,
  FundCategory,
  FundHolding,
  FundManager,
  MutualFund,
  MutualFundDetails,
  MutualFundListItem,
  NavPoint,
  TenureRate,
} from '@/types'

export const amcs: Amc[] = [
  {
    id: 'amc-motilal',
    name: 'Motilal Oswal Mutual Fund',
    shortName: 'Motilal',
    logoColor: '#f5a623',
  },
  { id: 'amc-hdfc', name: 'HDFC Mutual Fund', shortName: 'HDFC', logoColor: '#0b4ea2' },
  { id: 'amc-sbi', name: 'SBI Mutual Fund', shortName: 'SBI', logoColor: '#2a6ebb' },
  {
    id: 'amc-icici',
    name: 'ICICI Prudential Mutual Fund',
    shortName: 'ICICI',
    logoColor: '#b02a30',
  },
  { id: 'amc-axis', name: 'Axis Mutual Fund', shortName: 'Axis', logoColor: '#97144d' },
  { id: 'amc-tata', name: 'Tata Mutual Fund', shortName: 'Tata', logoColor: '#1f5fa8' },
  { id: 'amc-invesco', name: 'Invesco Mutual Fund', shortName: 'Invesco', logoColor: '#0a3d8f' },
  { id: 'amc-kotak', name: 'Kotak Mahindra Mutual Fund', shortName: 'Kotak', logoColor: '#ed1c24' },
  { id: 'amc-nippon', name: 'Nippon India Mutual Fund', shortName: 'Nippon', logoColor: '#d71920' },
  { id: 'amc-mirae', name: 'Mirae Asset Mutual Fund', shortName: 'Mirae', logoColor: '#f26522' },
  { id: 'amc-parag', name: 'PPFAS Mutual Fund', shortName: 'PPFAS', logoColor: '#1b8a5a' },
  { id: 'amc-uti', name: 'UTI Mutual Fund', shortName: 'UTI', logoColor: '#e4002b' },
  {
    id: 'amc-edelweiss',
    name: 'Edelweiss Mutual Fund',
    shortName: 'Edelweiss',
    logoColor: '#7a3e9d',
  },
  { id: 'amc-quant', name: 'Quant Mutual Fund', shortName: 'Quant', logoColor: '#0f766e' },
  { id: 'amc-dsp', name: 'DSP Mutual Fund', shortName: 'DSP', logoColor: '#1c3f95' },
  {
    id: 'amc-aditya',
    name: 'Aditya Birla Sun Life Mutual Fund',
    shortName: 'ABSL',
    logoColor: '#c8102e',
  },
]

export const mutualFunds: MutualFund[] = [
  {
    id: 'mf-001',
    amcId: 'amc-motilal',
    name: 'Motilal Oswal BSE Enhanced Value Index Fund',
    category: 'Index',
    assetClass: 'Equity',
    returns1y: -2.27,
    returns3y: 20.27,
    returns5y: 30.27,
    rating: 5,
    expenseRatio: 0.21,
    aum: 9800000000,
    risk: 'Very High',
    nav: 42.18,
    minSip: 500,
    minLumpsum: 500,
  },
  {
    id: 'mf-002',
    amcId: 'amc-hdfc',
    name: 'HDFC Nifty 50 Index Fund Growth',
    category: 'Large Cap',
    assetClass: 'Equity',
    returns1y: 1.45,
    returns3y: 10.35,
    returns5y: 25.5,
    rating: 4,
    expenseRatio: 0.2,
    aum: 152000000000,
    risk: 'High',
    nav: 218.64,
    minSip: 100,
    minLumpsum: 100,
  },
  {
    id: 'mf-003',
    amcId: 'amc-sbi',
    name: 'SBI Small Cap Fund',
    category: 'Small Cap',
    assetClass: 'Equity',
    returns1y: 3.2,
    returns3y: 15.75,
    returns5y: 22.1,
    rating: 3,
    expenseRatio: 0.68,
    aum: 331000000000,
    risk: 'Very High',
    nav: 176.9,
    minSip: 500,
    minLumpsum: 5000,
  },
  {
    id: 'mf-004',
    amcId: 'amc-icici',
    name: 'ICICI Prudential Balanced Advantage Fund',
    category: 'Hybrid',
    assetClass: 'Hybrid',
    returns1y: 0.75,
    returns3y: 12.5,
    returns5y: 18.75,
    rating: 4,
    expenseRatio: 0.87,
    aum: 612000000000,
    risk: 'Medium',
    nav: 71.2,
    minSip: 100,
    minLumpsum: 500,
  },
  {
    id: 'mf-005',
    amcId: 'amc-axis',
    name: 'Axis Gold ETF Fund of Fund',
    category: 'Commodity Gold',
    assetClass: 'Other',
    returns1y: 2.0,
    returns3y: 5.0,
    returns5y: 15.0,
    rating: 5,
    expenseRatio: 0.17,
    aum: 8400000000,
    risk: 'Low',
    nav: 24.55,
    minSip: 100,
    minLumpsum: 500,
  },
  {
    id: 'mf-006',
    amcId: 'amc-tata',
    name: 'Tata Digital India Fund',
    category: 'Sectoral',
    assetClass: 'Equity',
    returns1y: 2.5,
    returns3y: 7.5,
    returns5y: 20.0,
    rating: 4,
    expenseRatio: 0.32,
    aum: 118000000000,
    risk: 'Very High',
    nav: 51.33,
    minSip: 150,
    minLumpsum: 5000,
  },
  {
    id: 'mf-007',
    amcId: 'amc-invesco',
    name: 'Invesco India Infrastructure Fund',
    category: 'Sectoral',
    assetClass: 'Equity',
    returns1y: -1.1,
    returns3y: 24.8,
    returns5y: 28.4,
    rating: 4,
    expenseRatio: 0.74,
    aum: 16500000000,
    risk: 'Very High',
    nav: 68.02,
    minSip: 500,
    minLumpsum: 1000,
  },
  {
    id: 'mf-008',
    amcId: 'amc-kotak',
    name: 'Kotak Emerging Equity Fund',
    category: 'Mid Cap',
    assetClass: 'Equity',
    returns1y: 4.6,
    returns3y: 19.1,
    returns5y: 27.3,
    rating: 4,
    expenseRatio: 0.38,
    aum: 512000000000,
    risk: 'Very High',
    nav: 128.7,
    minSip: 100,
    minLumpsum: 100,
  },
  {
    id: 'mf-009',
    amcId: 'amc-nippon',
    name: 'Nippon India Liquid Fund',
    category: 'Debt',
    assetClass: 'Debt',
    returns1y: 7.1,
    returns3y: 6.6,
    returns5y: 5.4,
    rating: 5,
    expenseRatio: 0.15,
    aum: 296000000000,
    risk: 'Low',
    nav: 6321.45,
    minSip: 100,
    minLumpsum: 100,
  },
  {
    id: 'mf-010',
    amcId: 'amc-mirae',
    name: 'Mirae Asset Large & Midcap Fund',
    category: 'Large Cap',
    assetClass: 'Equity',
    returns1y: 2.9,
    returns3y: 14.2,
    returns5y: 23.8,
    rating: 4,
    expenseRatio: 0.59,
    aum: 398000000000,
    risk: 'Very High',
    nav: 148.12,
    minSip: 99,
    minLumpsum: 5000,
  },
  {
    id: 'mf-011',
    amcId: 'amc-parag',
    name: 'Parag Parikh Flexi Cap Fund',
    category: 'Flexi Cap',
    assetClass: 'Equity',
    returns1y: 6.4,
    returns3y: 17.9,
    returns5y: 26.1,
    rating: 5,
    expenseRatio: 0.63,
    aum: 1030000000000,
    risk: 'Very High',
    nav: 88.9,
    minSip: 1000,
    minLumpsum: 1000,
  },
  {
    id: 'mf-012',
    amcId: 'amc-uti',
    name: 'UTI Nifty Next 50 Index Fund',
    category: 'Index',
    assetClass: 'Equity',
    returns1y: -3.8,
    returns3y: 16.3,
    returns5y: 21.7,
    rating: 3,
    expenseRatio: 0.35,
    aum: 48000000000,
    risk: 'Very High',
    nav: 21.06,
    minSip: 500,
    minLumpsum: 1000,
  },
  {
    id: 'mf-013',
    amcId: 'amc-hdfc',
    name: 'HDFC Corporate Bond Fund',
    category: 'Debt',
    assetClass: 'Debt',
    returns1y: 8.2,
    returns3y: 6.9,
    returns5y: 6.7,
    rating: 4,
    expenseRatio: 0.36,
    aum: 322000000000,
    risk: 'Low',
    nav: 32.14,
    minSip: 100,
    minLumpsum: 100,
  },
  {
    id: 'mf-014',
    amcId: 'amc-sbi',
    name: 'SBI Equity Hybrid Fund',
    category: 'Hybrid',
    assetClass: 'Hybrid',
    returns1y: 3.4,
    returns3y: 11.8,
    returns5y: 17.2,
    rating: 3,
    expenseRatio: 0.73,
    aum: 748000000000,
    risk: 'High',
    nav: 285.6,
    minSip: 500,
    minLumpsum: 1000,
  },
  {
    id: 'mf-015',
    amcId: 'amc-axis',
    name: 'Axis ELSS Tax Saver Fund',
    category: 'ELSS',
    assetClass: 'Equity',
    returns1y: 1.2,
    returns3y: 9.6,
    returns5y: 15.9,
    rating: 2,
    expenseRatio: 0.78,
    aum: 356000000000,
    risk: 'Very High',
    nav: 96.4,
    minSip: 500,
    minLumpsum: 500,
  },
  {
    id: 'mf-016',
    amcId: 'amc-icici',
    name: 'ICICI Prudential Bluechip Fund',
    category: 'Large Cap',
    assetClass: 'Equity',
    returns1y: 5.8,
    returns3y: 16.4,
    returns5y: 21.9,
    rating: 4,
    expenseRatio: 0.86,
    aum: 685000000000,
    risk: 'Very High',
    nav: 112.34,
    minSip: 100,
    minLumpsum: 100,
  },
  {
    id: 'mf-017',
    amcId: 'amc-nippon',
    name: 'Nippon India Small Cap Fund',
    category: 'Small Cap',
    assetClass: 'Equity',
    returns1y: -4.6,
    returns3y: 22.7,
    returns5y: 32.4,
    rating: 5,
    expenseRatio: 0.64,
    aum: 610000000000,
    risk: 'Very High',
    nav: 168.45,
    minSip: 100,
    minLumpsum: 5000,
  },
  {
    id: 'mf-018',
    amcId: 'amc-kotak',
    name: 'Kotak Flexicap Fund',
    category: 'Flexi Cap',
    assetClass: 'Equity',
    returns1y: 4.1,
    returns3y: 13.9,
    returns5y: 19.6,
    rating: 3,
    expenseRatio: 0.61,
    aum: 512000000000,
    risk: 'Very High',
    nav: 82.17,
    minSip: 100,
    minLumpsum: 100,
  },
  {
    id: 'mf-019',
    amcId: 'amc-motilal',
    name: 'Motilal Oswal Midcap Fund',
    category: 'Mid Cap',
    assetClass: 'Equity',
    returns1y: 8.9,
    returns3y: 28.6,
    returns5y: 31.2,
    rating: 5,
    expenseRatio: 0.58,
    aum: 264000000000,
    risk: 'Very High',
    nav: 108.6,
    minSip: 500,
    minLumpsum: 500,
  },
  {
    id: 'mf-020',
    amcId: 'amc-uti',
    name: 'UTI Nifty 50 Index Fund',
    category: 'Index',
    assetClass: 'Equity',
    returns1y: 1.9,
    returns3y: 10.8,
    returns5y: 19.4,
    rating: 4,
    expenseRatio: 0.18,
    aum: 221000000000,
    risk: 'Very High',
    nav: 168.9,
    minSip: 500,
    minLumpsum: 1000,
  },
  {
    id: 'mf-021',
    amcId: 'amc-sbi',
    name: 'SBI Magnum Gilt Fund',
    category: 'Debt',
    assetClass: 'Debt',
    returns1y: 9.4,
    returns3y: 7.8,
    returns5y: 6.9,
    rating: 4,
    expenseRatio: 0.46,
    aum: 118000000000,
    risk: 'Low',
    nav: 68.42,
    minSip: 500,
    minLumpsum: 5000,
  },
  {
    id: 'mf-022',
    amcId: 'amc-axis',
    name: 'Axis Short Duration Fund',
    category: 'Debt',
    assetClass: 'Debt',
    returns1y: 7.6,
    returns3y: 6.5,
    returns5y: 6.2,
    rating: 3,
    expenseRatio: 0.34,
    aum: 99000000000,
    risk: 'Medium',
    nav: 29.87,
    minSip: 1000,
    minLumpsum: 5000,
  },
  {
    id: 'mf-023',
    amcId: 'amc-hdfc',
    name: 'HDFC Hybrid Equity Fund',
    category: 'Hybrid',
    assetClass: 'Hybrid',
    returns1y: 2.7,
    returns3y: 11.2,
    returns5y: 16.8,
    rating: 3,
    expenseRatio: 1.02,
    aum: 246000000000,
    risk: 'High',
    nav: 114.7,
    minSip: 100,
    minLumpsum: 100,
  },
  {
    id: 'mf-024',
    amcId: 'amc-mirae',
    name: 'Mirae Asset ELSS Tax Saver Fund',
    category: 'ELSS',
    assetClass: 'Equity',
    returns1y: 3.6,
    returns3y: 15.1,
    returns5y: 22.6,
    rating: 4,
    expenseRatio: 0.56,
    aum: 263000000000,
    risk: 'Very High',
    nav: 48.2,
    minSip: 500,
    minLumpsum: 500,
  },
  {
    id: 'mf-025',
    amcId: 'amc-tata',
    name: 'Tata Gold ETF Fund of Fund',
    category: 'Commodity Gold',
    assetClass: 'Other',
    returns1y: 24.8,
    returns3y: 17.5,
    returns5y: 14.2,
    rating: 4,
    expenseRatio: 0.19,
    aum: 6400000000,
    risk: 'Medium',
    nav: 15.62,
    minSip: 150,
    minLumpsum: 5000,
  },
  {
    id: 'mf-026',
    amcId: 'amc-edelweiss',
    name: 'Edelweiss US Technology Equity Fund of Fund',
    category: 'Sectoral',
    assetClass: 'Equity',
    returns1y: 12.3,
    returns3y: 18.2,
    returns5y: 15.7,
    rating: 3,
    expenseRatio: 1.42,
    aum: 29000000000,
    risk: 'Very High',
    nav: 27.9,
    minSip: 100,
    minLumpsum: 100,
  },
  {
    id: 'mf-027',
    amcId: 'amc-quant',
    name: 'Quant Small Cap Fund',
    category: 'Small Cap',
    assetClass: 'Equity',
    returns1y: -7.2,
    returns3y: 21.9,
    returns5y: 38.6,
    rating: 4,
    expenseRatio: 0.64,
    aum: 278000000000,
    risk: 'Very High',
    nav: 248.3,
    minSip: 1000,
    minLumpsum: 5000,
  },
  {
    id: 'mf-028',
    amcId: 'amc-dsp',
    name: 'DSP Nifty 50 Equal Weight Index Fund',
    category: 'Index',
    assetClass: 'Equity',
    returns1y: -0.9,
    returns3y: 14.6,
    returns5y: 22.3,
    rating: 3,
    expenseRatio: 0.4,
    aum: 21000000000,
    risk: 'Very High',
    nav: 24.16,
    minSip: 100,
    minLumpsum: 100,
  },
  {
    id: 'mf-029',
    amcId: 'amc-aditya',
    name: 'Aditya Birla Sun Life Liquid Fund',
    category: 'Debt',
    assetClass: 'Debt',
    returns1y: 7.2,
    returns3y: 6.7,
    returns5y: 5.5,
    rating: 5,
    expenseRatio: 0.21,
    aum: 448000000000,
    risk: 'Low',
    nav: 412.58,
    minSip: 500,
    minLumpsum: 500,
  },
  {
    id: 'mf-030',
    amcId: 'amc-parag',
    name: 'Parag Parikh Conservative Hybrid Fund',
    category: 'Hybrid',
    assetClass: 'Hybrid',
    returns1y: 9.1,
    returns3y: 10.4,
    returns5y: 9.8,
    rating: 4,
    expenseRatio: 0.34,
    aum: 32000000000,
    risk: 'Medium',
    nav: 14.85,
    minSip: 1000,
    minLumpsum: 5000,
  },
]

export const fixedDepositSchemes: FixedDepositScheme[] = [
  {
    id: 'fd-bajaj',
    bank: 'Bajaj Finance',
    name: 'Bajaj Finance Fixed Deposit',
    interestRate: 8.05,
    seniorCitizenRate: 8.3,
    minAmount: 15000,
    tenureMonths: [12, 24, 36, 44, 60],
    rating: 'CRISIL AAA',
  },
  {
    id: 'fd-shriram',
    bank: 'Shriram Finance',
    name: 'Shriram Unnati Fixed Deposit',
    interestRate: 8.47,
    seniorCitizenRate: 8.97,
    minAmount: 5000,
    tenureMonths: [12, 18, 24, 36, 60],
    rating: 'ICRA AA+',
  },
  {
    id: 'fd-mahindra',
    bank: 'Mahindra Finance',
    name: 'Mahindra Finance Fixed Deposit',
    interestRate: 7.75,
    seniorCitizenRate: 8.0,
    minAmount: 5000,
    tenureMonths: [12, 24, 36, 48, 60],
    rating: 'CRISIL AAA',
  },
  {
    id: 'fd-pnbhf',
    bank: 'PNB Housing Finance',
    name: 'PNB Housing Fixed Deposit',
    interestRate: 7.6,
    seniorCitizenRate: 7.9,
    minAmount: 10000,
    tenureMonths: [12, 24, 36, 60, 120],
    rating: 'CRISIL AA',
  },
  {
    id: 'fd-lic',
    bank: 'LIC Housing Finance',
    name: 'LIC HFL Sanchay Deposit',
    interestRate: 7.5,
    seniorCitizenRate: 7.75,
    minAmount: 20000,
    tenureMonths: [12, 18, 24, 36, 60],
    rating: 'CRISIL AAA',
  },
  {
    id: 'fd-icici',
    bank: 'ICICI Bank',
    name: 'ICICI Bank Fixed Deposit',
    interestRate: 7.1,
    seniorCitizenRate: 7.6,
    minAmount: 10000,
    tenureMonths: [6, 12, 24, 36, 60],
    rating: 'Scheduled bank',
  },
  {
    id: 'fd-utkarsh',
    bank: 'Utkarsh Small Finance Bank',
    name: 'Utkarsh SFB Fixed Deposit',
    interestRate: 8.5,
    seniorCitizenRate: 9.1,
    minAmount: 1000,
    tenureMonths: [6, 12, 24, 36, 60],
    rating: 'DICGC insured',
  },
]

export const amcById = (id: string) => amcs.find((amc) => amc.id === id)
export const fundById = (id: string) => mutualFunds.find((fund) => fund.id === id)

export const withAmc = (fund: MutualFund): MutualFundListItem => ({
  ...fund,
  amc: amcById(fund.amcId) ?? amcs[0],
})

function seededRandom(seed: string) {
  let state = 0
  for (const char of seed) state = (state * 31 + char.charCodeAt(0)) >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function lastBusinessDay() {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  while (date.getDay() === 0 || date.getDay() === 6) date.setDate(date.getDate() - 1)
  return date
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

const benchmarks: Record<FundCategory, string> = {
  'Large Cap': 'NIFTY 100 TRI',
  'Mid Cap': 'NIFTY Midcap 150 TRI',
  'Small Cap': 'NIFTY Smallcap 250 TRI',
  'Flexi Cap': 'NIFTY 500 TRI',
  Hybrid: 'CRISIL Hybrid 35+65 Aggressive Index',
  Debt: 'CRISIL Short Duration Debt Index',
  Index: 'NIFTY 50 TRI',
  Sectoral: 'NIFTY IT TRI',
  'Commodity Gold': 'Domestic price of physical gold',
  ELSS: 'NIFTY 500 TRI',
}

const objectives: Record<AssetClass, string> = {
  Equity:
    'generate long-term capital appreciation by investing predominantly in equity and equity-related instruments',
  Debt: 'generate regular income with low volatility through a portfolio of high-quality debt and money market instruments',
  Hybrid:
    'balance growth and stability by dynamically allocating between equity and fixed income instruments',
  Other:
    'provide returns that closely track the domestic price of gold by investing in gold ETF units',
}

const managerPool = [
  'Raviprakash Sharma',
  'Prakash Menon',
  'Anupam Tiwari',
  'Sankaran Naren',
  'Neelesh Surana',
  'Rajeev Thakkar',
  'Chirag Setalvad',
  'Shreyash Devalkar',
  'R. Srinivasan',
  'Harsha Upadhyaya',
]

const equityHoldings: Omit<FundHolding, 'weight'>[] = [
  { name: 'HDFC Bank', sector: 'Financial', instrument: 'Equity' },
  { name: 'ICICI Bank', sector: 'Financial', instrument: 'Equity' },
  { name: 'Reliance Industries', sector: 'Energy', instrument: 'Equity' },
  { name: 'Infosys', sector: 'Technology', instrument: 'Equity' },
  { name: 'Bharti Airtel', sector: 'Communication', instrument: 'Equity' },
  { name: 'Larsen & Toubro', sector: 'Construction', instrument: 'Equity' },
  { name: 'Tata Consultancy Services', sector: 'Technology', instrument: 'Equity' },
  { name: 'Axis Bank', sector: 'Financial', instrument: 'Equity' },
  { name: 'Sun Pharmaceutical', sector: 'Healthcare', instrument: 'Equity' },
  { name: 'Mahindra & Mahindra', sector: 'Automobile', instrument: 'Equity' },
]

const sectoralHoldings: Omit<FundHolding, 'weight'>[] = [
  { name: 'Microsoft Corporation', sector: 'Technology', instrument: 'Equity' },
  { name: 'NVIDIA Corporation', sector: 'Technology', instrument: 'Equity' },
  { name: 'Apple Inc.', sector: 'Technology', instrument: 'Equity' },
  { name: 'Alphabet Inc.', sector: 'Communication', instrument: 'Equity' },
  { name: 'Infosys', sector: 'Technology', instrument: 'Equity' },
  { name: 'Tata Consultancy Services', sector: 'Technology', instrument: 'Equity' },
  { name: 'HCL Technologies', sector: 'Technology', instrument: 'Equity' },
  { name: 'Power Grid Corporation of India', sector: 'Energy', instrument: 'Equity' },
  { name: 'Tata Power Company', sector: 'Energy', instrument: 'Equity' },
  { name: 'NTPC Limited', sector: 'Energy', instrument: 'Equity' },
]

const debtHoldings: Omit<FundHolding, 'weight'>[] = [
  { name: '7.18% GOI 2033', sector: 'Sovereign', instrument: 'G-Sec' },
  { name: '91 Day Treasury Bill', sector: 'Sovereign', instrument: 'T-Bill' },
  { name: 'NABARD 7.40% 2027', sector: 'Financial', instrument: 'Corporate bond' },
  { name: 'REC 7.55% 2028', sector: 'Energy', instrument: 'Corporate bond' },
  { name: 'HDFC Bank CD', sector: 'Financial', instrument: 'Certificate of deposit' },
  { name: 'LIC Housing Finance 7.65% 2027', sector: 'Financial', instrument: 'Corporate bond' },
  { name: 'Reliance Industries CP', sector: 'Energy', instrument: 'Commercial paper' },
  { name: 'PFC 7.44% 2029', sector: 'Financial', instrument: 'Corporate bond' },
]

const goldHoldings: Omit<FundHolding, 'weight'>[] = [
  { name: 'Physical gold (995 purity)', sector: 'Commodity', instrument: 'Gold' },
  { name: 'Gold ETF units', sector: 'Commodity', instrument: 'ETF' },
  { name: 'TREPS / Reverse repo', sector: 'Cash', instrument: 'Money market' },
]

function holdingPool(fund: MutualFund) {
  if (fund.assetClass === 'Debt') return debtHoldings
  if (fund.assetClass === 'Other') return goldHoldings
  if (fund.category === 'Sectoral') return sectoralHoldings
  if (fund.assetClass === 'Hybrid')
    return [...equityHoldings.slice(0, 6), ...debtHoldings.slice(0, 3)]
  return equityHoldings
}

function allocationFor(fund: MutualFund): AllocationSlice[] {
  switch (fund.assetClass) {
    case 'Equity':
      return [
        { label: 'Equity', value: 94.6 },
        { label: 'Cash & equivalents', value: 5.4 },
      ]
    case 'Debt':
      return [
        { label: 'Debt', value: 96.8 },
        { label: 'Cash & equivalents', value: 3.2 },
      ]
    case 'Hybrid':
      return [
        { label: 'Equity', value: 66.2 },
        { label: 'Debt', value: 27.9 },
        { label: 'Cash & equivalents', value: 5.9 },
      ]
    default:
      return [
        { label: 'Gold', value: 98.9 },
        { label: 'Cash & equivalents', value: 1.1 },
      ]
  }
}

function pickHoldings(fund: MutualFund, random: () => number): FundHolding[] {
  const pool = [...holdingPool(fund)]
  const count = Math.min(5, pool.length)
  const picked: Omit<FundHolding, 'weight'>[] = []
  for (let index = 0; index < count; index++) {
    picked.push(...pool.splice(Math.floor(random() * pool.length), 1))
  }
  const top = fund.assetClass === 'Other' ? 92 : fund.category === 'Index' ? 12 : 9
  return picked.map((holding, index) => ({
    ...holding,
    weight: Number((top * Math.pow(0.82, index) * (0.9 + random() * 0.2)).toFixed(2)),
  }))
}

function pickManagers(random: () => number): FundManager[] {
  const pool = [...managerPool]
  const count = 1 + Math.floor(random() * 2)
  return Array.from({ length: count }, (_, index) => {
    const [name] = pool.splice(Math.floor(random() * pool.length), 1)
    const year = 2012 + Math.floor(random() * 11) + index
    const month = ['Jan', 'Apr', 'Jul', 'Oct'][Math.floor(random() * 4)]
    return { name, since: `${month} ${year} - Present` }
  })
}

function navHistoryFor(fund: MutualFund, random: () => number, end: Date): NavPoint[] {
  const anchors = [
    { years: 5, value: fund.nav / Math.pow(1 + fund.returns5y / 100, 5) },
    { years: 3, value: fund.nav / Math.pow(1 + fund.returns3y / 100, 3) },
    { years: 1, value: fund.nav / (1 + fund.returns1y / 100) },
    { years: 0, value: fund.nav },
  ]
  const volatility = fund.assetClass === 'Debt' ? 0.004 : fund.assetClass === 'Other' ? 0.02 : 0.045
  const points: NavPoint[] = []
  let noise = 0
  const totalDays = 365 * 5
  for (let daysAgo = totalDays; daysAgo >= 0; daysAgo--) {
    const date = new Date(end)
    date.setDate(date.getDate() - daysAgo)
    if (date.getDay() === 0 || date.getDay() === 6) continue
    const years = daysAgo / 365
    const segment = Math.max(
      0,
      anchors.findIndex((_, index) => anchors[index + 1]?.years <= years),
    )
    const start = anchors[segment]
    const to = anchors[segment + 1]
    const progress = (start.years - years) / (start.years - to.years)
    const trend = start.value * Math.pow(to.value / start.value, progress)
    noise = daysAgo === 0 ? 0 : noise * 0.97 + (random() - 0.5) * volatility * 0.6
    points.push({ date: isoDate(date), nav: Number((trend * (1 + noise)).toFixed(2)) })
  }
  return points
}

const detailsCache = new Map<string, MutualFundDetails>()

export function fundDetailsById(id: string): MutualFundDetails | undefined {
  const cached = detailsCache.get(id)
  if (cached) return cached
  const fund = fundById(id)
  if (!fund) return undefined
  const random = seededRandom(fund.id)
  const navDate = lastBusinessDay()
  const item = withAmc(fund)
  const changeRange = fund.assetClass === 'Debt' ? 0.08 : fund.assetClass === 'Other' ? 0.9 : 1.6
  const launchYear = 2006 + Math.floor(random() * 15)
  const details: MutualFundDetails = {
    ...item,
    navDate: isoDate(navDate),
    navChange1d: Number(((random() - 0.45) * changeRange).toFixed(2)),
    about: `${fund.name} is an open-ended ${fund.category.toLowerCase()} scheme from ${item.amc.name}. The fund aims to ${objectives[fund.assetClass]}. Performance is benchmarked against ${benchmarks[fund.category]}.`,
    benchmark: benchmarks[fund.category],
    launchDate: `${launchYear}-${String(1 + Math.floor(random() * 12)).padStart(2, '0')}-15`,
    exitLoad:
      fund.category === 'ELSS'
        ? 'Nil (3-year lock-in)'
        : fund.assetClass === 'Debt'
          ? 'Nil'
          : '1% if redeemed within 1 year',
    minAdditional: fund.minLumpsum >= 1000 ? 1000 : fund.minLumpsum,
    lockInMonths: fund.category === 'ELSS' ? 36 : null,
    investors: Math.round((50_000 + random() * 2_950_000) / 1000) * 1000,
    managers: pickManagers(random),
    holdings: pickHoldings(fund, random),
    allocation: allocationFor(fund),
    navHistory: navHistoryFor(fund, random, navDate),
  }
  detailsCache.set(id, details)
  return details
}

const fdExtras: Record<
  string,
  Pick<
    FixedDepositDetails,
    'maxAmount' | 'payoutOptions' | 'prematureWithdrawal' | 'insuredUpTo' | 'highlights'
  >
> = {
  'fd-bajaj': {
    maxAmount: 50_000_000,
    payoutOptions: ['Cumulative', 'Monthly', 'Quarterly', 'Half-yearly', 'Annual'],
    prematureWithdrawal: 'Allowed after 3 months; 2% lower rate applies',
    insuredUpTo: null,
    highlights: [
      'Highest safety ratings from CRISIL and ICRA',
      'Special tenure of 44 months earns the peak rate',
      'Online booking with instant FD receipt',
    ],
  },
  'fd-shriram': {
    maxAmount: 50_000_000,
    payoutOptions: ['Cumulative', 'Monthly', 'Quarterly', 'Annual'],
    prematureWithdrawal: 'Allowed after 3 months; 2% lower rate applies',
    insuredUpTo: null,
    highlights: [
      'Additional 0.10% for women depositors',
      'Additional 0.25% on renewals',
      'Loan against deposit up to 75% of the amount',
    ],
  },
  'fd-mahindra': {
    maxAmount: 50_000_000,
    payoutOptions: ['Cumulative', 'Quarterly', 'Half-yearly', 'Annual'],
    prematureWithdrawal: 'Allowed after 3 months as per RBI norms',
    insuredUpTo: null,
    highlights: [
      'CRISIL AAA / Stable rating',
      'Additional 0.25% for senior citizens',
      'Nomination and auto-renewal facility',
    ],
  },
  'fd-pnbhf': {
    maxAmount: 50_000_000,
    payoutOptions: ['Cumulative', 'Monthly', 'Quarterly', 'Half-yearly', 'Annual'],
    prematureWithdrawal: 'Allowed after 3 months; 1% lower rate applies',
    insuredUpTo: null,
    highlights: [
      'Tenures up to 10 years available',
      'Additional 0.30% for senior citizens',
      'Loan against deposit up to 75% of the amount',
    ],
  },
  'fd-lic': {
    maxAmount: 200_000_000,
    payoutOptions: ['Cumulative', 'Monthly', 'Annual'],
    prematureWithdrawal: 'Allowed after 3 months; interest reduced by 1%',
    insuredUpTo: null,
    highlights: [
      'Backed by LIC Housing Finance, a CRISIL AAA issuer',
      'Additional 0.25% for senior citizens',
      'Sanchay Public Deposit scheme since 2001',
    ],
  },
  'fd-icici': {
    maxAmount: 20_000_000,
    payoutOptions: ['Cumulative', 'Monthly', 'Quarterly'],
    prematureWithdrawal: 'Allowed anytime; 0.5% to 1% penalty on the applicable rate',
    insuredUpTo: 500_000,
    highlights: [
      'Deposits insured by DICGC up to ₹5 lakh',
      'Sweep-in and overdraft facility available',
      'Instant booking for existing ICICI Bank customers',
    ],
  },
  'fd-utkarsh': {
    maxAmount: 20_000_000,
    payoutOptions: ['Cumulative', 'Monthly', 'Quarterly'],
    prematureWithdrawal: 'Allowed anytime; 1% penalty on the applicable rate',
    insuredUpTo: 500_000,
    highlights: [
      'Among the highest FD rates from a scheduled bank',
      'Deposits insured by DICGC up to ₹5 lakh',
      'Additional 0.60% for senior citizens',
    ],
  },
}

function tenureRatesFor(scheme: FixedDepositScheme): TenureRate[] {
  const count = scheme.tenureMonths.length
  return scheme.tenureMonths.map((months, index) => {
    const step = (index - (count - 1)) * 0.15
    const peakIndex = count - 2
    const rate = index === peakIndex ? scheme.interestRate : scheme.interestRate + step
    return { months, rate: Number(Math.max(scheme.interestRate - 1.2, rate).toFixed(2)) }
  })
}

export function fixedDepositDetailsById(id: string): FixedDepositDetails | undefined {
  const scheme = fixedDepositSchemes.find((entry) => entry.id === id)
  const extras = fdExtras[id]
  if (!scheme || !extras) return undefined
  return { ...scheme, ...extras, tenureRates: tenureRatesFor(scheme) }
}

export function amcSummaries(): AmcSummary[] {
  return amcs.map((amc) => {
    const funds = mutualFunds.filter((fund) => fund.amcId === amc.id)
    const totalAum = funds.reduce((sum, fund) => sum + fund.aum, 0)
    const avgReturns3y = funds.length
      ? funds.reduce((sum, fund) => sum + fund.returns3y, 0) / funds.length
      : 0
    return {
      ...amc,
      fundCount: funds.length,
      totalAum,
      avgReturns3y: Number(avgReturns3y.toFixed(2)),
      categories: [...new Set(funds.map((fund) => fund.category))],
    }
  })
}

export const fundCategories: FundCategory[] = [
  'Large Cap',
  'Mid Cap',
  'Small Cap',
  'Flexi Cap',
  'Hybrid',
  'Debt',
  'Index',
  'Sectoral',
  'Commodity Gold',
  'ELSS',
]
