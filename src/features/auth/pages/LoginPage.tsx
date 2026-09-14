import { ArrowRight, Lock, Mail } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { FormError } from '@/components/common/FormError'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useMutation } from '@/hooks/useMutation'
import { useAuthStore } from '@/store/auth'
import { AuthHeader } from '../components/AuthHeader'
import { AuthTrustNote } from '../components/AuthTrustNote'
import { emailError } from '../lib/validate'

interface FieldErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const setSession = useAuthStore((state) => state.setSession)
  const passwordId = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const { mutate, loading, error } = useMutation(authApi.login)

  const validate = () => {
    const next: FieldErrors = {
      email: emailError(email),
      password: password ? undefined : 'Password is required',
    }
    setFieldErrors(next)
    return !next.email && !next.password
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return
    const session = await mutate(email.trim(), password)
    if (session) setSession(session.token, session.profile)
  }

  const forgotLink = (className: string) => (
    <Link
      to="/forgot-password"
      state={email.trim() ? { email: email.trim() } : undefined}
      className={`rounded-sm text-brand focus-ring hover:underline ${className}`}
    >
      Forgot password?
    </Link>
  )

  return (
    <div>
      <AuthHeader title="Welcome back" description="Sign in to the Octaraa admin console" />

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
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
          }}
          error={fieldErrors.email ?? error?.fieldErrors.email}
          className="text-md lg:text-base"
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor={passwordId} className="text-xs font-medium text-text-secondary">
              Password
            </label>
            {forgotLink('text-xs font-semibold lg:hidden')}
          </div>
          <Input
            id={passwordId}
            type="password"
            size="lg"
            autoComplete="current-password"
            placeholder="Enter your password"
            leftIcon={<Lock />}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
            }}
            error={fieldErrors.password ?? error?.fieldErrors.password}
            className="text-md lg:text-base"
          />
          {forgotLink('hidden self-start text-sm font-medium lg:inline-flex')}
        </div>

        <FormError error={error} />

        <Button
          type="submit"
          size="lg"
          loading={loading}
          rightIcon={<ArrowRight className="size-4" aria-hidden />}
          className="mt-1 w-full"
        >
          Continue
        </Button>
      </form>

      <AuthTrustNote />
    </div>
  )
}
