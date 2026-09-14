import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { FormError } from '@/components/common/FormError'
import { Button } from '@/components/ui/Button'
import { OtpInput } from '@/components/ui/OtpInput'
import { useCountdown } from '@/hooks/useCountdown'
import { useMutation } from '@/hooks/useMutation'
import { formatCountdown } from '@/lib/format'
import { toast } from '@/store/toast'
import { AuthHeader } from '../components/AuthHeader'
import { AuthTrustNote } from '../components/AuthTrustNote'
import { useAuthFlowState } from '../hooks/useAuthFlowState'

const OTP_LENGTH = 6
const DEFAULT_RESEND_SECONDS = 30

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const { email, resendAfterSeconds } = useAuthFlowState()
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string>()
  const verify = useMutation(authApi.verifyOtp)
  const resend = useMutation(authApi.requestOtp)
  const { remaining, running, start } = useCountdown(resendAfterSeconds ?? DEFAULT_RESEND_SECONDS)

  useEffect(() => {
    start()
  }, [start])

  if (!email) return <Navigate to="/forgot-password" replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (code.length < OTP_LENGTH) {
      setCodeError(`Enter the ${OTP_LENGTH}-digit code`)
      return
    }
    setCodeError(undefined)
    const result = await verify.mutate(email, code)
    if (!result) return
    navigate('/reset-password', { state: { email, code } })
  }

  const handleResend = async () => {
    const challenge = await resend.mutate(email)
    if (!challenge) return
    setCode('')
    setCodeError(undefined)
    verify.reset()
    start()
    toast.success(`A new code has been sent to ${challenge.email}`)
  }

  const error = codeError ?? verify.error ?? resend.error

  return (
    <div>
      <AuthHeader
        back={{ to: '/forgot-password', label: 'Back', state: { email } }}
        title="Verify OTP"
        description={
          <>
            Enter the {OTP_LENGTH}-digit code sent to{' '}
            <span className="font-medium text-text-primary">{email}</span>
          </>
        }
      />

      <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-6">
        <OtpInput
          value={code}
          onChange={(value) => {
            setCode(value)
            if (codeError) setCodeError(undefined)
            if (verify.error) verify.reset()
          }}
          length={OTP_LENGTH}
          error={Boolean(codeError ?? verify.error)}
          disabled={verify.loading}
        />

        <FormError error={error} />

        <Button type="submit" size="lg" loading={verify.loading} className="w-full">
          Verify OTP
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        Didn&apos;t receive it?{' '}
        {running ? (
          <span className="font-medium text-brand">Resend in {formatCountdown(remaining)}</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resend.loading}
            className="rounded-sm font-medium text-brand focus-ring hover:underline disabled:opacity-50"
          >
            {resend.loading ? 'Sending…' : 'Resend code'}
          </button>
        )}
      </p>

      <AuthTrustNote />
    </div>
  )
}
