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
