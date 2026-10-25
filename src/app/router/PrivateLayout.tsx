import { Outlet } from 'react-router-dom'
import { AppShell } from '../../shared/ui/AppShell'

export function PrivateLayout() {
  return <AppShell><Outlet /></AppShell>
}
