import { useState } from 'react'
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded'
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import VideocamOutlined from '@mui/icons-material/VideocamOutlined'
import { Avatar, Box, Button, Chip, Divider, Paper, Snackbar, Stack, Typography } from '@mui/material'
import { meetings } from '../entities/appointment/data/meetings'
import { PageHeader } from '../shared/ui/PageHeader'

const dates = [
  { day: 'Сегодня', date: '13 сен' },
  { day: 'Завтра', date: '14 сен' },
  { day: 'Пн', date: '15 сен' },
  { day: 'Вт', date: '16 сен' },
  { day: 'Ср', date: '17 сен' },
]
const slots = ['12:00', '13:00', '16:30', '18:30', '19:30']

export function SchedulePage() {
  const [activeDate, setActiveDate] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [isBooked, setIsBooked] = useState(false)

  return (
    <>
      <PageHeader title="Расписание" description="Управляйте встречами и выбирайте свободное время наставников." />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' }, gap: 2.5 }}>
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarMonthRounded color="primary" />
            <Typography variant="h5">Выберите время</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ mt: 2.5, overflowX: 'auto', pb: 0.5 }}>
            {dates.map((date, index) => (
              <Button key={date.date} onClick={() => { setActiveDate(index); setSelectedSlot(null) }} variant={activeDate === index ? 'contained' : 'outlined'} sx={{ minWidth: 82, flexDirection: 'column', py: 1.1, lineHeight: 1.25 }}>
                <Typography component="span" variant="caption" sx={{ color: 'inherit', opacity: activeDate === index ? 0.82 : 0.75 }}>{date.day}</Typography>
                <Typography component="span" fontSize={14} fontWeight={750}>{date.date}</Typography>
              </Button>
            ))}
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" color="text.secondary">Артем Ребриков · 45 минут · Онлайн-встреча</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.1, mt: 1.75 }}>
            {slots.map((slot) => (
              <Button key={slot} onClick={() => setSelectedSlot(slot)} variant={selectedSlot === slot ? 'contained' : 'outlined'} startIcon={<AccessTimeRounded />} sx={{ justifyContent: 'flex-start' }}>{slot}</Button>
            ))}
          </Box>
          <Button disabled={!selectedSlot} onClick={() => setIsBooked(true)} variant="contained" fullWidth sx={{ mt: 2.5 }}>
            {selectedSlot ? `Записаться на ${selectedSlot}` : 'Выберите время'}
          </Button>
        </Paper>

        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h5">Ближайшие встречи</Typography>
          <Stack spacing={2} sx={{ mt: 2.5 }}>
            {meetings.map((meeting) => (
              <Box key={meeting.id}>
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="body2" fontWeight={700}>{meeting.date}</Typography>
                  <Chip label={meeting.status} size="small" color={meeting.status === 'Подтверждено' ? 'success' : 'warning'} variant="outlined" />
                </Stack>
                <Stack direction="row" spacing={1.1} alignItems="center" sx={{ mt: 1.25 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: meeting.color, color: '#263436', fontWeight: 700, fontSize: 12 }}>{meeting.initials}</Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={700}>{meeting.mentor}</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <VideocamOutlined sx={{ fontSize: 15, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">{meeting.time}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
      <Snackbar open={isBooked} autoHideDuration={3800} onClose={() => setIsBooked(false)} message="Время выбрано — заявка на встречу создана" action={<CheckCircleRounded color="success" />} />
    </>
  )
}
