import { useState } from 'react'
import { Button, Modal } from '@/components/ui'
import type { AmcSummary } from '@/types'
import { defaultQuery, type MutualFundQuery } from '../hooks/useExploreParams'
import { FundFilters } from './FundFilters'

type FilterValues = Pick<MutualFundQuery, 'category' | 'risk' | 'amcId' | 'sortBy' | 'sortOrder'>

interface FundFiltersSheetProps {
  open: boolean
  onClose: () => void
  value: FilterValues
  onApply: (next: FilterValues) => void
  amcs: AmcSummary[] | undefined
}

export function FundFiltersSheet({ open, onClose, value, onApply, amcs }: FundFiltersSheetProps) {
  const [draft, setDraft] = useState<FilterValues>(value)
  const [synced, setSynced] = useState(value)

  if (value !== synced) {
    setSynced(value)
    setDraft(value)
  }

  const reset = () =>
    setDraft({
      category: defaultQuery.category,
      risk: defaultQuery.risk,
      amcId: defaultQuery.amcId,
      sortBy: defaultQuery.sortBy,
      sortOrder: defaultQuery.sortOrder,
    })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Filters"
      description="Narrow down the mutual fund list"
      footer={
        <>
          <Button variant="outline" onClick={reset} className="sm:mr-auto">
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft)
              onClose()
            }}
          >
            Apply filters
          </Button>
        </>
      }
    >
      <FundFilters
        layout="stack"
        value={draft}
        amcs={amcs}
        onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
      />
    </Modal>
  )
}
