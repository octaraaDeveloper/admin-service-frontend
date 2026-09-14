import { useCallback, useState } from 'react'
import type { ApiError } from '@/api/client'
import { asApiError } from '@/api/client'

interface MutationResult<TArgs extends unknown[], TData> {
  mutate: (...args: TArgs) => Promise<TData | undefined>
  loading: boolean
  error: ApiError | null
  reset: () => void
}

export function useMutation<TArgs extends unknown[], TData>(
  fn: (...args: TArgs) => Promise<TData>,
): MutationResult<TArgs, TData> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const mutate = useCallback(
    async (...args: TArgs) => {
      setLoading(true)
      setError(null)
      try {
        return await fn(...args)
      } catch (err) {
        setError(asApiError(err))
        return undefined
      } finally {
        setLoading(false)
      }
    },
    [fn],
  )

  return { mutate, loading, error, reset: () => setError(null) }
}
