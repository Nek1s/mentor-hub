import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useAuth } from '../app/providers/useAuth'
import { appointmentsApi, type Appointment } from '../entities/appointment/api/appointments'
import { getMentors, type MentorResponse } from '../entities/mentor/api/mentors'
import { notesApi, type ApiNote } from '../entities/note/api/notes'
import { ApiRequestError } from '../shared/api/client'
import type { DataStatus } from '../shared/model/dataStatus'
import { DataStateView } from '../shared/ui/DataStateView'

export function DashboardPage() {
  const { user } = useAuth()
  const [meetings, setMeetings] = useState<Appointment[]>([])
  const [notes, setNotes] = useState<ApiNote[]>([])
  const [mentors, setMentors] = useState<MentorResponse[]>([])
  const [status, setStatus] = useState<DataStatus>('loading')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [loadedAt, setLoadedAt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([appointmentsApi.list(controller.signal), notesApi.list(controller.signal), getMentors(controller.signal)])
      .then(([appointments, noteList, mentorList]) => {
        setMeetings(appointments)
        setNotes(noteList)
        setMentors(mentorList)
        setLoadedAt(Date.now())
        setStatus('ready')
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return
        setError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось загрузить данные.')
        setStatus('error')
      })
    return () => controller.abort()
  }, [attempt])

  const upcoming = meetings.filter((meeting) => meeting.status !== 'cancelled' && Date.parse(meeting.scheduled_at) > loadedAt)
    .sort((a, b) => Date.parse(a.scheduled_at) - Date.parse(b.scheduled_at))
  const closest = upcoming[0]

  return <>
    <Typography variant="h3" component="h1" sx={{ mb: 1 }}>Здравствуйте, {user?.full_name ?? 'пользователь'}</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>Здесь собраны ваши встречи и заметки.</Typography>
    <DataStateView status={status} isEmpty={false} emptyTitle="" emptyDescription="" errorMessage={error} onRetry={() => { setStatus('loading'); setAttempt((value) => value + 1) }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h5">Ближайшая встреча</Typography>
          {closest ? <Stack spacing={1} sx={{ mt: 2 }}>
            <Typography fontWeight={700}>{closest.topic}</Typography>
            <Typography>{mentors.find((mentor) => mentor.id === closest.mentor_id)?.full_name ?? 'Наставник недоступен'}</Typography>
            <Typography color="text.secondary">{new Date(closest.scheduled_at).toLocaleString('ru-RU')}</Typography>
          </Stack> : <Typography color="text.secondary" sx={{ mt: 2 }}>Предстоящих встреч пока нет.</Typography>}
          <Button component={RouterLink} to="/schedule" sx={{ mt: 2 }}>Открыть расписание</Button>
        </Paper>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h5">Мои данные</Typography>
          <Typography sx={{ mt: 2 }}>Предстоящих встреч: {upcoming.length}</Typography>
          <Typography sx={{ mt: 1 }}>Заметок: {notes.length}</Typography>
          <Button component={RouterLink} to="/notes" sx={{ mt: 2 }}>Открыть заметки</Button>
        </Paper>
      </Box>
    </DataStateView>
  </>
}
