import { useEffect, useState, type FormEvent } from 'react'
import { Alert, Avatar, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../app/providers/useAuth'
import { getStudent, updateStudent, type Student } from '../entities/student/api/student'
import { ApiRequestError } from '../shared/api/client'
import type { DataStatus } from '../shared/model/dataStatus'
import { DataStateView } from '../shared/ui/DataStateView'
import { PageHeader } from '../shared/ui/PageHeader'

export function ProfilePage() {
  const { user } = useAuth()
  const [student, setStudent] = useState<Student | null>(null)
  const [status, setStatus] = useState<DataStatus>('loading')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [goal, setGoal] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    if (user?.student_id != null) {
      getStudent(user.student_id, controller.signal).then((result) => {
        setStudent(result)
        setFullName(result.full_name)
        setGoal(result.goal ?? '')
        setStatus('ready')
      }).catch((requestError: unknown) => {
        if (controller.signal.aborted) return
        setError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось загрузить профиль.')
        setStatus('error')
      })
    }
    return () => controller.abort()
  }, [user?.student_id, attempt])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!student) return
    if (fullName.trim().length < 2) { setError('Имя должно содержать не менее двух символов.'); return }
    setError('')
    setMessage('')
    setSaving(true)
    try {
      const result = await updateStudent(student.id, { full_name: fullName.trim(), goal: goal.trim() || null })
      setStudent(result)
      setFullName(result.full_name)
      setGoal(result.goal ?? '')
      setEditing(false)
      setMessage('Профиль сохранён.')
    } catch (requestError) {
      setError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось сохранить профиль.')
    } finally {
      setSaving(false)
    }
  }

  if (user?.student_id == null) return <Alert severity="info">У этой учётной записи нет профиля ученика.</Alert>
  const initials = student?.full_name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <PageHeader title="Мой профиль" description="Ваши данные ученика." />
      <DataStateView status={status} isEmpty={!student} emptyTitle="Профиль не найден" emptyDescription="Профиль ученика отсутствует." errorMessage={error} onRetry={() => { setStatus('loading'); setAttempt((value) => value + 1) }}>
        {student && <Paper variant="outlined" sx={{ p: 3, maxWidth: 640 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64 }}>{initials}</Avatar>
            <Box><Typography variant="h5">{student.full_name}</Typography><Typography color="text.secondary">{student.email}</Typography></Box>
          </Stack>
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && editing && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {editing ? <Box component="form" onSubmit={submit}>
            <Stack spacing={2}>
              <TextField label="Имя и фамилия" value={fullName} onChange={(event) => setFullName(event.target.value)} required inputProps={{ maxLength: 120 }} />
              <TextField label="Цель" value={goal} onChange={(event) => setGoal(event.target.value)} multiline minRows={3} inputProps={{ maxLength: 2000 }} />
              <Stack direction="row" spacing={1}><Button type="submit" variant="contained" disabled={saving}>Сохранить</Button><Button disabled={saving} onClick={() => { setEditing(false); setError(''); setFullName(student.full_name); setGoal(student.goal ?? '') }}>Отмена</Button></Stack>
            </Stack>
          </Box> : <>
            <Typography fontWeight={700}>Цель</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>{student.goal || 'Цель пока не указана.'}</Typography>
            <Button variant="outlined" onClick={() => { setMessage(''); setEditing(true) }}>Редактировать профиль</Button>
          </>}
        </Paper>}
      </DataStateView>
    </>
  )
}
