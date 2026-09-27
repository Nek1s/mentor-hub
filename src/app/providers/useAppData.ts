import { useContext } from 'react'
import { AppDataContext } from './AppDataContext'

export function useAppData() {
  const context = useContext(AppDataContext)

  if (context === null) {
    throw new Error('useAppData нужно использовать внутри AppDataProvider')
  }

  return context
}
