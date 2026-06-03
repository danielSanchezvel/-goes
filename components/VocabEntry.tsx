'use client'

import { createClient } from '@/lib/supabase/client'
import type { VocabEntry } from '@/types'

interface VocabEntryProps {
  entry: VocabEntry
  currentUserId: string
  onEdit: (entry: VocabEntry) => void
  onRefresh: () => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function VocabEntryCard({
  entry,
  currentUserId,
  onEdit,
  onRefresh,
}: VocabEntryProps) {
  const isOwner = entry.user_id === currentUserId

  const toggleMastered = async () => {
    const supabase = createClient()
    await supabase.from('vocab').update({ mastered: !entry.mastered }).eq('id', entry.id)
    onRefresh()
  }

  const deleteEntry = async () => {
    if (!confirm(`Delete "${entry.word}"?`)) return
    const supabase = createClient()
    await supabase.from('vocab').delete().eq('id', entry.id)
    onRefresh()
  }

  const accentColor = entry.mastered ? '#6BBF8A' : '#C9A84C'

  return (
    <div
      className="bg-mid rounded-[18px] px-5 py-5 transition-opacity"
      style={{
        border: '1px solid rgba(201,168,76,0.15)',
        borderLeft: `3px solid ${accentColor}`,
        opacity: entry.mastered ? 0.78 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <span className="font-display text-xl font-bold text-white leading-tight">
            {entry.word}
          </span>
          {entry.pos && (
            <span
              className="text-gold text-xs shrink-0"
              style={{ border: '1px solid rgba(201,168,76,0.5)', borderRadius: '99px', padding: '2px 10px' }}
            >
              {entry.pos}
            </span>
          )}
        </div>

        {isOwner && (
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={toggleMastered}
              title={entry.mastered ? 'Mark as learning' : 'Mark as mastered'}
              className="p-1.5 rounded-lg text-base transition-colors"
              style={{ color: entry.mastered ? '#6BBF8A' : '#E8D5A3' }}
            >
              {entry.mastered ? '★' : '☆'}
            </button>
            <button
              onClick={() => onEdit(entry)}
              title="Edit"
              className="p-1.5 rounded-lg text-base transition-colors text-gold-l"
            >
              ✎
            </button>
            <button
              onClick={deleteEntry}
              title="Delete"
              className="p-1.5 rounded-lg text-base transition-colors text-gold-l"
              onMouseOver={e => ((e.currentTarget as HTMLElement).style.color = '#D9776B')}
              onMouseOut={e => ((e.currentTarget as HTMLElement).style.color = '#E8D5A3')}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {entry.meaning && (
        <p className="text-cream text-sm mt-2 leading-relaxed">{entry.meaning}</p>
      )}

      {entry.example && (
        <p className="text-gold-l text-sm mt-2 leading-relaxed" style={{ fontStyle: 'italic' }}>
          &ldquo;{entry.example}&rdquo;
        </p>
      )}

      <div
        className="flex items-center gap-2 mt-3 text-xs flex-wrap"
        style={{ color: 'rgba(232,213,163,0.55)' }}
      >
        {entry.displayName && <span>{entry.displayName}</span>}
        {entry.topic && (
          <>
            <span>·</span>
            <span>{entry.topic}</span>
          </>
        )}
        <span>·</span>
        <span>{formatDate(entry.created_at)}</span>
      </div>
    </div>
  )
}
