import { useState } from 'react'
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded'
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded'
import { Box, Button, Divider, FormHelperText, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAppData } from '../../../app/providers/AppDataProvider'

type CreateAppointmentFormProps = {
  onCreated: () => void
}

const dates = [
  { day: 'Сегодня', date: '13 сен', meetingDate: 'Сегодня, 13 сентября' },
  { day: 'Завтра', date: '14 сен', meetingDate: 'Завтра, 14 сентября' },
  { day: 'Пн', date: '15 сен', meetingDate: '15 сентября, понедельник' },
  { day: 'Вт', date: '16 сен', meetingDate: '16 сентября, вторник' },
  { day: 'Ср', date: '17 сен', meetingDate: '17 сентября, среда' },
]

const slots = ['12:00', '13:00', '16:30', '18:30', '19:30']

export function CreateAppointmentForm({ onCreated }: CreateAppointmentFormProps) {
  const { addMeeting } = useAppData()
  const [activeDate, setActiveDate] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [topic, setTopic] = useState('')
  const [slotError, setSlotError] = useState('')
  const [topicError, setTopicError] = useState('')

  const createAppointment = () => {
    const nextSlotError = selectedSlot === null ? 'Выберите удобное время.' : ''
    const nextTopicError = topic.trim().length >= 3 ? '' : 'Тема должна содержать минимум 3 символа.'

    setSlotError(nextSlotError)
    setTopicError(nextTopicError)
    if (nextSlotError || nextTopicError || selectedSlot === null) return

    addMeeting({
      date: dates[activeDate].meetingDate,
      time: `${selectedSlot} — 45 минут`,
      mentor: 'Артем Ребриков',
      topic: topic.trim(),
      initials: 'АР',
      color: '#90caf9',
    })
    setSelectedSlot(null)
    setTopic('')
    onCreated()
  }

  return (
    <Paper component="section" variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CalendarMonthRounded color="primary" />
        <Typography variant="h5">Запись на встречу</Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mt: 2.5, overflowX: 'auto', pb: 0.5 }}>
        {dates.map((date, index) => (
          <Button
            key={date.date}
            onClick={() => {
              setActiveDate(index)
              setSelectedSlot(null)
              setSlotError('')
            }}
            variant={activeDate === index ? 'contained' : 'outlined'}
            sx={{ minWidth: 82, flexDirection: 'column', py: 1.1, lineHeight: 1.25 }}
          >
            <Typography component="span" variant="caption" sx={{ color: 'inherit', opacity: activeDate === index ? 0.82 : 0.75 }}>
              {date.day}
            </Typography>
            <Typography component="span" fontSize={14} fontWeight={750}>{date.date}</Typography>
          </Button>
        ))}
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Typography variant="body2" color="text.secondary">Артем Ребриков · 45 минут · Онлайн-встреча</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.1, mt: 1.75 }}>
        {slots.map((slot) => (
          <Button
            key={slot}
            onClick={() => {
              setSelectedSlot(slot)
              setSlotError('')
            }}
            variant={selectedSlot === slot ? 'contained' : 'outlined'}
            startIcon={<AccessTimeRounded />}
            sx={{ justifyContent: 'flex-start' }}
          >
            {slot}
          </Button>
        ))}
      </Box>
      {slotError && <FormHelperText error sx={{ mt: 1 }}>{slotError}</FormHelperText>}
      <TextField
        value={topic}
        onChange={(event) => {
          setTopic(event.target.value)
          setTopicError('')
        }}
        label="Тема встречи"
        placeholder="Например: разбор портфолио"
        error={Boolean(topicError)}
        helperText={topicError || 'Минимум 3 символа.'}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Button onClick={createAppointment} variant="contained" fullWidth sx={{ mt: 2.5 }}>
        Записаться на встречу
      </Button>
    </Paper>
  )
}
