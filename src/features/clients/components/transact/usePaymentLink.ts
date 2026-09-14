import { useCallback, useState } from 'react'
import { transactApi } from '@/api/transact'
import { useMutation } from '@/hooks/useMutation'
import { toast } from '@/store/toast'
import type { OrderRequest, PaymentLinkResult } from '@/types'

export function usePaymentLink() {
  const { mutate, loading, error, reset } = useMutation(transactApi.sendPaymentLink)
  const [result, setResult] = useState<PaymentLinkResult | null>(null)

  const send = useCallback(
    async (order: OrderRequest) => {
      const response = await mutate(order)
      if (response) {
        setResult(response)
        toast.success(
          order.product === 'mutual-funds' && order.side === 'sell'
            ? 'Redemption link sent'
            : 'Payment link sent',
        )
      }
      return response
    },
    [mutate],
  )

  const clearResult = useCallback(() => setResult(null), [])

  return { send, loading, error, reset, result, clearResult }
}
