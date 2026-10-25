import { CircularProgress, Stack } from '@mui/material'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../providers/useAuth'

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <Stack alignItems="center" sx={{ pt: 10 }}><CircularProgress /></Stack>
  }

  return status === 'authenticated' ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}
