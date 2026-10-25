const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1'

export type AuthUser = {
  id: number
  full_name: string
  email: string
  role: 'student' | 'mentor'
  student_id: number | null
  created_at: string
}

export type AuthTokens = {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
  user: AuthUser
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = LoginPayload & {
  full_name: string
  goal?: string
}

type RefreshResponse = {
  access_token: string
  token_type: 'bearer'
}

export class ApiRequestError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}, accessToken?: string): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers })
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    const detail = typeof body === 'object' && body !== null && 'detail' in body ? body.detail : null
    throw new ApiRequestError(typeof detail === 'string' ? detail : 'Не удалось выполнить запрос.', response.status)
  }

  return response.json() as Promise<T>
}

export const authApi = {
  register: (data: RegisterPayload) => request<AuthTokens>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: LoginPayload) => request<AuthTokens>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  refresh: (refreshToken: string) => request<RefreshResponse>('/auth/refresh', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) }),
  getCurrentUser: (accessToken: string) => request<AuthUser>('/auth/me', {}, accessToken),
}
