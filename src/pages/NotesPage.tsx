import { useState } from 'react'
import AddRounded from '@mui/icons-material/AddRounded'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import StickyNote2Rounded from '@mui/icons-material/StickyNote2Rounded'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import { initialNotes } from '../entities/note/data/initialNotes'
import type { Note } from '../entities/note/model/types'
import { PageHeader } from '../shared/ui/PageHeader'

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [selectedId, setSelectedId] = useState(initialNotes[0].id)
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const selectedNote = notes.find((note) => note.id === selectedId) ?? notes[0]

  const addNote = () => {
    if (!title.trim() || !text.trim()) return
    const newNote: Note = { id: Date.now(), title: title.trim(), text: text.trim(), labels: ['Новая'], updatedAt: 'Только что' }
    setNotes((currentNotes) => [newNote, ...currentNotes])
    setSelectedId(newNote.id)
    setTitle('')
    setText('')
    setIsOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Личные заметки"
        description="Фиксируйте выводы после встреч и не теряйте важные договорённости."
        action={<Button variant="contained" startIcon={<AddRounded />} onClick={() => setIsOpen(true)}>Новая заметка</Button>}
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '330px minmax(0, 1fr)' }, gap: 2.5 }}>
        <Stack spacing={1.1}>
          {notes.map((note) => (
            <Paper
              key={note.id}
              variant="outlined"
              onClick={() => setSelectedId(note.id)}
              sx={{ p: 2, borderColor: selectedId === note.id ? 'primary.main' : 'divider', cursor: 'pointer', bgcolor: selectedId === note.id ? '#e3f2fd' : 'white' }}
            >
              <Typography fontWeight={750}>{note.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>{note.text}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.15 }}>{note.updatedAt}</Typography>
            </Paper>
          ))}
        </Stack>
        {selectedNote && (
          <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 4 }, minHeight: 360 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ display: 'grid', width: 34, height: 34, placeItems: 'center', borderRadius: 1, bgcolor: '#e3f2fd', color: 'primary.main' }}><StickyNote2Rounded fontSize="small" /></Box>
                  <Typography variant="caption" color="text.secondary">Обновлено: {selectedNote.updatedAt}</Typography>
                </Stack>
                <Typography variant="h4" sx={{ mt: 2.5 }}>{selectedNote.title}</Typography>
              </Box>
              <IconButton aria-label="Открыть заметку"><ArrowOutwardRounded /></IconButton>
            </Stack>
            <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 2.25 }}>
              {selectedNote.labels.map((label) => <Chip key={label} label={label} size="small" variant="outlined" />)}
            </Stack>
            <Typography sx={{ mt: 3, lineHeight: 1.8, color: 'text.secondary', whiteSpace: 'pre-line' }}>{selectedNote.text}</Typography>
          </Paper>
        )}
      </Box>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pr: 6 }}>Новая заметка<IconButton onClick={() => setIsOpen(false)} aria-label="Закрыть" sx={{ position: 'absolute', right: 12, top: 12 }}><CloseRounded /></IconButton></DialogTitle>
        <DialogContent>
          <TextField value={title} onChange={(event) => setTitle(event.target.value)} autoFocus label="Заголовок" fullWidth sx={{ mt: 1 }} />
          <TextField value={text} onChange={(event) => setText(event.target.value)} label="Текст заметки" fullWidth multiline minRows={5} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setIsOpen(false)}>Отмена</Button>
          <Button onClick={addNote} variant="contained" disabled={!title.trim() || !text.trim()}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
