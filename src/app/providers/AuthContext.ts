import { createContext } from 'react'
import type { AuthUser, LoginPayload, RegisterPayload } from '../../shared/api/auth'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  signIn: (data: LoginPayload) => Promise<void>
  signUp: (data: RegisterPayload) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
