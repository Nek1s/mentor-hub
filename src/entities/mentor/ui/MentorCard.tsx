import { Link as RouterLink } from 'react-router-dom'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import StarRounded from '@mui/icons-material/StarRounded'
import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import type { Mentor } from '../model/types'

type MentorCardProps = {
  mentor: Mentor
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Paper variant="outlined" sx={{ display: 'flex', height: '100%', flexDirection: 'column', p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 48, height: 48, bgcolor: mentor.color, color: 'text.primary', fontWeight: 700 }}>{mentor.initials}</Avatar>
          <Box>
            <Typography fontWeight={750}>{mentor.name}</Typography>
            <Typography variant="body2" color="text.secondary">{mentor.role}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={0.35} alignItems="center" sx={{ color: '#be792d' }}>
          <StarRounded sx={{ fontSize: 18 }} />
          <Typography variant="body2" fontWeight={700} color="text.primary">{mentor.rating}</Typography>
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{mentor.company}</Typography>
      <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.25 }}>
        {mentor.skills.map((skill) => <Chip key={skill} label={skill} size="small" variant="outlined" />)}
      </Stack>

      <Box sx={{ mt: 'auto', pt: 2.5 }}>
        <Typography variant="caption" color="text.secondary">Ближайшее время</Typography>
        <Typography variant="body2" fontWeight={650} sx={{ mt: 0.25 }}>{mentor.nextAvailable}</Typography>
        <Button component={RouterLink} to="/schedule" fullWidth variant="contained" endIcon={<ArrowOutwardRounded />} sx={{ mt: 1.75 }}>
          Записаться
        </Button>
      </Box>
    </Paper>
  )
}
