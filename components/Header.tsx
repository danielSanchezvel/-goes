'use client'

import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  user: User | null
  displayName?: string
}

export default function Header({ user, displayName }: HeaderProps) {
  const router = useRouter()

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="max-w-4xl mx-auto px-4 pt-10 pb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-gold text-xs font-bold uppercase mb-3"
            style={{ letterSpacing: '0.22em' }}
          >
            English Conversatorio · B1 → C1
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-2">
            Vocabulary{' '}
            <em className="text-gold not-italic font-semibold" style={{ fontStyle: 'italic' }}>
              Log
            </em>
          </h1>
          <p className="text-gold-l text-sm">Shared word bank for the group</p>
        </div>

        {user && (
          <div className="flex items-center gap-3 mt-2 shrink-0">
            {displayName && (
              <span className="text-gold-l text-sm hidden sm:block">{displayName}</span>
            )}
            <button
              onClick={signOut}
              className="text-gold-l text-sm px-4 py-1.5 rounded-lg transition-colors"
              style={{ border: '1px solid rgba(201,168,76,0.3)' }}
              onMouseOver={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = '#C9A84C'
                ;(e.currentTarget as HTMLElement).style.color = '#C9A84C'
              }}
              onMouseOut={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'
                ;(e.currentTarget as HTMLElement).style.color = '#E8D5A3'
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 h-[1.5px] bg-gold" style={{ opacity: 0.6 }} />
    </header>
  )
}
