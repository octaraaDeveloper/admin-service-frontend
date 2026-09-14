import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/format'

interface PaginationProps {
  page: number
  pages: number
  total: number
  limit: number
  onChange: (page: number) => void
  className?: string
}

function pageWindow(page: number, pages: number): (number | 'gap')[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, index) => index + 1)
  const items: (number | 'gap')[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pages - 1, page + 1)
  if (start > 2) items.push('gap')
  for (let index = start; index <= end; index++) items.push(index)
  if (end < pages - 1) items.push('gap')
  items.push(pages)
  return items
}

export function Pagination({ page, pages, total, limit, onChange, className }: PaginationProps) {
  if (total === 0) return null
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const navButton =
    'focus-ring inline-flex size-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-surface-sunken disabled:pointer-events-none disabled:opacity-40'

  return (
    <div className={cn('flex flex-col items-center justify-between gap-3 sm:flex-row', className)}>
      <p className="text-sm text-text-muted">
        Showing {formatNumber(from)}–{formatNumber(to)} of {formatNumber(total)}
      </p>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={navButton}
        >
          <ChevronLeft className="size-4" />
        </button>
        {pageWindow(page, pages).map((item, index) =>
          item === 'gap' ? (
            <span key={`gap-${index}`} className="px-1 text-text-muted">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'inline-flex size-8 items-center justify-center rounded-lg text-sm font-medium focus-ring transition-colors',
                item === page
                  ? 'bg-brand text-brand-foreground'
                  : 'text-text-secondary hover:bg-surface-sunken',
              )}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
          className={navButton}
        >
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  )
}
