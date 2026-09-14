import type { AdminProfile } from '@/types'

export const adminProfile: AdminProfile = {
  id: 'adm-1',
  name: 'Arjun Mehta',
  email: 'admin@octaraa.com',
  role: 'super_admin',
  avatarUrl: null,
}

export const MOCK_TOKEN = 'mock-token'
export const VALID_OTP = '123456'
export const REJECTED_PASSWORD = 'wrong'
export const OTP_RESEND_SECONDS = 30
