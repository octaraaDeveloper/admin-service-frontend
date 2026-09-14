import axios, { AxiosError, type AxiosInstance } from 'axios'
import { env } from '@/config/env'
import { useAuthStore } from '@/store/auth'

export interface ApiError {
  status: number | null
  code: string
  message: string
  fieldErrors: Record<string, string>
  isNetworkError: boolean
}

interface ErrorBody {
  code?: string
  message?: string
  type?: string
  details?: { errors?: FieldIssue[] } | FieldIssue[]
}

interface FieldIssue {
  name?: string
  message?: string
}

const GENERIC_MESSAGE = 'Something went wrong. Please try again.'

export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'isNetworkError' in error
}

export function asApiError(error: unknown): ApiError {
  if (isApiError(error)) return error
  return {
    status: null,
    code: 'UNKNOWN',
    message: GENERIC_MESSAGE,
    fieldErrors: {},
    isNetworkError: false,
  }
}

export function createApiError(partial: Partial<ApiError> = {}): ApiError {
  return {
    status: null,
    code: 'REQUEST_FAILED',
    message: GENERIC_MESSAGE,
    fieldErrors: {},
    isNetworkError: false,
    ...partial,
  }
}

function toApiError(error: unknown): ApiError {
  if (!(error instanceof AxiosError)) return asApiError(error)
  if (!error.response) {
    return createApiError({
      code: 'NETWORK_ERROR',
      message: 'Unable to reach the server. Check your internet connection and try again.',
      isNetworkError: true,
    })
  }
  const body = (error.response.data ?? {}) as ErrorBody
  const issues = Array.isArray(body.details) ? body.details : (body.details?.errors ?? [])
  const fieldErrors: Record<string, string> = {}
  for (const issue of issues) {
    if (issue.name && issue.message && !fieldErrors[issue.name])
      fieldErrors[issue.name] = issue.message
  }
  return createApiError({
    status: error.response.status,
    code: body.code ?? body.type ?? 'REQUEST_FAILED',
    message: body.message ?? Object.values(fieldErrors)[0] ?? GENERIC_MESSAGE,
    fieldErrors,
  })
}

function createClient(baseURL: string): AxiosInstance {
  const client = axios.create({ baseURL, timeout: 30_000 })

  client.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      const apiError = toApiError(error)
      if (apiError.status === 401 && useAuthStore.getState().token) useAuthStore.getState().logout()
      return Promise.reject(apiError)
    },
  )

  return client
}

export const api = createClient(env.apiBaseUrl)
