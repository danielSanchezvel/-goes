export type VocabEntry = {
  id: string
  user_id: string
  word: string
  pos: string | null
  meaning: string | null
  example: string | null
  topic: string | null
  mastered: boolean
  created_at: string
  displayName?: string
}

export type Profile = {
  id: string
  display_name: string
}

export type Tab = 'all' | 'add' | 'review'
