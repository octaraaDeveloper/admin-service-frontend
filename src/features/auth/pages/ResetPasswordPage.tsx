import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { FormError } from '@/components/common/FormError'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useMutation } from '@/hooks/useMutation'
import { AuthHeader } from '../components/AuthHeader'
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter'
import { confirmPasswordError, passwordError } from '../lib/validate'
import { useAuthFlowState } from '../hooks/useAuthFlowState'

interface FieldErrors {
  password?: string
  confirm?: string
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { email, code } = useAuthFlowState()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [confirmTouched, setConfirmTouched] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const { mutate, loading, error } = useMutation(authApi.resetPassword)

  if (!email || !code) return <Navigate to="/forgot-password" replace />

  const liveMismatch =
    confirmTouched && confirm && confirm !== password ? 'Passwords do not match' : undefined

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next: FieldErrors = {
      password: passwordError(password),
      confirm: confirmPasswordError(confirm, password),
    }
    setFieldErrors(next)
    if (next.password || next.confirm) return
    const result = await mutate(email, code, password)
    if (!result) return
    navigate('/reset-success', { replace: true, state: { email } })
  }

  return (
    <div>
      <AuthHeader
        title="Set a new password"
        description="Must be at least 8 characters with a number & symbol."
      />

      <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Input
            label="New password"
            type="password"
            size="lg"
            autoComplete="new-password"
            autoFocus
            placeholder="Enter a new password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
            }}
            error={fieldErrors.password ?? error?.fieldErrors.password}
            className="text-md lg:text-base"
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <Input
          label="Confirm password"
          type="password"
          size="lg"
          autoComplete="new-password"
          placeholder="Re-enter the new password"
          value={confirm}
          onChange={(event) => {
            setConfirm(event.target.value)
            if (fieldErrors.confirm) setFieldErrors((prev) => ({ ...prev, confirm: undefined }))
          }}
          onBlur={() => setConfirmTouched(true)}
          error={fieldErrors.confirm ?? liveMismatch}
          className="text-md lg:text-base"
        />

        <FormError error={error} />

        <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
          Reset password
        </Button>
      </form>
    </div>
  )
}
