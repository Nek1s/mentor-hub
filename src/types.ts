export type Mentor = {
  id: number
  name: string
  role: string
  company: string
  initials: string
  color: string
  skills: string[]
  rating: string
  reviews: number
  nextAvailable: string
}

export type Meeting = {
  id: number
  date: string
  time: string
  mentor: string
  topic: string
  initials: string
  color: string
  status: 'Подтверждено' | 'Ожидает ответа'
}

export type Note = {
  id: number
  title: string
  text: string
  labels: string[]
  updatedAt: string
}
