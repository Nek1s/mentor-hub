import { apiRequest } from '../../../shared/api/client'

export type ApiNote = {
  id: number
  student_id: number
  appointment_id: number | null
  title: string
  content: string
  created_at: string
  updated_at: string
}

type NoteFields = { title: string; content: string }

export const notesApi = {
  list: (signal?: AbortSignal) => apiRequest<ApiNote[]>('/notes', { signal }, true),
  create: (data: NoteFields & { student_id: number }) => apiRequest<ApiNote>('/notes', { method: 'POST', body: JSON.stringify(data) }, true),
  update: (id: number, data: NoteFields) => apiRequest<ApiNote>(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, true),
  remove: (id: number) => apiRequest<void>(`/notes/${id}`, { method: 'DELETE' }, true),
}
