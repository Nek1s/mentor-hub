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
