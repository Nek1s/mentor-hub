const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1'

const accessTokenKey = 'mentorhub_access_token'
const refreshTokenKey = 'mentorhub_refresh_token'
export const sessionExpiredEvent = 'mentorhub:session-expired'

export type StoredTokens = { accessToken: string; refreshToken: string }

export function readTokens(): StoredTokens | null {
  const accessToken = localStorage.getItem(accessTokenKey)
  const refreshToken = localStorage.getItem(refreshTokenKey)
  return accessToken && refreshToken ? { accessToken, refreshToken } : null
}

export function saveTokens(tokens: StoredTokens) {
  localStorage.setItem(accessTokenKey, tokens.accessToken)
  localStorage.setItem(refreshTokenKey, tokens.refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(accessTokenKey)
  localStorage.removeItem(refreshTokenKey)
}

export class ApiRequestError extends Error {
  constructor(message: string, readonlyStatus: number) {
    super(message)
    this.status = readonlyStatus
  }

  readonly status: number
}

async function send<T>(path: string, options: RequestInit, accessToken?: string): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiRequestError('Не удалось связаться с сервером. Проверьте подключение.', 0)
  }

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    const detail = typeof body === 'object' && body !== null && 'detail' in body ? body.detail : null
    const message = typeof detail === 'string' ? detail : response.status === 422
      ? 'Проверьте правильность введённых данных.'
      : response.status >= 500 ? 'Ошибка сервера. Попробуйте позже.' : 'Не удалось выполнить запрос.'
    throw new ApiRequestError(message, response.status)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

let refreshInFlight: Promise<string> | null = null

async function refreshAccessToken(tokens: StoredTokens): Promise<string> {
  const result = await send<{ access_token: string }>('/auth/refresh', {
    method: 'POST', body: JSON.stringify({ refresh_token: tokens.refreshToken }),
  })
  const current = readTokens()
  if (!current || current.refreshToken !== tokens.refreshToken) {
    throw new ApiRequestError('Сессия изменилась. Войдите снова.', 401)
  }
  saveTokens({ accessToken: result.access_token, refreshToken: current.refreshToken })
  return result.access_token
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, authenticated = false): Promise<T> {
  const tokens = authenticated ? readTokens() : null
  if (authenticated && !tokens) throw new ApiRequestError('Войдите в аккаунт.', 401)
  try {
    return await send<T>(path, options, tokens?.accessToken)
  } catch (error) {
    if (!tokens || !(error instanceof ApiRequestError) || error.status !== 401) throw error
  }

  try {
    const current = readTokens()
    if (!current || current.refreshToken !== tokens!.refreshToken) {
      throw new ApiRequestError('Сессия изменилась. Войдите снова.', 401)
    }
    if (current.accessToken !== tokens!.accessToken) return await send<T>(path, options, current.accessToken)
    if (!refreshInFlight) {
      refreshInFlight = refreshAccessToken(current).finally(() => { refreshInFlight = null })
    }
    const accessToken = await refreshInFlight
    return await send<T>(path, options, accessToken)
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401 && readTokens()?.refreshToken === tokens!.refreshToken) {
      clearTokens()
      window.dispatchEvent(new Event(sessionExpiredEvent))
    }
    throw error
  }
}
