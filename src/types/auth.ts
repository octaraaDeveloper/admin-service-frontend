export interface AdminProfile {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin'
  avatarUrl: string | null
}

export interface AuthSession {
  token: string
  profile: AdminProfile
}

export interface OtpChallenge {
  email: string
  resendAfterSeconds: number
}

export interface AuthActionResult {
  success: true
  message: string
}
