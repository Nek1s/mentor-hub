import { Link as RouterLink } from 'react-router-dom'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import StickyNote2Rounded from '@mui/icons-material/StickyNote2Rounded'
import { Avatar, Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material'
import { useAppData } from '../app/providers/AppDataProvider'
import { DataStateView } from '../shared/ui/DataStateView'

const metrics = [
  { value: '2', label: 'встречи запланированы', icon: <CalendarMonthRounded /> },
  { value: '3', label: 'заметки за эту неделю', icon: <StickyNote2Rounded /> },
  { value: '1', label: 'новый ответ от наставника', icon: <ChevronRightRounded /> },
]

export function DashboardPage() {
  const { meetings, dataStatus, retryDataLoading } = useAppData()
  const closestMeeting = meetings[0]

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: { sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, mb: 3.5 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ mb: 0.6 }}>Добрый день, Никита</Typography>
          <Typography color="text.secondary">Здесь можно посмотреть ближайшие встречи и заметки.</Typography>
        </Box>
        <Button component={RouterLink} to="/mentors" variant="outlined" endIcon={<ArrowForwardRounded />}>Найти наставника</Button>
      </Box>

      <DataStateView
        status={dataStatus}
        isEmpty={meetings.length === 0}
        emptyTitle="Ближайших встреч пока нет"
        emptyDescription="Перейдите в расписание, чтобы выбрать время у наставника."
        onRetry={retryDataLoading}
      >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.45fr 0.9fr' }, gap: 2.5 }}>
        <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', minHeight: 250, flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Chip label="Ближайшая встреча" size="small" color="primary" />
              <Typography variant="h4" sx={{ mt: 2 }}>{closestMeeting.topic}</Typography>
              <Typography sx={{ mt: 1 }} color="text.secondary">Обсудите структуру кейсов, их подачу и следующие шаги.</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'end', flexWrap: 'wrap', mt: 3 }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Avatar sx={{ bgcolor: closestMeeting.color, color: '#263436', fontWeight: 700 }}>{closestMeeting.initials}</Avatar>
                <Box>
                  <Typography fontWeight={700}>{closestMeeting.mentor}</Typography>
                  <Typography variant="body2" color="text.secondary">{closestMeeting.date}, {closestMeeting.time}</Typography>
                </Box>
              </Stack>
              <Button component={RouterLink} to="/schedule" variant="contained">
                Открыть расписание
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Typography variant="h5">Мой прогресс</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.7 }}>Небольшая сводка на этой неделе</Typography>
          <Stack divider={<Divider flexItem />} sx={{ mt: 2.1 }}>
            {metrics.map((metric) => (
              <Stack key={metric.label} direction="row" spacing={1.5} alignItems="center" sx={{ py: 1.25 }}>
                <Box sx={{ display: 'grid', width: 36, height: 36, placeItems: 'center', borderRadius: 1, bgcolor: '#e3f2fd', color: 'primary.main' }}>{metric.icon}</Box>
                <Box>
                  <Typography fontWeight={750}>{metric.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{metric.label}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4.5, mb: 1.75 }}>
        <Typography variant="h4">Запланированные встречи</Typography>
        <Button component={RouterLink} to="/schedule" color="primary" endIcon={<ArrowForwardRounded />}>Все встречи</Button>
      </Box>
      <Stack spacing={1.25}>
        {meetings.map((meeting) => (
          <Paper key={meeting.id} variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: { sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ minWidth: { sm: 180 } }}>
              <Typography variant="body2" fontWeight={700}>{meeting.date}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>{meeting.time}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ flexGrow: 1 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: meeting.color, color: '#263436', fontSize: 13, fontWeight: 700 }}>{meeting.initials}</Avatar>
              <Box>
                <Typography fontWeight={700}>{meeting.mentor}</Typography>
                <Typography variant="body2" color="text.secondary">{meeting.topic}</Typography>
              </Box>
            </Stack>
            <Chip label={meeting.status} size="small" color={meeting.status === 'Подтверждено' ? 'success' : 'warning'} variant="outlined" />
          </Paper>
        ))}
      </Stack>
      </DataStateView>
    </>
  )
}
