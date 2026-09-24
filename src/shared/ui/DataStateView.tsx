import type { ReactNode } from 'react'
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import type { DataStatus } from '../model/dataStatus'

type DataStateViewProps = {
  status: DataStatus
  isEmpty: boolean
  emptyTitle: string
  emptyDescription: string
  onRetry: () => void
  children: ReactNode
}

export function DataStateView({ status, isEmpty, emptyTitle, emptyDescription, onRetry, children }: DataStateViewProps) {
  if (status === 'loading') {
    return (
      <Paper variant="outlined" sx={{ display: 'grid', minHeight: 220, placeItems: 'center', p: 3 }}>
        <Stack alignItems="center" spacing={1.5}>
          <CircularProgress size={30} />
          <Typography color="text.secondary">Загружаем данные…</Typography>
        </Stack>
      </Paper>
    )
  }

  if (status === 'error') {
    return (
      <Alert
        severity="error"
        action={<Button color="inherit" size="small" onClick={onRetry}>Повторить</Button>}
      >
        Не удалось подготовить демонстрационные данные. Попробуйте ещё раз.
      </Alert>
    )
  }

  if (isEmpty) {
    return (
      <Box sx={{ py: 8, textAlign: 'center', border: '1px dashed #d7dfd8', borderRadius: 3 }}>
        <Typography fontWeight={700}>{emptyTitle}</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>{emptyDescription}</Typography>
      </Box>
    )
  }

  return <>{children}</>
}
