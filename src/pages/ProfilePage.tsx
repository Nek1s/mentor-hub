import EditRounded from '@mui/icons-material/EditRounded'
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import { PageHeader } from '../components/PageHeader'

export function ProfilePage() {
  return (
    <>
      <PageHeader title="Мой профиль" description="Информация, которую видят наставники при рассмотрении заявки." />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '0.8fr 1.2fr' }, gap: 2.5, maxWidth: 940 }}>
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Avatar sx={{ width: 88, height: 88, mx: 'auto', fontSize: 27, fontWeight: 700 }}>НИ</Avatar>
          <Typography variant="h4" sx={{ mt: 2 }}>Никита Иванов</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>Начинающий frontend-разработчик</Typography>
          <Chip label="Ищу наставника" color="success" size="small" sx={{ mt: 1.5 }} />
          <Button variant="outlined" startIcon={<EditRounded />} fullWidth sx={{ mt: 3 }}>Редактировать профиль</Button>
        </Paper>
        <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="h5">О себе</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.1, lineHeight: 1.75 }}>Перехожу в frontend-разработку и собираю первое портфолио. Хочу получить обратную связь по проектам, увереннее проходить собеседования и составить реалистичный план развития.</Typography>
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Stack direction="row" spacing={1.25} alignItems="center"><MailOutlineRounded color="action" /><Box><Typography variant="caption" color="text.secondary">Почта</Typography><Typography variant="body2" fontWeight={650}>nikita.ivanov@example.com</Typography></Box></Stack>
            <Stack direction="row" spacing={1.25} alignItems="center"><SchoolOutlined color="action" /><Box><Typography variant="caption" color="text.secondary">Цель на ближайший месяц</Typography><Typography variant="body2" fontWeight={650}>Оформить портфолио и подготовиться к интервью</Typography></Box></Stack>
          </Stack>
          <Typography variant="body2" fontWeight={700} sx={{ mt: 3 }}>Интересующие направления</Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.25 }}>
            {['React', 'TypeScript', 'Портфолио', 'Карьера'].map((interest) => <Chip key={interest} label={interest} variant="outlined" />)}
          </Stack>
        </Paper>
      </Box>
    </>
  )
}
