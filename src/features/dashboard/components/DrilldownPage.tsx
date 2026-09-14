import { Download, Plus, SearchX } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { ApiError } from '@/api/client'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/states'
import { Button, LinkButton } from '@/components/ui/Button'
import { DataTable, keyOf, type Column } from '@/components/ui/DataTable'
import { Pagination } from '@/components/ui/Pagination'
import { SearchInput } from '@/components/ui/SearchInput'
import { formatNumber } from '@/lib/format'
import { downloadCsv } from '@/lib/utils'
import { toast } from '@/store/toast'
import type { Paginated } from '@/types'

export const DRILLDOWN_PAGE_SIZE = 8

export interface CsvExport<T> {
  filename: string
  headers: string[]
  row: (row: T) => (string | number)[]
}

interface DrilldownPageProps<T extends { id: string }> {
  title: string
  description: ReactNode
  noun: string
  columns: Column<T>[]
  mobileCard: (row: T) => ReactNode
  data: Paginated<T> | undefined
  loading: boolean
  error: ApiError | null
  onRetry: () => void
  onPageChange: (page: number) => void
  search?: string
  onSearchChange?: (search: string) => void
  searchPlaceholder?: string
  actions?: ReactNode
  csv: CsvExport<T>
  emptyTitle?: string
  emptyDescription: string
  emptyAction?: ReactNode
  minWidth?: number
  children?: ReactNode
}

export function DrilldownPage<T extends { id: string }>({
  title,
  description,
  noun,
  columns,
  mobileCard,
  data,
  loading,
  error,
  onRetry,
  onPageChange,
  search,
  onSearchChange,
  searchPlaceholder = 'Search investor',
  actions,
  csv,
  emptyTitle = 'No investors found',
  emptyDescription,
  emptyAction,
  minWidth,
  children,
}: DrilldownPageProps<T>) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const selectedCount = data?.rows.filter((row) => selected.has(row.id)).length ?? 0

  const exportRows = () => {
    const rows = data?.rows ?? []
    const chosen = selectedCount > 0 ? rows.filter((row) => selected.has(row.id)) : rows
    if (chosen.length === 0) {
      toast.info(`No ${noun} to export`)
      return
    }
    downloadCsv(csv.filename, csv.headers, chosen.map(csv.row))
    toast.success(`Exported ${chosen.length} ${noun} to CSV`)
  }

  const changeSearch = (value: string) => {
    onSearchChange?.(value)
    onPageChange(1)
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title={title}
        description={description}
        backTo="/"
        actions={
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            {onSearchChange && (
              <SearchInput
                value={search ?? ''}
                onChange={changeSearch}
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 sm:w-[220px] sm:flex-none"
              />
            )}
            {actions}
            <Button
              variant="outline"
              leftIcon={<Download className="size-4" />}
              onClick={exportRows}
            >
              Export{selectedCount > 0 ? ` (${selectedCount})` : ''}
            </Button>
          </div>
        }
      />
      {children}
      <DataTable
        columns={columns}
        rows={data?.rows}
        rowKey={keyOf}
        loading={loading}
        error={error}
        onRetry={onRetry}
        selection={{ selected, onChange: setSelected }}
        skeletonRows={DRILLDOWN_PAGE_SIZE}
        minWidth={minWidth}
        mobileCard={mobileCard}
        empty={
          <EmptyState
            icon={<SearchX />}
            title={emptyTitle}
            description={emptyDescription}
            compact
            action={
              <>
                {search && (
                  <Button variant="outline" onClick={() => changeSearch('')}>
                    Clear search
                  </Button>
                )}
                {emptyAction === undefined ? (
                  <LinkButton to="/clients" leftIcon={<Plus className="size-4" />}>
                    Add investors
                  </LinkButton>
                ) : (
                  emptyAction
                )}
              </>
            }
          />
        }
        footer={
          data && data.total > 0 ? (
            <Pagination
              page={data.page}
              pages={data.pages}
              total={data.total}
              limit={data.limit}
              onChange={onPageChange}
            />
          ) : undefined
        }
      />
    </div>
  )
}

export function describe(total: number | undefined, search: string, noun: string) {
  if (search) return `Search results for “${search}”`
  if (total === undefined) return noun.charAt(0).toUpperCase() + noun.slice(1)
  return `${formatNumber(total)} ${noun}`
}

export function CardStat({
  label,
  value,
  className,
}: {
  label: string
  value: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-2xs tracking-wide text-text-placeholder uppercase">{label}</p>
      <p className="text-sm font-medium text-text-primary">{value}</p>
    </div>
  )
}
