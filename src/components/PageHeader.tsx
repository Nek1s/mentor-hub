import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

type PageHeaderProps = {
  title: string
  description: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: { sm: 'end' }, justifyContent: 'space-between', mb: 3.5, flexDirection: { xs: 'column', sm: 'row' } }}>
      <Box>
        <Typography variant="h3" component="h1" sx={{ mb: 0.7 }}>{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Box>
      {action}
    </Box>
  )
}
