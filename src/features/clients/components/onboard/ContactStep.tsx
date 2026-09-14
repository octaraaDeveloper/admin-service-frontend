import { Mail, Phone } from 'lucide-react'
import { isValidEmail, MOBILE_PATTERN } from '@/lib/validation'
import { OtpField } from './OtpField'

export interface ContactValues {
  mobile: string
  email: string
  mobileVerified: boolean
  emailVerified: boolean
}

export const emptyContact: ContactValues = {
  mobile: '',
  email: '',
  mobileVerified: false,
  emailVerified: false,
}

export function isContactComplete(values: ContactValues) {
  return values.mobileVerified && values.emailVerified
}

interface ContactStepProps {
  values: ContactValues
  onChange: (values: ContactValues) => void
}

export function ContactStep({ values, onChange }: ContactStepProps) {
  return (
    <div className="space-y-5">
      <OtpField
        channel="mobile"
        label="Mobile number"
        otpLabel="Enter Mobile OTP"
        placeholder="+91 98765 43210"
        leftIcon={<Phone />}
        inputMode="numeric"
        type="tel"
        autoComplete="tel-national"
        value={values.mobile}
        valid={MOBILE_PATTERN.test(values.mobile)}
        verified={values.mobileVerified}
        onChange={(mobile) =>
          onChange({
            ...values,
            mobile: mobile.replace(/\D/g, '').slice(0, 10),
            mobileVerified: false,
          })
        }
        onVerified={() => onChange({ ...values, mobileVerified: true })}
      />
      <OtpField
        channel="email"
        label="Email ID"
        otpLabel="Enter Email OTP"
        placeholder="user@email.com"
        leftIcon={<Mail />}
        inputMode="email"
        type="email"
        autoComplete="email"
        value={values.email}
        valid={isValidEmail(values.email)}
        verified={values.emailVerified}
        onChange={(email) => onChange({ ...values, email: email.trim(), emailVerified: false })}
        onVerified={() => onChange({ ...values, emailVerified: true })}
      />
    </div>
  )
}
