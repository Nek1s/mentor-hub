import { useEffect, useState, type FormEvent } from 'react'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../app/providers/useAuth'
import { appointmentsApi, type Appointment } from '../entities/appointment/api/appointments'
import { getMentors, type MentorResponse } from '../entities/mentor/api/mentors'
import { ApiRequestError } from '../shared/api/client'
import type { DataStatus } from '../shared/model/dataStatus'
import { DataStateView } from '../shared/ui/DataStateView'
import { PageHeader } from '../shared/ui/PageHeader'

function localDateTime(value: string) {
  const date = new Date(value)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

export function SchedulePage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [mentors, setMentors] = useState<MentorResponse[]>([])
  const [meetings, setMeetings] = useState<Appointment[]>([])
  const [status, setStatus] = useState<DataStatus>('loading')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [mentorId, setMentorId] = useState(searchParams.get('mentor') ?? '')
  const [date, setDate] = useState('')
  const [topic, setTopic] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([getMentors(controller.signal), appointmentsApi.list(controller.signal)]).then(([people, appointments]) => {
      setMentors(people)
      setMeetings(appointments)
      setStatus('ready')
    }).catch((requestError: unknown) => {
      if (controller.signal.aborted) return
      setError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось загрузить расписание.')
      setStatus('error')
    })
    return () => controller.abort()
  }, [attempt])

  const reload = () => { setError(''); setStatus('loading'); setAttempt((value) => value + 1) }
  const resetForm = () => { setEditingId(null); setDate(''); setTopic('') }
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user?.student_id || !mentorId || !date || topic.trim().length < 3) { setError('Выберите наставника и время, укажите тему (минимум 3 символа).'); return }
    const scheduled = new Date(date)
    if (Number.isNaN(scheduled.getTime()) || scheduled.getTime() <= Date.now()) { setError('Выберите дату и время в будущем.'); return }
    setError(''); setNotice(''); setBusy(true)
    try {
      const data = { topic: topic.trim(), scheduled_at: scheduled.toISOString() }
      if (editingId !== null) {
        const updated = await appointmentsApi.update(editingId, data)
        setMeetings((current) => current.map((item) => item.id === updated.id ? updated : item))
      } else {
        const created = await appointmentsApi.create({ ...data, student_id: user.student_id, mentor_id: Number(mentorId), duration_minutes: 45 })
        setMeetings((current) => [...current, created])
      }
      resetForm(); setNotice('Встреча сохранена.')
    } catch (requestError) { setError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось сохранить встречу.') }
    finally { setBusy(false) }
  }

  const remove = async (id: number) => {
    if (!window.confirm('Удалить эту встречу?')) return
    setError(''); setBusy(true)
    try {
      await appointmentsApi.remove(id)
      setMeetings((current) => current.filter((item) => item.id !== id))
      if (editingId === id) resetForm()
      setNotice('Встреча удалена.')
    } catch (requestError) { setError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось удалить встречу.') }
    finally { setBusy(false) }
  }

  return <>
    <PageHeader title="Расписание" description="Создавайте встречи и управляйте своими записями." />
    {status !== 'error' && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
    <DataStateView status={status} isEmpty={false} emptyTitle="" emptyDescription="" errorMessage={error} onRetry={reload}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <Paper component="form" onSubmit={submit} variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{editingId === null ? 'Запись на встречу' : 'Изменить встречу'}</Typography>
          <Stack spacing={2}>
            <TextField select label="Наставник" value={mentorId} onChange={(event) => setMentorId(event.target.value)} required disabled={editingId !== null}>
              {mentors.filter((mentor) => mentor.is_active).map((mentor) => <MenuItem key={mentor.id} value={String(mentor.id)}>{mentor.full_name}</MenuItem>)}
            </TextField>
            {mentors.filter((mentor) => mentor.is_active).length === 0 && <Typography variant="body2">Нет доступных наставников. <Button component={RouterLink} to="/mentors">Каталог</Button></Typography>}
            <TextField label="Дата и время" type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} required />
            <TextField label="Тема встречи" value={topic} onChange={(event) => setTopic(event.target.value)} required inputProps={{ minLength: 3, maxLength: 200 }} />
            <Stack direction="row" spacing={1}><Button type="submit" variant="contained" disabled={busy || !user?.student_id}>{editingId === null ? 'Записаться' : 'Сохранить'}</Button>{editingId !== null && <Button onClick={resetForm} disabled={busy}>Отмена</Button>}</Stack>
            <Typography variant="caption" color="text.secondary">Доступность времени проверяется при сохранении.</Typography>
          </Stack>
        </Paper>
        <Paper variant="outlined" sx={{ p: 3 }}><Typography variant="h5">Мои встречи</Typography>
          {meetings.length === 0 ? <Typography color="text.secondary" sx={{ mt: 2 }}>Встреч пока нет.</Typography> : <Stack spacing={2} sx={{ mt: 2 }}>
            {[...meetings].sort((a, b) => Date.parse(a.scheduled_at) - Date.parse(b.scheduled_at)).map((meeting) => <Box key={meeting.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography fontWeight={700}>{meeting.topic}</Typography>
              <Typography variant="body2">{mentors.find((mentor) => mentor.id === meeting.mentor_id)?.full_name ?? 'Наставник недоступен'}</Typography>
              <Typography variant="body2" color="text.secondary">{new Date(meeting.scheduled_at).toLocaleString('ru-RU')} · {meeting.duration_minutes} мин.</Typography>
              <Typography variant="body2">Статус: {{ requested: 'Ожидает ответа', confirmed: 'Подтверждено', cancelled: 'Отменено' }[meeting.status]}</Typography>
              <Button disabled={busy} onClick={() => { setEditingId(meeting.id); setMentorId(String(meeting.mentor_id)); setDate(localDateTime(meeting.scheduled_at)); setTopic(meeting.topic); setError(''); setNotice('') }}>Изменить</Button>
              <Button color="error" disabled={busy} onClick={() => void remove(meeting.id)}>Удалить</Button>
            </Box>)}
          </Stack>}
        </Paper>
      </Box>
    </DataStateView>
  </>
}
