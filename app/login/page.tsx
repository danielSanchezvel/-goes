'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !displayName.trim()) {
      setError('Both your name and email are required.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { display_name: displayName.trim() },
      },
    })

    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header lockup */}
        <div className="mb-10 text-center">
          <p
            className="text-gold text-xs font-bold uppercase mb-4"
            style={{ letterSpacing: '0.22em' }}
          >
            English Conversatorio · B1 → C1
          </p>
          <h1 className="font-display text-5xl font-extrabold text-white leading-tight mb-3">
            Vocabulary{' '}
            <em className="text-gold not-italic font-semibold" style={{ fontStyle: 'italic' }}>
              Log
            </em>
          </h1>
          <p className="text-gold-l text-sm">Sign in to access the shared word bank</p>
        </div>

        <div className="h-[1.5px] bg-gold mb-8" style={{ opacity: 0.6 }} />

        {sent ? (
          <div
            className="bg-mid rounded-[18px] p-8 text-center"
            style={{ border: '1px solid rgba(201,168,76,0.15)' }}
          >
            <div className="text-5xl mb-4">✉</div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-gold-l text-sm leading-relaxed">
              We sent a magic link to{' '}
              <strong className="text-cream">{email}</strong>.{' '}
              Click it to sign in — no password needed.
            </p>
          </div>
        ) : (
          <div
            className="bg-mid rounded-[18px] p-8"
            style={{ border: '1px solid rgba(201,168,76,0.15)' }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-gold-l text-xs font-semibold uppercase tracking-widest mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. María"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-gold-l text-xs font-semibold uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>

              {error && <p className="text-red text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-gold text-ink font-bold py-3 rounded-[10px] mt-2 transition-colors"
                style={{ opacity: loading ? 0.6 : 1 }}
                onMouseOver={e =>
                  !loading && ((e.target as HTMLElement).style.backgroundColor = '#E8D5A3')
                }
                onMouseOut={e =>
                  ((e.target as HTMLElement).style.backgroundColor = '#C9A84C')
                }
              >
                {loading ? 'Sending…' : 'Send Magic Link'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
