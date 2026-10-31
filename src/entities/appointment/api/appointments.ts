import { apiRequest } from '../../../shared/api/client'

export type Appointment = {
  id: number
  student_id: number
  mentor_id: number
  scheduled_at: string
  duration_minutes: number
  status: 'requested' | 'confirmed' | 'cancelled'
  topic: string
}

export type AppointmentInput = {
  student_id: number
  mentor_id: number
  scheduled_at: string
  duration_minutes: number
  topic: string
}

export const appointmentsApi = {
  list: (signal?: AbortSignal) => apiRequest<Appointment[]>('/appointments', { signal }, true),
  create: (data: AppointmentInput) => apiRequest<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(data) }, true),
  update: (id: number, data: Pick<AppointmentInput, 'topic' | 'scheduled_at'>) => apiRequest<Appointment>(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, true),
  remove: (id: number) => apiRequest<void>(`/appointments/${id}`, { method: 'DELETE' }, true),
}
