import { useEffect, useState, type FormEvent } from 'react'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../app/providers/useAuth'
import { notesApi, type ApiNote } from '../entities/note/api/notes'
import { ApiRequestError } from '../shared/api/client'
import type { DataStatus } from '../shared/model/dataStatus'
import { DataStateView } from '../shared/ui/DataStateView'
import { PageHeader } from '../shared/ui/PageHeader'

export function NotesPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<ApiNote[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [status, setStatus] = useState<DataStatus>('loading')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    notesApi.list(controller.signal).then((result) => {
      setNotes(result)
      setSelectedId((current) => result.some((note) => note.id === current) ? current : result[0]?.id ?? null)
      setStatus('ready')
    }).catch((requestError: unknown) => {
      if (controller.signal.aborted) return
      setError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось загрузить заметки.')
      setStatus('error')
    })
    return () => controller.abort()
  }, [attempt])

  const selected = notes.find((note) => note.id === selectedId)
  const openForm = (note?: ApiNote) => {
    setEditingId(note?.id ?? null)
    setTitle(note?.title ?? '')
    setContent(note?.content ?? '')
    setFormError('')
    setNotice('')
    setOpen(true)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user?.student_id) { setFormError('Для создания заметок нужен профиль ученика.'); return }
    if (title.trim().length < 2 || content.trim().length < 2) { setFormError('Заголовок и текст должны содержать не менее двух символов.'); return }
    setFormError(''); setBusy(true)
    try {
      const fields = { title: title.trim(), content: content.trim() }
      const result = editingId === null
        ? await notesApi.create({ ...fields, student_id: user.student_id })
        : await notesApi.update(editingId, fields)
      setNotes((current) => [result, ...current.filter((note) => note.id !== result.id)])
      setSelectedId(result.id)
      setOpen(false)
      setNotice('Заметка сохранена.')
    } catch (requestError) {
      setFormError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось сохранить заметку.')
    } finally { setBusy(false) }
  }

  const remove = async (note: ApiNote) => {
    if (!window.confirm('Удалить эту заметку?')) return
    setError(''); setNotice(''); setBusy(true)
    try {
      await notesApi.remove(note.id)
      const remaining = notes.filter((item) => item.id !== note.id)
      setNotes(remaining)
      setSelectedId(remaining[0]?.id ?? null)
      setNotice('Заметка удалена.')
    } catch (requestError) { setError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось удалить заметку.') }
    finally { setBusy(false) }
  }

  return <>
    <PageHeader title="Личные заметки" description="Сохраняйте выводы и важные договорённости." action={<Button variant="contained" onClick={() => openForm()} disabled={status !== 'ready' || !user?.student_id}>Новая заметка</Button>} />
    {status !== 'error' && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
    <DataStateView status={status} isEmpty={notes.length === 0} emptyTitle="Заметок пока нет" emptyDescription="Создайте первую заметку." errorMessage={error} onRetry={() => { setError(''); setStatus('loading'); setAttempt((value) => value + 1) }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '330px minmax(0, 1fr)' }, gap: 2.5 }}>
        <Stack spacing={1}>{notes.map((note) => <Paper component="button" type="button" key={note.id} variant="outlined" onClick={() => setSelectedId(note.id)} sx={{ textAlign: 'left', p: 2, cursor: 'pointer', borderColor: selectedId === note.id ? 'primary.main' : 'divider', bgcolor: selectedId === note.id ? '#e3f2fd' : 'background.paper' }}>
          <Typography fontWeight={700}>{note.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.content}</Typography>
        </Paper>)}</Stack>
        {selected && <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="caption" color="text.secondary">Обновлено: {new Date(selected.updated_at).toLocaleString('ru-RU')}</Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>{selected.title}</Typography>
          <Typography sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>{selected.content}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 3 }}><Button onClick={() => openForm(selected)} disabled={busy}>Изменить</Button><Button color="error" disabled={busy} onClick={() => void remove(selected)}>Удалить</Button></Stack>
        </Paper>}
      </Box>
    </DataStateView>
    <Dialog open={open} onClose={() => { if (!busy) setOpen(false) }} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={submit}>
        <DialogTitle>{editingId === null ? 'Новая заметка' : 'Редактирование заметки'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <TextField label="Заголовок" value={title} onChange={(event) => setTitle(event.target.value)} required fullWidth sx={{ mt: 1 }} inputProps={{ minLength: 2, maxLength: 160 }} />
          <TextField label="Текст заметки" value={content} onChange={(event) => setContent(event.target.value)} required fullWidth multiline minRows={5} sx={{ mt: 2 }} inputProps={{ minLength: 2, maxLength: 5000 }} />
        </DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)} disabled={busy}>Отмена</Button><Button type="submit" variant="contained" disabled={busy}>Сохранить</Button></DialogActions>
      </Box>
    </Dialog>
  </>
}
