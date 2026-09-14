import { Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { FormError } from '@/components/common/FormError'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useMutation } from '@/hooks/useMutation'
import { toast } from '@/store/toast'
import { AuthHeader } from '../components/AuthHeader'
import { AuthTrustNote } from '../components/AuthTrustNote'
import { emailError } from '../lib/validate'
import { useAuthFlowState } from '../hooks/useAuthFlowState'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { email: initialEmail } = useAuthFlowState()
  const [email, setEmail] = useState(initialEmail ?? '')
  const [fieldError, setFieldError] = useState<string>()
  const { mutate, loading, error } = useMutation(authApi.requestOtp)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationError = emailError(email)
    setFieldError(validationError)
    if (validationError) return
    const challenge = await mutate(email.trim())
    if (!challenge) return
    toast.success(`Verification code sent to ${challenge.email}`)
    navigate('/verify-otp', {
      state: { email: challenge.email, resendAfterSeconds: challenge.resendAfterSeconds },
    })
  }

  return (
    <div>
      <AuthHeader
        back={{ to: '/login', label: 'Back to sign in' }}
        title="Forgot password?"
        description="Enter your admin email and we'll send a verification code."
      />

      <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-5">
        <Input
          label="Email address"
          type="email"
          size="lg"
          inputMode="email"
          autoComplete="email"
          autoFocus
          placeholder="admin@octaraa.com"
          leftIcon={<Mail />}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (fieldError) setFieldError(undefined)
          }}
          error={fieldError ?? error?.fieldErrors.email}
          className="text-md lg:text-base"
        />

        <FormError error={error} />

        <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
          Send verification code
        </Button>
      </form>

      <AuthTrustNote />
    </div>
  )
}
