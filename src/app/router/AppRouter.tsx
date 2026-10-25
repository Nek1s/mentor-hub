import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from '../../pages/DashboardPage'
import { MentorsPage } from '../../pages/MentorsPage'
import { NotesPage } from '../../pages/NotesPage'
import { ProfilePage } from '../../pages/ProfilePage'
import { SchedulePage } from '../../pages/SchedulePage'
import { LoginPage } from '../../pages/LoginPage'
import { RegisterPage } from '../../pages/RegisterPage'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'
import { PrivateLayout } from './PrivateLayout'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
