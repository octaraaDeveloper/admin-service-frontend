import { create } from 'zustand'
import type { ApiError } from '@/api/client'
import { asApiError } from '@/api/client'
import { useAuthStore } from '@/store/auth'

interface CacheEntry {
  data: unknown
  error: ApiError | null
  loading: boolean
  stale: boolean
}

interface QueryCacheState {
  entries: Record<string, CacheEntry>
  ensure: <T>(key: string, fetcher: () => Promise<T>) => Promise<void>
  fetch: <T>(key: string, fetcher: () => Promise<T>) => Promise<void>
  seedData: <T>(key: string, data: T) => void
  invalidate: (prefix: string) => void
  clear: () => void
}

const inflight = new Map<string, Promise<void>>()
const generations = new Map<string, number>()

function bumpGeneration(key: string) {
  generations.set(key, (generations.get(key) ?? 0) + 1)
  inflight.delete(key)
}

async function runFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  set: (
    partial:
      | QueryCacheState
      | Partial<QueryCacheState>
      | ((state: QueryCacheState) => QueryCacheState | Partial<QueryCacheState>),
  ) => void,
  get: () => QueryCacheState,
) {
  const existing = inflight.get(key)
  if (existing) return existing

  const generation = (generations.get(key) ?? 0) + 1
  generations.set(key, generation)
  const isCurrent = () => generations.get(key) === generation

  const run = (async () => {
    const prev = get().entries[key]
    set((state) => ({
      entries: {
        ...state.entries,
        [key]: { data: prev?.data, error: null, loading: true, stale: false },
      },
    }))
    try {
      const data = await fetcher()
      if (!isCurrent()) return
      set((state) => ({
        entries: {
          ...state.entries,
          [key]: { data, error: null, loading: false, stale: false },
        },
      }))
    } catch (error) {
      if (!isCurrent()) return
      set((state) => ({
        entries: {
          ...state.entries,
          [key]: { data: prev?.data, error: asApiError(error), loading: false, stale: false },
        },
      }))
    } finally {
      if (isCurrent()) inflight.delete(key)
    }
  })()

  inflight.set(key, run)
  return run
}

export const useQueryCache = create<QueryCacheState>()((set, get) => ({
  entries: {},

  ensure: async (key, fetcher) => {
    const entry = get().entries[key]
    if (entry && !entry.stale && !entry.error && (entry.data !== undefined || entry.loading)) return
    return runFetch(key, fetcher, set, get)
  },

  fetch: async (key, fetcher) => runFetch(key, fetcher, set, get),

  seedData: (key, data) => {
    if (get().entries[key]) return
    set((state) => ({
      entries: {
        ...state.entries,
        [key]: { data, error: null, loading: false, stale: false },
      },
    }))
  },

  invalidate: (prefix) => {
    set((state) => {
      const entries = { ...state.entries }
      for (const [key, entry] of Object.entries(entries)) {
        if (key.startsWith(prefix)) {
          bumpGeneration(key)
          entries[key] = { ...entry, stale: true }
        }
      }
      return { entries }
    })
  },

  clear: () => {
    for (const key of Object.keys(get().entries)) bumpGeneration(key)
    set({ entries: {} })
  },
}))

useAuthStore.subscribe((state, prev) => {
  if (state.token !== prev.token) useQueryCache.getState().clear()
})
