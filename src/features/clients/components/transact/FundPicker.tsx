import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { transactApi } from '@/api/transact'
import { Monogram, ReturnValue, amcMonogram } from '@/components/common'
import {
  Button,
  controlClass,
  controlSizes,
  Field,
  Popover,
  SearchInput,
  Skeleton,
} from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { formatCurrency, formatDecimal, formatNumber, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Amc, FundDetails } from '@/types'

const shortDate = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})
const monthYear = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' })

interface FundPickerProps {
  amcId: string | null
  amcs: Amc[]
  value: FundDetails | null
  onChange: (fund: FundDetails) => void
  onClearAmc?: () => void
  error?: ReactNode
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-surface-sunken px-1.5 py-0.5 text-2xs font-medium text-text-secondary">
      {children}
    </span>
  )
}

function NavBlock({ fund, className }: { fund: FundDetails; className?: string }) {
  return (
    <div className={cn('shrink-0 text-right', className)}>
      <p className="text-2xs text-text-muted">NAV ({shortDate.format(new Date(fund.navDate))})</p>
      <p className="text-md font-bold text-text-primary tabular-nums">₹{formatDecimal(fund.nav)}</p>
    </div>
  )
}

function FundDetailsGrid({ fund }: { fund: FundDetails }) {
  const items = [
    { label: 'Fund size (AUM)', value: `₹${formatNumber(Math.round(fund.aum / 1e7))} Cr` },
    { label: 'Expense ratio', value: formatPercent(fund.expenseRatio, 2) },
    { label: 'Exit load', value: fund.exitLoad },
    { label: 'Min. SIP', value: formatCurrency(fund.minSip) },
    { label: 'Min. lumpsum', value: formatCurrency(fund.minLumpsum) },
    { label: 'Launched', value: monthYear.format(new Date(fund.launchedAt)) },
  ]
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border px-4 py-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs text-text-muted">{item.label}</dt>
          <dd className="mt-0.5 truncate text-base font-medium text-text-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function FundOptionRow({
  fund,
  amc,
  selected,
  onSelect,
}: {
  fund: FundDetails
  amc: Amc | undefined
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left focus-ring transition-colors hover:bg-surface-sunken',
        selected && 'bg-brand-tint/60',
      )}
    >
      <Monogram label={amc ? amcMonogram(amc.shortName) : ''} color={amc?.logoColor} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{fund.name}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          <Tag>{fund.plan}</Tag>
          {fund.assetClass !== fund.category && <Tag>{fund.assetClass}</Tag>}
          <Tag>{fund.category}</Tag>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-2xs text-text-muted">NAV</p>
        <p className="text-sm font-medium text-text-primary tabular-nums">
          ₹{formatDecimal(fund.nav)}
        </p>
        <p className="text-2xs text-text-muted">
          <ReturnValue value={fund.returns1y} digits={1} /> 1Y
        </p>
      </div>
    </button>
  )
}

export function FundPicker({ amcId, amcs, value, onChange, onClearAmc, error }: FundPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)
  const amcOf = (id: string) => amcs.find((amc) => amc.id === id)
  const selectedAmc = amcId ? amcOf(amcId) : undefined
  const selectedFundAmc = value ? amcOf(value.amcId) : undefined

  const { data: funds, loading } = useQuery(
    `transact:funds:${amcId ?? 'all'}:${search.trim().toLowerCase()}`,
    () => transactApi.funds({ amcId, search }),
    open,
  )

  const trigger = value ? (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-3 text-left focus-ring sm:p-4"
    >
      <Monogram
        label={selectedFundAmc ? amcMonogram(selectedFundAmc.shortName) : ''}
        color={selectedFundAmc?.logoColor}
        size="lg"
        className="hidden sm:inline-flex"
      />
      <Monogram
        label={selectedFundAmc ? amcMonogram(selectedFundAmc.shortName) : ''}
        color={selectedFundAmc?.logoColor}
        className="sm:hidden"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-5 font-medium text-text-primary">{value.name}</p>
        <p className="mt-0.5 text-xs text-text-muted">
          {[value.plan, value.assetClass, value.category]
            .filter((item, index, list) => list.indexOf(item) === index)
            .join(' • ')}
        </p>
        <p className="mt-1 text-xs text-text-muted sm:hidden">
          NAV ({shortDate.format(new Date(value.navDate))}){' '}
          <span className="font-semibold text-text-primary tabular-nums">
            ₹{formatDecimal(value.nav)}
          </span>
        </p>
      </div>
      <NavBlock fund={value} className="hidden sm:block" />
    </button>
  ) : (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      className={cn(
        controlClass,
        controlSizes.lg,
        'flex items-center justify-between gap-2 text-left text-text-placeholder',
        error && 'border-danger',
      )}
    >
      <span>Select mutual fund</span>
      <ChevronDown className="size-4 shrink-0 text-text-muted" />
    </button>
  )

  return (
    <Field label="Mutual fund" error={error}>
      {() => (
        <div
          className={cn(
            value &&
              'rounded-lg border border-border bg-surface-sunken/50 dark:bg-surface-sunken/40',
          )}
        >
          <div className="flex items-center">
            <Popover
              open={open}
              onOpenChange={(next) => {
                setOpen(next)
                if (!next) setSearch('')
              }}
              className="w-(--radix-popover-trigger-width) min-w-[min(100vw-2rem,320px)] overflow-hidden p-0"
              trigger={trigger}
            >
              <div className="border-b border-border p-2">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search mutual fund by name or category…"
                  debounceMs={200}
                  autoFocus
                />
              </div>
              <div
                role="listbox"
                aria-label="Mutual funds"
                className="max-h-80 overflow-y-auto p-1"
              >
                {loading && !funds ? (
                  Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="flex items-center gap-3 px-3 py-2.5">
                      <Skeleton className="size-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : !funds || funds.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-3 py-8 text-center text-sm text-text-muted">
                    <p>
                      {search
                        ? `No ${selectedAmc ? `${selectedAmc.name} ` : ''}funds match “${search}”`
                        : 'No funds available for this fund house'}
                    </p>
                    {selectedAmc && onClearAmc && (
                      <Button type="button" variant="link" size="sm" onClick={onClearAmc}>
                        Search all fund houses
                      </Button>
                    )}
                  </div>
                ) : (
                  funds.map((fund) => (
                    <FundOptionRow
                      key={fund.id}
                      fund={fund}
                      amc={amcOf(fund.amcId)}
                      selected={fund.id === value?.id}
                      onSelect={() => {
                        onChange(fund)
                        setOpen(false)
                        setSearch('')
                      }}
                    />
                  ))
                )}
              </div>
            </Popover>
            {value && (
              <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                aria-expanded={expanded}
                aria-label={expanded ? 'Hide fund details' : 'Show fund details'}
                className="mr-2 flex size-9 shrink-0 items-center justify-center rounded-lg text-text-muted focus-ring transition-colors hover:bg-surface-sunken hover:text-text-primary sm:mr-3"
              >
                <ChevronDown
                  className={cn('size-5 transition-transform', expanded && 'rotate-180')}
                />
              </button>
            )}
          </div>
          {value && expanded && <FundDetailsGrid fund={value} />}
        </div>
      )}
    </Field>
  )
}
