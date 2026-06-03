'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { VocabEntry } from '@/types'

const POS_OPTIONS = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'phrase',
  'idiom',
  'phrasal verb',
]

interface VocabFormProps {
  userId: string
  editEntry: VocabEntry | null
  onSuccess: () => void
  onCancel?: () => void
}

export default function VocabForm({ userId, editEntry, onSuccess, onCancel }: VocabFormProps) {
  const [word, setWord] = useState('')
  const [pos, setPos] = useState('')
  const [meaning, setMeaning] = useState('')
  const [example, setExample] = useState('')
  const [topic, setTopic] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editEntry) {
      setWord(editEntry.word)
      setPos(editEntry.pos ?? '')
      setMeaning(editEntry.meaning ?? '')
      setExample(editEntry.example ?? '')
      setTopic(editEntry.topic ?? '')
    } else {
      setWord('')
      setPos('')
      setMeaning('')
      setExample('')
      setTopic('')
    }
    setError('')
  }, [editEntry])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!word.trim()) {
      setError('Word or phrase is required.')
      return
    }
    setSaving(true)
    setError('')

    const supabase = createClient()
    const payload = {
      word: word.trim(),
      pos: pos || null,
      meaning: meaning.trim() || null,
      example: example.trim() || null,
      topic: topic.trim() || null,
    }

    let err
    if (editEntry) {
      ;({ error: err } = await supabase.from('vocab').update(payload).eq('id', editEntry.id))
    } else {
      ;({ error: err } = await supabase
        .from('vocab')
        .insert({ ...payload, user_id: userId, mastered: false }))
    }

    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    onSuccess()
  }

  return (
    <div
      className="bg-mid rounded-[18px] p-6 sm:p-8"
      style={{ border: '1px solid rgba(201,168,76,0.15)' }}
    >
      <h2 className="font-display text-2xl font-bold text-white mb-6">
        {editEntry ? 'Edit Word' : 'Add a New Word'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Word — full width */}
          <div className="sm:col-span-2">
            <label className="block text-gold-l text-xs font-semibold uppercase tracking-widest mb-2">
              Word / Phrase <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              value={word}
              onChange={e => setWord(e.target.value)}
              placeholder="e.g. run out of steam"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-gold-l text-xs font-semibold uppercase tracking-widest mb-2">
              Type
            </label>
            <select value={pos} onChange={e => setPos(e.target.value)}>
              <option value="">— select type —</option>
              {POS_OPTIONS.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-gold-l text-xs font-semibold uppercase tracking-widest mb-2">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Work &amp; Careers"
            />
          </div>

          {/* Meaning */}
          <div className="sm:col-span-2">
            <label className="block text-gold-l text-xs font-semibold uppercase tracking-widest mb-2">
              Meaning
            </label>
            <textarea
              value={meaning}
              onChange={e => setMeaning(e.target.value)}
              placeholder="Definition or translation…"
              rows={2}
              style={{ resize: 'none' }}
            />
          </div>

          {/* Example — visually emphasized */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#E8D5A3' }}>
              Example Sentence
              <span
                className="ml-2 normal-case"
                style={{ letterSpacing: 'normal', color: '#C9A84C', fontWeight: 500 }}
              >
                — write it as you&apos;d say it
              </span>
            </label>
            <textarea
              value={example}
              onChange={e => setExample(e.target.value)}
              placeholder='"She ran out of steam halfway through the presentation."'
              rows={3}
              style={{
                resize: 'none',
                borderColor: 'rgba(201,168,76,0.4)',
                backgroundColor: 'rgba(44,44,77,0.85)',
                fontStyle: 'italic',
              }}
            />
          </div>
        </div>

        {error && <p className="text-red text-sm mt-4">{error}</p>}

        <div className="flex gap-3 mt-6 flex-wrap">
          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-ink font-bold px-6 py-2.5 rounded-[10px] transition-colors"
            style={{ opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Saving…' : editEntry ? 'Update Word' : 'Add Word'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-gold-l px-5 py-2.5 rounded-[10px] transition-colors"
              style={{ border: '1px solid rgba(201,168,76,0.3)' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
