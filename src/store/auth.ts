import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminProfile } from '@/types'

interface AuthState {
  token: string | null
  profile: AdminProfile | null
  setSession: (token: string, profile: AdminProfile) => void
  setProfile: (profile: AdminProfile) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      profile: null,
      setSession: (token, profile) => set({ token, profile }),
      setProfile: (profile) => set({ profile }),
      logout: () => set({ token: null, profile: null }),
    }),
    { name: 'octaraa-auth' },
  ),
)
