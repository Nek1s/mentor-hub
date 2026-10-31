import { apiRequest } from './client'
export { ApiRequestError } from './client'

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

export const authApi = {
  register: (data: RegisterPayload) => apiRequest<AuthTokens>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: LoginPayload) => apiRequest<AuthTokens>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: (refreshToken: string) => apiRequest<void>('/auth/logout', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) }),
  getCurrentUser: () => apiRequest<AuthUser>('/auth/me', {}, true),
}
