import { Forward, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button, SearchInput, Select } from '@/components/ui'
import type { TransactionFilters as Filters } from '@/types'

import { assetOptions, orderTypeOptions, rangeOptions, statusOptions } from '../labels'

interface TransactionFiltersProps {
  filters: Filters
  onChange: (patch: Partial<Filters>) => void
  /** Number of rows currently selected in the table. */
  /** Selected rows that still have a pending payment link. */
  pendingSelectedCount: number
  onResend: () => void
  onCancel: () => void
  resending?: boolean
  /** Extra actions rendered after the bulk buttons (e.g. an export button). */
  children?: ReactNode
}

export function TransactionFilters({
  filters,
  onChange,
  pendingSelectedCount,
  onResend,
  onCancel,
  resending,
  children,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      <SearchInput
        value={filters.search}
        onChange={(search) => onChange({ search })}
        placeholder="Search"
        className="md:w-52"
      />
      <div className="grid grid-cols-2 gap-3 md:contents">
        <Select
          value={filters.asset}
          onChange={(asset) => onChange({ asset })}
          options={assetOptions}
          variant="pill"
          className="w-full md:w-auto"
        />
        <Select
          value={filters.status}
          onChange={(status) => onChange({ status })}
          options={statusOptions}
          variant="pill"
          className="w-full md:w-auto"
        />
        <Select
          value={filters.range}
          onChange={(range) => onChange({ range })}
          options={rangeOptions}
          variant="pill"
          className="w-full md:w-auto"
        />
        <Select
          value={filters.orderType}
          onChange={(orderType) => onChange({ orderType })}
          options={orderTypeOptions}
          variant="pill"
          className="w-full md:w-auto"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:ml-auto">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            leftIcon={<Forward />}
            onClick={onResend}
            disabled={pendingSelectedCount === 0}
            loading={resending}
          >
            Resend link
          </Button>
          <Button
            variant="outline"
            leftIcon={<Trash2 />}
            onClick={onCancel}
            disabled={pendingSelectedCount === 0}
            className="border-danger/30 text-danger hover:bg-danger-tint hover:text-danger"
          >
            Cancel
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
