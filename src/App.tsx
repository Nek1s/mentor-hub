import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { MentorsPage } from './pages/MentorsPage'
import { NotesPage } from './pages/NotesPage'
import { ProfilePage } from './pages/ProfilePage'
import { SchedulePage } from './pages/SchedulePage'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/mentors" element={<MentorsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App
