import { useState } from 'react'
import CloseRounded from '@mui/icons-material/CloseRounded'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import { useAppData } from '../../../app/providers/AppDataProvider'

type CreateNoteDialogProps = {
  open: boolean
  onClose: () => void
  onCreated: (noteId: number) => void
}

type NoteFormErrors = {
  title: string
  text: string
}

const emptyErrors: NoteFormErrors = { title: '', text: '' }

export function CreateNoteDialog({ open, onClose, onCreated }: CreateNoteDialogProps) {
  const { addNote } = useAppData()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [errors, setErrors] = useState<NoteFormErrors>(emptyErrors)

  const closeDialog = () => {
    setTitle('')
    setText('')
    setErrors(emptyErrors)
    onClose()
  }

  const createNote = () => {
    const nextErrors: NoteFormErrors = {
      title: title.trim().length >= 2 ? '' : 'Введите заголовок минимум из 2 символов.',
      text: text.trim().length >= 2 ? '' : 'Введите текст заметки минимум из 2 символов.',
    }

    setErrors(nextErrors)
    if (nextErrors.title || nextErrors.text) return

    const newNote = addNote({
      title: title.trim(),
      text: text.trim(),
      labels: ['Новая'],
    })
    onCreated(newNote.id)
    closeDialog()
  }

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        Новая заметка
        <IconButton onClick={closeDialog} aria-label="Закрыть" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            setErrors((currentErrors) => ({ ...currentErrors, title: '' }))
          }}
          autoFocus
          label="Заголовок"
          error={Boolean(errors.title)}
          helperText={errors.title || 'Например: итоги встречи с наставником.'}
          fullWidth
          sx={{ mt: 1 }}
        />
        <TextField
          value={text}
          onChange={(event) => {
            setText(event.target.value)
            setErrors((currentErrors) => ({ ...currentErrors, text: '' }))
          }}
          label="Текст заметки"
          error={Boolean(errors.text)}
          helperText={errors.text || 'Сохраните важные выводы или следующий шаг.'}
          fullWidth
          multiline
          minRows={5}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={closeDialog}>Отмена</Button>
        <Button onClick={createNote} variant="contained">Сохранить</Button>
      </DialogActions>
    </Dialog>
  )
}
