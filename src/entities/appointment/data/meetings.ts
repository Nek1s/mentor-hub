import type { Meeting } from '../model/types'

export const meetings: Meeting[] = [
  {
    id: 1,
    date: 'Сегодня, 13 сентября',
    time: '18:30 — 19:15',
    mentor: 'Артем Ребриков',
    topic: 'Разбор портфолио',
    initials: 'АР',
    color: '#90caf9',
    status: 'Подтверждено',
  },
  {
    id: 2,
    date: '17 сентября, среда',
    time: '12:00 — 12:45',
    mentor: 'Данил Олейник',
    topic: 'План развития во frontend',
    initials: 'ДО',
    color: '#a5d6a7',
    status: 'Ожидает ответа',
  },
]
