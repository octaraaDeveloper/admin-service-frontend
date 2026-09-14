import { useLocation } from 'react-router-dom'

export interface AuthFlowState {
  email?: string
  code?: string
  from?: string
  resendAfterSeconds?: number
}

function pickString(value: unknown) {
  return typeof value === 'string' && value ? value : undefined
}

export function useAuthFlowState(): AuthFlowState {
  const { state } = useLocation()
  if (typeof state !== 'object' || state === null) return {}
  const record = state as Record<string, unknown>
  const from = pickString(record.from)
  return {
    email: pickString(record.email),
    code: pickString(record.code),
    from: from?.startsWith('/') && from !== '/login' ? from : undefined,
    resendAfterSeconds:
      typeof record.resendAfterSeconds === 'number' ? record.resendAfterSeconds : undefined,
  }
}
