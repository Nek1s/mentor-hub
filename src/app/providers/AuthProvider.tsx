import { useEffect, useState, type ReactNode } from 'react'
import { authApi, type AuthUser, type LoginPayload, type RegisterPayload } from '../../shared/api/auth'
import { clearTokens, readTokens, saveTokens, sessionExpiredEvent, type StoredTokens } from '../../shared/api/client'
import { AuthContext, type AuthStatus } from './AuthContext'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>(() => (readTokens() ? 'loading' : 'unauthenticated'))
  const [user, setUser] = useState<AuthUser | null>(null)

  const applySession = (nextUser: AuthUser, tokens: StoredTokens) => {
    saveTokens(tokens)
    setUser(nextUser)
    setStatus('authenticated')
  }

  const signIn = async (data: LoginPayload) => {
    const result = await authApi.login(data)
    applySession(result.user, { accessToken: result.access_token, refreshToken: result.refresh_token })
  }

  const signUp = async (data: RegisterPayload) => {
    const result = await authApi.register(data)
    applySession(result.user, { accessToken: result.access_token, refreshToken: result.refresh_token })
  }

  const signOut = async () => {
    const storedTokens = readTokens()

    try {
      if (storedTokens) {
        await authApi.logout(storedTokens.refreshToken)
      }
    } catch {
      // Локальная сессия должна завершиться даже при временной недоступности API.
    } finally {
      clearTokens()
      setUser(null)
      setStatus('unauthenticated')
    }
  }

  useEffect(() => {
    let isActive = true
    const onExpired = () => { setUser(null); setStatus('unauthenticated') }
    window.addEventListener(sessionExpiredEvent, onExpired)

    const restoreSession = async () => {
      if (!readTokens()) return
      try {
        const currentUser = await authApi.getCurrentUser()
        if (isActive) {
          setUser(currentUser)
          setStatus('authenticated')
        }
      } catch {
        if (isActive) {
          setUser(null)
          setStatus('unauthenticated')
        }
      }
    }

    void restoreSession()
    return () => {
      isActive = false
      window.removeEventListener(sessionExpiredEvent, onExpired)
    }
  }, [])

  return <AuthContext.Provider value={{ status, user, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}
