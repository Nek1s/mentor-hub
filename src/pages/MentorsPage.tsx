import { useEffect, useMemo, useState } from 'react'
import SearchRounded from '@mui/icons-material/SearchRounded'
import { Avatar, Box, Button, InputAdornment, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { getMentors, type MentorResponse } from '../entities/mentor/api/mentors'
import { ApiRequestError } from '../shared/api/client'
import type { DataStatus } from '../shared/model/dataStatus'
import { DataStateView } from '../shared/ui/DataStateView'
import { PageHeader } from '../shared/ui/PageHeader'

export function MentorsPage() {
  const [mentors, setMentors] = useState<MentorResponse[]>([])
  const [status, setStatus] = useState<DataStatus>('loading')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [query, setQuery] = useState('')
  const [direction, setDirection] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    getMentors(controller.signal).then((result) => {
      setMentors(result.filter((mentor) => mentor.is_active))
      setStatus('ready')
    }).catch((requestError: unknown) => {
      if (controller.signal.aborted) return
      setError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось загрузить наставников.')
      setStatus('error')
    })
    return () => controller.abort()
  }, [attempt])

  const directions = useMemo(() => [...new Set(mentors.map((mentor) => mentor.specialization))].sort(), [mentors])
  const filteredMentors = useMemo(() => {
    const search = query.trim().toLowerCase()
    return mentors.filter((mentor) =>
      (!direction || mentor.specialization === direction) &&
      [mentor.full_name, mentor.specialization, mentor.company, mentor.bio].some((value) => value?.toLowerCase().includes(search)),
    )
  }, [direction, mentors, query])

  const retry = () => { setStatus('loading'); setAttempt((current) => current + 1) }

  return (
    <>
      <PageHeader title="Наставники" description="Каталог наставников из базы данных." />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 230px' }, gap: 1.25, mb: 3.25 }}>
        <TextField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по имени, направлению или компании" fullWidth slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRounded color="action" /></InputAdornment> } }} />
        <Select value={direction} onChange={(event) => setDirection(event.target.value)} displayEmpty inputProps={{ 'aria-label': 'Направление' }}>
          <MenuItem value="">Все направления</MenuItem>
          {directions.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
        </Select>
      </Box>
      <DataStateView status={status} isEmpty={filteredMentors.length === 0} emptyTitle={mentors.length ? 'Ничего не нашли' : 'Наставников пока нет'} emptyDescription={mentors.length ? 'Попробуйте изменить поиск или направление.' : 'Когда наставники появятся в базе, они отобразятся здесь.'} errorMessage={error} onRetry={retry}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
          {filteredMentors.map((mentor) => (
            <Paper key={mentor.id} variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar>{mentor.full_name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</Avatar>
                <Box><Typography fontWeight={700}>{mentor.full_name}</Typography><Typography variant="body2" color="text.secondary">{mentor.specialization}</Typography></Box>
              </Stack>
              {mentor.company && <Typography variant="body2" sx={{ mt: 2 }}>{mentor.company}</Typography>}
              {mentor.bio && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{mentor.bio}</Typography>}
              <Button component={RouterLink} to={`/schedule?mentor=${mentor.id}`} variant="outlined" sx={{ mt: 2 }}>Записаться</Button>
            </Paper>
          ))}
        </Box>
      </DataStateView>
    </>
  )
}
