import { createApiError } from '@/api/client'
import { env } from '@/config/env'

export function mock<T>(data: T, delayMs = env.mockDelayMs): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), delayMs)
  })
}

export function mockFailure<T = never>(message: string, delayMs = env.mockDelayMs): Promise<T> {
  return new Promise((_resolve, reject) => {
    setTimeout(() => reject(createApiError({ status: 400, message })), delayMs)
  })
}

export function paginate<T>(rows: T[], page: number, limit: number) {
  const start = (page - 1) * limit
  return {
    rows: rows.slice(start, start + limit),
    total: rows.length,
    page,
    limit,
    pages: Math.max(1, Math.ceil(rows.length / limit)),
  }
}

export function matchesSearch(value: string, fields: (string | number | null | undefined)[]) {
  const needle = value.trim().toLowerCase()
  if (!needle) return true
  return fields.some((field) =>
    String(field ?? '')
      .toLowerCase()
      .includes(needle),
  )
}
