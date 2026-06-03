'use client'

import { useState, useMemo } from 'react'
import type { VocabEntry } from '@/types'

interface ReviewDeckProps {
  vocab: VocabEntry[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ReviewDeck({ vocab }: ReviewDeckProps) {
  const deck = useMemo(() => {
    const unmastered = vocab.filter(v => !v.mastered)
    return shuffle(unmastered.length > 0 ? unmastered : vocab)
  }, [vocab])

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (deck.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'rgba(232,213,163,0.45)' }}>
        No words to review yet. Add some first!
      </div>
    )
  }

  const card = deck[index]

  const goNext = () => {
    setIndex(i => (i + 1) % deck.length)
    setFlipped(false)
  }

  const goPrev = () => {
    setIndex(i => (i - 1 + deck.length) % deck.length)
    setFlipped(false)
  }

  const flip = () => setFlipped(f => !f)

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Counter */}
      <div
        className="text-sm font-semibold"
        style={{ color: '#E8D5A3', letterSpacing: '0.1em' }}
      >
        {index + 1} / {deck.length}
      </div>

      {/* Card */}
      <div
        onClick={flip}
        className="w-full max-w-lg rounded-[22px] px-8 py-12 sm:px-12 cursor-pointer select-none transition-all"
        style={{
          backgroundColor: '#2c2c4d',
          border: '1px solid rgba(201,168,76,0.2)',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        {/* Word */}
        <div className="font-display text-4xl sm:text-5xl font-extrabold text-white text-center leading-tight">
          {card.word}
        </div>

        {/* Type pill */}
        {card.pos && (
          <span
            className="text-xs text-gold"
            style={{
              border: '1px solid rgba(201,168,76,0.5)',
              borderRadius: '99px',
              padding: '3px 12px',
            }}
          >
            {card.pos}
          </span>
        )}

        {/* Revealed side */}
        {flipped && (
          <div className="mt-4 text-center space-y-3 border-t border-gold/20 pt-6 w-full">
            {card.meaning && (
              <p className="text-cream text-lg leading-relaxed">{card.meaning}</p>
            )}
            {card.example && (
              <p className="text-gold-l leading-relaxed" style={{ fontStyle: 'italic' }}>
                &ldquo;{card.example}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          className="text-gold-l px-5 py-2 rounded-[10px] transition-colors"
          style={{ border: '1px solid rgba(201,168,76,0.3)' }}
        >
          ← Prev
        </button>
        <button
          onClick={flip}
          className="bg-gold text-ink font-bold px-6 py-2 rounded-[10px] transition-colors"
        >
          {flipped ? 'Hide' : 'Flip'}
        </button>
        <button
          onClick={goNext}
          className="text-gold-l px-5 py-2 rounded-[10px] transition-colors"
          style={{ border: '1px solid rgba(201,168,76,0.3)' }}
        >
          Next →
        </button>
      </div>

      <p className="text-xs" style={{ color: 'rgba(232,213,163,0.35)' }}>
        Click the card or press Flip to reveal the meaning
      </p>
    </div>
  )
}
