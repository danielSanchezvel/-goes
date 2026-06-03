'use client'

import { useState } from 'react'
import VocabEntryCard from './VocabEntry'
import type { VocabEntry, Profile } from '@/types'

interface VocabListProps {
  vocab: VocabEntry[]
  profiles: Profile[]
  currentUserId: string
  onEdit: (entry: VocabEntry) => void
  onRefresh: () => void
}

type StatusFilter = 'all' | 'learning' | 'mastered'

export default function VocabList({
  vocab,
  profiles,
  currentUserId,
  onEdit,
  onRefresh,
}: VocabListProps) {
  const [search, setSearch] = useState('')
  const [contributor, setContributor] = useState('all')
  const [status, setStatus] = useState<StatusFilter>('all')

  const filtered = vocab.filter(v => {
    if (contributor !== 'all' && v.user_id !== contributor) return false
    if (status === 'mastered' && !v.mastered) return false
    if (status === 'learning' && v.mastered) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        v.word.toLowerCase().includes(q) ||
        (v.meaning?.toLowerCase().includes(q) ?? false) ||
        (v.example?.toLowerCase().includes(q) ?? false) ||
        (v.topic?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  })

  const hasFilters = search || contributor !== 'all' || status !== 'all'

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search words, meanings, topics…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <select
          value={contributor}
          onChange={e => setContributor(e.target.value)}
          style={{ width: undefined }}
          className="sm:w-44"
        >
          <option value="all">All contributors</option>
          {profiles.map(p => (
            <option key={p.id} value={p.id}>
              {p.display_name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value as StatusFilter)}
          style={{ width: undefined }}
          className="sm:w-40"
        >
          <option value="all">All status</option>
          <option value="learning">Still learning</option>
          <option value="mastered">Mastered</option>
        </select>
      </div>

      {/* Count */}
      {vocab.length > 0 && (
        <p
          className="text-xs mb-4"
          style={{ color: 'rgba(232,213,163,0.45)', letterSpacing: '0.05em' }}
        >
          {filtered.length} {filtered.length === 1 ? 'word' : 'words'}
          {hasFilters ? ' matched' : ' total'}
        </p>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'rgba(232,213,163,0.45)' }}>
          {hasFilters ? 'No words match your filters.' : 'No words yet — add the first one!'}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(entry => (
            <VocabEntryCard
              key={entry.id}
              entry={entry}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}
