import { ComingSoon } from '@/components/common/ComingSoon'

export function ClientTransactionsTab({ clientId }: { clientId: string }) {
  return <ComingSoon title={`Transactions for ${clientId}`} />
}
