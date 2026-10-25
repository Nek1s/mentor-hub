import { AppRouter } from './router/AppRouter'
import { AuthProvider } from './providers/AuthProvider'
import { AppDataProvider } from './providers/AppDataProvider'

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <AppRouter />
      </AppDataProvider>
    </AuthProvider>
  )
}

export default App
