import { useCallback, useEffect, useRef } from 'react'
import type { ApiError } from '@/api/client'
import { useQueryCache } from '@/store/queryCache'

interface QueryResult<T> {
  data: T | undefined
  error: ApiError | null
  loading: boolean
  refetch: () => Promise<void>
}

export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  enabled = true,
): QueryResult<T> {
  const entry = useQueryCache((state) => state.entries[key])
  const ensure = useQueryCache((state) => state.ensure)
  const fetch = useQueryCache((state) => state.fetch)
  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  const ensureData = useCallback(() => ensure(key, () => fetcherRef.current()), [key, ensure])
  const refetch = useCallback(() => fetch(key, () => fetcherRef.current()), [key, fetch])

  useEffect(() => {
    if (enabled) void ensureData()
  }, [enabled, ensureData, entry?.stale])

  return {
    data: entry?.data as T | undefined,
    error: entry?.error ?? null,
    loading: entry?.loading ?? (enabled && entry?.data === undefined),
    refetch,
  }
}

export function useInvalidate() {
  return useQueryCache((state) => state.invalidate)
}

export function useSeedQueryData() {
  return useQueryCache((state) => state.seedData)
}
