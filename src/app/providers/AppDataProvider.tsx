import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { meetings as initialMeetings } from '../../entities/appointment/data/meetings'
import type { CreateMeetingInput, Meeting } from '../../entities/appointment/model/types'
import { mentors as initialMentors } from '../../entities/mentor/data/mentors'
import type { Mentor } from '../../entities/mentor/model/types'
import { initialNotes } from '../../entities/note/data/initialNotes'
import type { CreateNoteInput, Note } from '../../entities/note/model/types'
import type { DataStatus } from '../../shared/model/dataStatus'

type AppDataContextValue = {
  mentors: Mentor[]
  meetings: Meeting[]
  notes: Note[]
  dataStatus: DataStatus
  retryDataLoading: () => void
  addMeeting: (data: CreateMeetingInput) => Meeting
  addNote: (data: CreateNoteInput) => Note
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

type AppDataProviderProps = {
  children: ReactNode
}

export function AppDataProvider({ children }: AppDataProviderProps) {
  const [mentors] = useState<Mentor[]>(initialMentors)
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [dataStatus, setDataStatus] = useState<DataStatus>('loading')
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hasDemoData = Array.isArray(initialMentors) && Array.isArray(initialMeetings) && Array.isArray(initialNotes)
      setDataStatus(hasDemoData ? 'ready' : 'error')
    }, 450)

    return () => window.clearTimeout(timer)
  }, [loadAttempt])

  const retryDataLoading = () => {
    setDataStatus('loading')
    setLoadAttempt((currentAttempt) => currentAttempt + 1)
  }

  const addMeeting = (data: CreateMeetingInput) => {
    const newMeeting: Meeting = {
      ...data,
      id: Date.now(),
      status: 'Ожидает ответа',
    }

    setMeetings((currentMeetings) => [...currentMeetings, newMeeting])
    return newMeeting
  }

  const addNote = (data: CreateNoteInput) => {
    const newNote: Note = {
      ...data,
      id: Date.now(),
      updatedAt: 'Только что',
    }

    setNotes((currentNotes) => [newNote, ...currentNotes])
    return newNote
  }

  return (
    <AppDataContext.Provider value={{ mentors, meetings, notes, dataStatus, retryDataLoading, addMeeting, addNote }}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const context = useContext(AppDataContext)

  if (context === null) {
    throw new Error('useAppData нужно использовать внутри AppDataProvider')
  }

  return context
}
