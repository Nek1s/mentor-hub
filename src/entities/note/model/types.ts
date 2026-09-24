export type Note = {
  id: number
  title: string
  text: string
  labels: string[]
  updatedAt: string
}

export type CreateNoteInput = Omit<Note, 'id' | 'updatedAt'>
