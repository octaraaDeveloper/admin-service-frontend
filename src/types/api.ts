export interface Paginated<T> {
  rows: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface ListRequest {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, string | undefined>
}

export type DateRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'
export type Period = 'this-month' | 'last-month' | 'this-quarter' | 'this-year'
