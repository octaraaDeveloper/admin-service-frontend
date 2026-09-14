import { Download } from 'lucide-react'

import { transactionsApi } from '@/api/transactions'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui'
import { useQuery } from '@/hooks/useQuery'
import { formatNumber } from '@/lib/format'

import { TransactionsView } from '../components/TransactionsView'
import { useTransactionsList } from '../hooks/useTransactionsList'

export default function TransactionsPage() {
  const list = useTransactionsList()
  const summary = useQuery('transactions:summary:all', () => transactionsApi.summary())

  const description = summary.data
    ? `${formatNumber(summary.data.total)} mutual fund & FD orders across clients · ${formatNumber(summary.data.pending)} pending payment`
    : 'All mutual fund & FD orders across clients'

  return (
    <div className="space-y-4 md:space-y-5">
      <PageHeader
        title="Transactions"
        description={description}
        actions={
          <Button leftIcon={<Download />} onClick={list.exportCsv} loading={list.exporting}>
            Download CSV
          </Button>
        }
      />
      <TransactionsView list={list} />
    </div>
  )
}
