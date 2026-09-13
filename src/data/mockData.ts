import type { Meeting, Mentor, Note } from '../types'

export const mentors: Mentor[] = [
  {
    id: 1,
    name: 'Артем Ребриков',
    role: 'Product designer',
    company: 'Яндекс',
    initials: 'АР',
    color: '#90caf9',
    skills: ['UX/UI', 'Портфолио', 'Карьера'],
    rating: '5.0',
    reviews: 24,
    nextAvailable: 'Сегодня, 18:30',
  },
  {
    id: 2,
    name: 'Данил Олейник',
    role: 'Frontend lead',
    company: 'T-Bank',
    initials: 'ДО',
    color: '#a5d6a7',
    skills: ['React', 'TypeScript', 'Code review'],
    rating: '4.9',
    reviews: 18,
    nextAvailable: 'Завтра, 12:00',
  },
  {
    id: 3,
    name: 'Денис Быков',
    role: 'Data analyst',
    company: 'Ozon',
    initials: 'ДБ',
    color: '#ffcc80',
    skills: ['SQL', 'Аналитика', 'Собеседования'],
    rating: '5.0',
    reviews: 31,
    nextAvailable: 'Завтра, 19:00',
  },
]

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

export const initialNotes: Note[] = [
  {
    id: 1,
    title: 'После встречи с Артемом',
    text: 'Обновить первый экран кейса: добавить контекст задачи, показать процесс работы и измеримый результат.',
    labels: ['Портфолио', 'Важно'],
    updatedAt: 'Сегодня, 10:20',
  },
  {
    id: 2,
    title: 'Вопросы к Данилу',
    text: 'Как лучше показать учебный проект в резюме? Какие темы повторить перед техническим интервью?',
    labels: ['Вопросы', 'Frontend'],
    updatedAt: 'Вчера, 18:45',
  },
  {
    id: 3,
    title: 'План на неделю',
    text: 'Закончить учебный проект, выделить два вечера на алгоритмы и записаться на следующую встречу.',
    labels: ['План'],
    updatedAt: '10 сентября',
  },
]
