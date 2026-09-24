import { createContext, useContext, useState, type ReactNode } from 'react'
import { meetings as initialMeetings } from '../../entities/appointment/data/meetings'
import type { CreateMeetingInput, Meeting } from '../../entities/appointment/model/types'
import { mentors as initialMentors } from '../../entities/mentor/data/mentors'
import type { Mentor } from '../../entities/mentor/model/types'
import { initialNotes } from '../../entities/note/data/initialNotes'
import type { CreateNoteInput, Note } from '../../entities/note/model/types'

type AppDataContextValue = {
  mentors: Mentor[]
  meetings: Meeting[]
  notes: Note[]
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
    <AppDataContext.Provider value={{ mentors, meetings, notes, addMeeting, addNote }}>
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
