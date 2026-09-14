import { formatCompactCurrency, formatPercent } from '@/lib/format'
import type { MutualFundListItem } from '@/types'
import { AmcLogo } from './AmcLogo'
import { RatingStars } from './RatingStars'
import { ReturnValue } from './ReturnValue'
import { RiskBadge } from './RiskBadge'

export function FundMobileCard({ fund }: { fund: MutualFundListItem }) {
  const returns = [
    { label: '1Y', value: fund.returns1y },
    { label: '3Y', value: fund.returns3y },
    { label: '5Y', value: fund.returns5y },
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2.5">
        <AmcLogo amc={fund.amc} size="sm" className="mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium text-text-primary">{fund.name}</p>
          <p className="text-xs text-text-placeholder">
            {fund.category} · {fund.amc.shortName}
          </p>
        </div>
        <RiskBadge risk={fund.risk} className="shrink-0" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {returns.map((item) => (
          <div key={item.label}>
            <p className="text-2xs font-semibold tracking-wide text-text-secondary uppercase">
              {item.label}
            </p>
            <ReturnValue value={item.value} className="text-sm" />
          </div>
        ))}
        <div className="text-right">
          <p className="text-2xs font-semibold tracking-wide text-text-secondary uppercase">AUM</p>
          <p className="text-sm font-medium text-text-secondary tabular-nums">
            {formatCompactCurrency(fund.aum)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 text-xs text-text-muted">
        <RatingStars rating={fund.rating} />
        <span>Exp. ratio {formatPercent(fund.expenseRatio, 2)}</span>
      </div>
    </div>
  )
}
