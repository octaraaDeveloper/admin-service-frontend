import type { Key, ReactNode } from 'react'
import { ErrorState, EmptyState } from '@/components/common/states'
import type { ApiError } from '@/api/client'
import { cn } from '@/lib/utils'
import { Checkbox } from './Checkbox'
import { Skeleton } from './Skeleton'
import {
  Table,
  TableScroll,
  TableSkeletonRows,
  TableWrapper,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from './Table'

export interface Column<T> {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
  headerClassName?: string
  sticky?: boolean
}

export interface Selection {
  selected: Set<string>
  onChange: (selected: Set<string>) => void
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[] | undefined
  rowKey: (row: T) => string
  loading?: boolean
  error?: ApiError | null
  onRetry?: () => void
  empty?: ReactNode
  selection?: Selection
  onRowClick?: (row: T) => void
  mobileCard?: (row: T) => ReactNode
  footer?: ReactNode
  minWidth?: number
  className?: string
  skeletonRows?: number
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  empty,
  selection,
  onRowClick,
  mobileCard,
  footer,
  minWidth = 720,
  className,
  skeletonRows = 6,
}: DataTableProps<T>) {
  const keys = rows?.map(rowKey) ?? []
  const allSelected = keys.length > 0 && keys.every((key) => selection?.selected.has(key))
  const someSelected = keys.some((key) => selection?.selected.has(key))
  const columnCount = columns.length + (selection ? 1 : 0)

  const toggleAll = (checked: boolean) => {
    if (!selection) return
    const next = new Set(selection.selected)
    for (const key of keys) {
      if (checked) next.add(key)
      else next.delete(key)
    }
    selection.onChange(next)
  }

  const toggleOne = (key: string, checked: boolean) => {
    if (!selection) return
    const next = new Set(selection.selected)
    if (checked) next.add(key)
    else next.delete(key)
    selection.onChange(next)
  }

  const stickyClass = (column: Column<T>, isHeader: boolean) =>
    column.sticky &&
    cn(
      'sticky left-0 z-10',
      isHeader ? 'bg-table-head' : 'bg-surface-raised group-hover:bg-surface-sunken',
    )

  const status = (() => {
    if (error) return <ErrorState error={error} onRetry={onRetry} compact />
    if (!loading && rows?.length === 0)
      return empty ?? <EmptyState title="No results found" compact />
    return null
  })()

  const table = (
    <TableScroll>
      <Table style={{ minWidth }}>
        <THead>
          <tr>
            {selection && (
              <TH className="w-12 pr-0">
                <Checkbox
                  aria-label="Select all rows"
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onChange={toggleAll}
                />
              </TH>
            )}
            {columns.map((column) => (
              <TH
                key={column.key}
                align={column.align}
                className={cn(column.headerClassName, stickyClass(column, true))}
              >
                {column.header}
              </TH>
            ))}
          </tr>
        </THead>
        <TBody>
          {loading && !rows ? (
            <TableSkeletonRows rows={skeletonRows} columns={columnCount} />
          ) : (
            rows?.map((row) => {
              const key = rowKey(row)
              return (
                <TR
                  key={key}
                  clickable={Boolean(onRowClick)}
                  onClick={() => onRowClick?.(row)}
                  className="group"
                >
                  {selection && (
                    <TD className="w-12 pr-0" onClick={(event) => event.stopPropagation()}>
                      <Checkbox
                        aria-label="Select row"
                        checked={selection.selected.has(key)}
                        onChange={(checked) => toggleOne(key, checked)}
                      />
                    </TD>
                  )}
                  {columns.map((column) => (
                    <TD
                      key={column.key}
                      align={column.align}
                      className={cn(column.className, stickyClass(column, false))}
                    >
                      {column.cell(row)}
                    </TD>
                  ))}
                </TR>
              )
            })
          )}
        </TBody>
      </Table>
    </TableScroll>
  )

  const cards = mobileCard && (
    <div className="divide-y divide-border">
      {loading && !rows
        ? Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="m-3 h-24" />)
        : rows?.map((row) => {
            const key = rowKey(row)
            return (
              <div
                key={key}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'flex gap-3 p-4',
                  onRowClick && 'cursor-pointer active:bg-surface-sunken',
                )}
              >
                {selection && (
                  <span onClick={(event) => event.stopPropagation()} className="pt-0.5">
                    <Checkbox
                      aria-label="Select row"
                      checked={selection.selected.has(key)}
                      onChange={(checked) => toggleOne(key, checked)}
                    />
                  </span>
                )}
                <div className="min-w-0 flex-1">{mobileCard(row)}</div>
              </div>
            )
          })}
    </div>
  )

  return (
    <TableWrapper className={className}>
      {status ?? (
        <>
          {cards ? (
            <>
              <div className="md:hidden">{cards}</div>
              <div className="hidden md:block">{table}</div>
            </>
          ) : (
            table
          )}
        </>
      )}
      {footer && <div className="border-t border-border px-4 py-3">{footer}</div>}
    </TableWrapper>
  )
}

export function keyOf<T extends { id: Key }>(row: T) {
  return String(row.id)
}
