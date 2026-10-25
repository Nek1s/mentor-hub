import { useEffect, useState, type ReactNode } from 'react'
import { authApi, type AuthUser, type LoginPayload, type RegisterPayload } from '../../shared/api/auth'
import { AuthContext, type AuthStatus } from './AuthContext'

const accessTokenKey = 'mentorhub_access_token'
const refreshTokenKey = 'mentorhub_refresh_token'

type AuthProviderProps = {
  children: ReactNode
}

type StoredTokens = {
  accessToken: string
  refreshToken: string
}

function readTokens(): StoredTokens | null {
  const accessToken = localStorage.getItem(accessTokenKey)
  const refreshToken = localStorage.getItem(refreshTokenKey)

  return accessToken && refreshToken ? { accessToken, refreshToken } : null
}

function saveTokens(tokens: StoredTokens) {
  localStorage.setItem(accessTokenKey, tokens.accessToken)
  localStorage.setItem(refreshTokenKey, tokens.refreshToken)
}

function clearTokens() {
  localStorage.removeItem(accessTokenKey)
  localStorage.removeItem(refreshTokenKey)
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

  useEffect(() => {
    let isActive = true
    const storedTokens = readTokens()

    if (!storedTokens) {
      return undefined
    }

    const restoreSession = async () => {
      try {
        const currentUser = await authApi.getCurrentUser(storedTokens.accessToken)
        if (isActive) {
          setUser(currentUser)
          setStatus('authenticated')
        }
      } catch {
        try {
          const refreshed = await authApi.refresh(storedTokens.refreshToken)
          const currentUser = await authApi.getCurrentUser(refreshed.access_token)
          if (isActive) {
            saveTokens({ accessToken: refreshed.access_token, refreshToken: storedTokens.refreshToken })
            setUser(currentUser)
            setStatus('authenticated')
          }
        } catch {
          clearTokens()
          if (isActive) {
            setUser(null)
            setStatus('unauthenticated')
          }
        }
      }
    }

    void restoreSession()
    return () => {
      isActive = false
    }
  }, [])

  return <AuthContext.Provider value={{ status, user, signIn, signUp }}>{children}</AuthContext.Provider>
}
