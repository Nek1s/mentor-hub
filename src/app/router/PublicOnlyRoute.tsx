import { CircularProgress, Stack } from '@mui/material'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../providers/useAuth'

export function PublicOnlyRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <Stack alignItems="center" sx={{ pt: 10 }}><CircularProgress /></Stack>
  }

  return status === 'authenticated' ? <Navigate to="/dashboard" replace /> : <Outlet />
}
