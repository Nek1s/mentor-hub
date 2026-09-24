import { useMemo, useState } from 'react'
import SearchRounded from '@mui/icons-material/SearchRounded'
import TuneRounded from '@mui/icons-material/TuneRounded'
import { Box, InputAdornment, MenuItem, Select, TextField } from '@mui/material'
import { useAppData } from '../app/providers/AppDataProvider'
import { MentorCard } from '../entities/mentor/ui/MentorCard'
import { DataStateView } from '../shared/ui/DataStateView'
import { PageHeader } from '../shared/ui/PageHeader'

export function MentorsPage() {
  const { mentors, dataStatus, retryDataLoading } = useAppData()
  const [query, setQuery] = useState('')
  const [direction, setDirection] = useState('Все направления')
  const filteredMentors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return mentors.filter((mentor) => {
      const matchesQuery = !normalizedQuery || `${mentor.name} ${mentor.role} ${mentor.skills.join(' ')}`.toLowerCase().includes(normalizedQuery)
      const matchesDirection = direction === 'Все направления' || mentor.skills.includes(direction)
      return matchesQuery && matchesDirection
    })
  }, [direction, query])

  return (
    <>
      <PageHeader title="Наставники" description="Выберите специалиста под текущую цель и запишитесь на удобное время." />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 230px' }, gap: 1.25, mb: 3.25 }}>
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по имени, навыку или роли"
          fullWidth
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRounded color="action" /></InputAdornment> } }}
        />
        <Select value={direction} onChange={(event) => setDirection(event.target.value)} startAdornment={<InputAdornment position="start"><TuneRounded color="action" fontSize="small" /></InputAdornment>}>
          <MenuItem value="Все направления">Все направления</MenuItem>
          <MenuItem value="React">Разработка</MenuItem>
          <MenuItem value="UX/UI">Дизайн</MenuItem>
          <MenuItem value="SQL">Аналитика</MenuItem>
        </Select>
      </Box>
      <DataStateView
        status={dataStatus}
        isEmpty={filteredMentors.length === 0}
        emptyTitle="Ничего не нашли"
        emptyDescription="Попробуйте изменить запрос или выбрать другое направление."
        onRetry={retryDataLoading}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
          {filteredMentors.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)}
        </Box>
      </DataStateView>
    </>
  )
}
