import { useState } from 'react'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import VideocamOutlined from '@mui/icons-material/VideocamOutlined'
import { Avatar, Box, Chip, Paper, Snackbar, Stack, Typography } from '@mui/material'
import { useAppData } from '../app/providers/AppDataProvider'
import { CreateAppointmentForm } from '../features/create-appointment/ui/CreateAppointmentForm'
import { PageHeader } from '../shared/ui/PageHeader'

export function SchedulePage() {
  const { meetings } = useAppData()
  const [isBooked, setIsBooked] = useState(false)

  return (
    <>
      <PageHeader title="Расписание" description="Управляйте встречами и выбирайте свободное время наставников." />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' }, gap: 2.5 }}>
        <CreateAppointmentForm onCreated={() => setIsBooked(true)} />

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
