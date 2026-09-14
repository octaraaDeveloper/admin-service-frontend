import { Check } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { clientsApi } from '@/api/clients'
import { Badge, Button, Input, OtpInput } from '@/components/ui'
import { useCountdown } from '@/hooks/useCountdown'
import { useMutation } from '@/hooks/useMutation'
import { formatCountdown } from '@/lib/format'
import type { OtpChannel } from '@/types'

interface OtpFieldProps {
  channel: OtpChannel
  label: string
  otpLabel: string
  placeholder: string
  value: string
  valid: boolean
  verified: boolean
  onChange: (value: string) => void
  onVerified: () => void
  leftIcon?: ReactNode
  inputMode?: 'numeric' | 'email'
  type?: 'text' | 'email' | 'tel'
  autoComplete?: string
}

const OTP_LENGTH = 6

export function VerifiedPill() {
  return (
    <Badge tone="success" className="gap-1 pl-2">
      <Check className="size-3" strokeWidth={3} aria-hidden />
      Verified
    </Badge>
  )
}

export function OtpField({
  channel,
  label,
  otpLabel,
  placeholder,
  value,
  valid,
  verified,
  onChange,
  onVerified,
  leftIcon,
  inputMode,
  type = 'text',
  autoComplete,
}: OtpFieldProps) {
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const countdown = useCountdown(45)
  const send = useMutation(clientsApi.sendOtp)
  const verify = useMutation(clientsApi.verifyOtp)

  const sendCode = async () => {
    const result = await send.mutate(channel, value)
    if (!result) return
    setSent(true)
    setCode('')
    verify.reset()
    countdown.start()
  }

  const verifyCode = async () => {
    const result = await verify.mutate(channel, code)
    if (result) onVerified()
  }

  const handleChange = (next: string) => {
    onChange(next)
    if (sent) {
      setSent(false)
      setCode('')
      verify.reset()
    }
  }

  return (
    <div className="space-y-4">
      <Input
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        readOnly={verified}
        leftIcon={leftIcon}
        inputMode={inputMode}
        type={type}
        autoComplete={autoComplete}
        error={send.error?.message}
        rightSlot={
          verified ? (
            <VerifiedPill />
          ) : (
            <Button
              variant="link"
              size="sm"
              disabled={!valid}
              loading={send.loading}
              onClick={sendCode}
            >
              {sent ? 'Sent' : 'Send OTP'}
            </Button>
          )
        }
      />
      {sent && !verified && (
        <div className="space-y-3">
          <p className="text-base font-medium text-text-primary">{otpLabel}</p>
          <OtpInput
            value={code}
            onChange={(next) => {
              setCode(next)
              if (verify.error) verify.reset()
            }}
            length={OTP_LENGTH}
            error={Boolean(verify.error)}
            disabled={verify.loading}
          />
          {verify.error && <p className="text-xs text-danger">{verify.error.message}</p>}
          <div className="flex flex-col items-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="min-w-28"
              disabled={code.length !== OTP_LENGTH}
              loading={verify.loading}
              onClick={verifyCode}
            >
              Verify
            </Button>
            {countdown.running ? (
              <p className="text-xs text-text-muted">
                Resend OTP in{' '}
                <span className="font-medium text-brand">
                  {formatCountdown(countdown.remaining)}
                </span>
              </p>
            ) : (
              <Button variant="link" size="sm" loading={send.loading} onClick={sendCode}>
                Resend OTP
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
