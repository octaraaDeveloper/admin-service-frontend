import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Skeleton } from './Skeleton'

export function TableWrapper({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('overflow-hidden card', className)}>{children}</div>
}

export function TableScroll({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('w-full overflow-x-auto', className)}>{children}</div>
}

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn('w-full border-collapse text-left text-base', className)} {...props} />
  )
}

export function THead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('bg-table-head', className)} {...props} />
}

export function TBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-border', className)} {...props} />
}

export function TR({
  className,
  clickable,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { clickable?: boolean }) {
  return (
    <tr
      className={cn(
        'transition-colors',
        clickable && 'cursor-pointer hover:bg-surface-sunken',
        className,
      )}
      {...props}
    />
  )
}

export function TH({
  className,
  align = 'left',
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'right' | 'center' }) {
  return (
    <th
      scope="col"
      className={cn(
        'h-10 px-4 text-sm font-medium whitespace-nowrap text-text-secondary',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
      {...props}
    />
  )
}

export function TD({
  className,
  align = 'left',
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'right' | 'center' }) {
  return (
    <td
      className={cn(
        'px-4 py-3.5 whitespace-nowrap text-text-secondary',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
      {...props}
    />
  )
}

export function ViewLink({ to, children = 'View' }: { to: string; children?: ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-sm font-medium text-brand focus-ring hover:underline"
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </Link>
  )
}

export function TableSkeletonRows({ rows = 6, columns }: { rows?: number; columns: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }, (_cell, columnIndex) => (
            <td key={columnIndex} className="px-4 py-3.5">
              <Skeleton className="h-4 w-full max-w-32" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
