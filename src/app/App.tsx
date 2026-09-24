import { AppRouter } from './router/AppRouter'
import { AppDataProvider } from './providers/AppDataProvider'
import { AppShell } from '../shared/ui/AppShell'

function App() {
  return (
    <AppDataProvider>
      <AppShell>
        <AppRouter />
      </AppShell>
    </AppDataProvider>
  )
}

export default App
