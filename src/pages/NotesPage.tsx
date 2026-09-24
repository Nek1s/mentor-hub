import { useState } from 'react'
import AddRounded from '@mui/icons-material/AddRounded'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import StickyNote2Rounded from '@mui/icons-material/StickyNote2Rounded'
import { Box, Button, Chip, IconButton, Paper, Stack, Typography } from '@mui/material'
import { useAppData } from '../app/providers/AppDataProvider'
import { CreateNoteDialog } from '../features/create-note/ui/CreateNoteDialog'
import { DataStateView } from '../shared/ui/DataStateView'
import { PageHeader } from '../shared/ui/PageHeader'

export function NotesPage() {
  const { notes, dataStatus, retryDataLoading } = useAppData()
  const [selectedId, setSelectedId] = useState<number | null>(notes[0]?.id ?? null)
  const [isOpen, setIsOpen] = useState(false)
  const selectedNote = notes.find((note) => note.id === selectedId) ?? notes[0]

  return (
    <>
      <PageHeader
        title="Личные заметки"
        description="Фиксируйте выводы после встреч и не теряйте важные договорённости."
        action={<Button variant="contained" startIcon={<AddRounded />} onClick={() => setIsOpen(true)}>Новая заметка</Button>}
      />
      <DataStateView
        status={dataStatus}
        isEmpty={notes.length === 0}
        emptyTitle="Заметок пока нет"
        emptyDescription="Создайте первую заметку после встречи с наставником."
        onRetry={retryDataLoading}
      >
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
      </DataStateView>

      <CreateNoteDialog open={isOpen} onClose={() => setIsOpen(false)} onCreated={setSelectedId} />
    </>
  )
}
