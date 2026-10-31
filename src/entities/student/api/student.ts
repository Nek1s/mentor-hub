import { apiRequest } from '../../../shared/api/client'

export type Student = {
  id: number
  full_name: string
  email: string
  goal: string | null
  created_at: string
  updated_at: string
}

export function getStudent(id: number, signal?: AbortSignal) {
  return apiRequest<Student>(`/students/${id}`, { signal }, true)
}

export function updateStudent(id: number, data: { full_name: string; goal: string | null }) {
  return apiRequest<Student>(`/students/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, true)
}
