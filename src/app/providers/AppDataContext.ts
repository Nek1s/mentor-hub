import { createContext } from 'react'
import type { CreateMeetingInput, Meeting } from '../../entities/appointment/model/types'
import type { Mentor } from '../../entities/mentor/model/types'
import type { CreateNoteInput, Note } from '../../entities/note/model/types'
import type { DataStatus } from '../../shared/model/dataStatus'

export type AppDataContextValue = {
  mentors: Mentor[]
  meetings: Meeting[]
  notes: Note[]
  dataStatus: DataStatus
  retryDataLoading: () => void
  addMeeting: (data: CreateMeetingInput) => Meeting
  addNote: (data: CreateNoteInput) => Note
}

export const AppDataContext = createContext<AppDataContextValue | null>(null)
