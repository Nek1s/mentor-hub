import { apiRequest } from '../../../shared/api/client'

export type MentorResponse = {
  id: number
  full_name: string
  specialization: string
  company: string | null
  bio: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export function getMentors(signal?: AbortSignal) {
  return apiRequest<MentorResponse[]>('/mentors', { signal })
}
