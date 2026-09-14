import { mock, mockFailure } from '@/mocks'
import {
  adminProfile,
  MOCK_TOKEN,
  OTP_RESEND_SECONDS,
  REJECTED_PASSWORD,
  VALID_OTP,
} from '@/mocks/auth'
import type { AuthActionResult, AuthSession, OtpChallenge } from '@/types'

export const authApi = {
  login: (email: string, password: string): Promise<AuthSession> => {
    if (!email.trim() || !password) return mockFailure('Email and password are required')
    if (password === REJECTED_PASSWORD) return mockFailure('Incorrect email or password')
    return mock({ token: MOCK_TOKEN, profile: { ...adminProfile, email: email.trim() } })
  },

  requestOtp: (email: string): Promise<OtpChallenge> =>
    mock({ email: email.trim(), resendAfterSeconds: OTP_RESEND_SECONDS }),

  verifyOtp: (email: string, code: string): Promise<AuthActionResult> => {
    if (!email.trim()) return mockFailure('Start again from the forgot password step')
    if (code !== VALID_OTP) return mockFailure('Invalid or expired code')
    return mock({ success: true, message: 'Code verified' })
  },

  resetPassword: (email: string, code: string, password: string): Promise<AuthActionResult> => {
    if (!email.trim() || code !== VALID_OTP) return mockFailure('Invalid or expired code')
    if (password.length < 8) return mockFailure('Password must be at least 8 characters')
    return mock({ success: true, message: 'Password updated' })
  },
}
