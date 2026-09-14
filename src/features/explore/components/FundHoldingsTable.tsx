import { Table, TableScroll, TableWrapper, TBody, TD, TH, THead, TR } from '@/components/ui'
import { formatPercent } from '@/lib/format'
import type { FundHolding } from '@/types'

export function FundHoldingsTable({ holdings }: { holdings: FundHolding[] }) {
  return (
    <TableWrapper>
      <TableScroll>
        <Table className="text-sm" style={{ minWidth: 440 }}>
          <THead>
            <tr>
              <TH className="h-9 px-3">Name</TH>
              <TH className="h-9 px-3">Sector</TH>
              <TH className="h-9 px-3">Instrument</TH>
              <TH className="h-9 px-3" align="right">
                Assets
              </TH>
            </tr>
          </THead>
          <TBody>
            {holdings.map((holding) => (
              <TR key={holding.name}>
                <TD className="px-3 py-2.5 font-medium text-text-primary">{holding.name}</TD>
                <TD className="px-3 py-2.5">{holding.sector}</TD>
                <TD className="px-3 py-2.5">{holding.instrument}</TD>
                <TD className="px-3 py-2.5 tabular-nums" align="right">
                  {formatPercent(holding.weight, 2)}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </TableScroll>
    </TableWrapper>
  )
}
