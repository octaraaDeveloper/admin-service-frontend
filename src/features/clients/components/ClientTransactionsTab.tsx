import { Download } from 'lucide-react'

import { Button } from '@/components/ui'
import { TransactionsView } from '@/features/transactions/components/TransactionsView'
import { useTransactionsList } from '@/features/transactions/hooks/useTransactionsList'

export function ClientTransactionsTab({ clientId }: { clientId: string }) {
  const list = useTransactionsList({ clientId, range: 'all' })

  return (
    <TransactionsView
      list={list}
      showClient={false}
      actions={
        <Button
          variant="outline"
          leftIcon={<Download />}
          onClick={list.exportCsv}
          loading={list.exporting}
        >
          Download CSV
        </Button>
      }
    />
  )
}
