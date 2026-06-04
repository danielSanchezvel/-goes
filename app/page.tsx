'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import StatsBar from '@/components/StatsBar'
import Tabs from '@/components/Tabs'
import VocabList from '@/components/VocabList'
import VocabForm from '@/components/VocabForm'
import ReviewDeck from '@/components/ReviewDeck'
import type { VocabEntry, Profile, Tab } from '@/types'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [vocab, setVocab] = useState<VocabEntry[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [tab, setTab] = useState<Tab>('all')
  const [editingEntry, setEditingEntry] = useState<VocabEntry | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchVocab() {
    const supabase = createClient()
    const [vocabRes, profilesRes] = await Promise.all([
      supabase.from('vocab').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, display_name'),
    ])

    const profileList: Profile[] = profilesRes.data ?? []
    setProfiles(profileList)

    const profileMap = new Map(profileList.map(p => [p.id, p.display_name]))
    const enriched: VocabEntry[] = (vocabRes.data ?? []).map(v => ({
      ...v,
      displayName: profileMap.get(v.user_id) ?? 'Unknown',
    }))
    setVocab(enriched)
  }

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single()
        if (profile) setDisplayName(profile.display_name)
      }

      await fetchVocab()
      setLoading(false)
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = (entry: VocabEntry) => {
    setEditingEntry(entry)
    setTab('add')
  }

  const handleFormSuccess = async () => {
    await fetchVocab()
    setEditingEntry(null)
    setTab('all')
  }

  const handleTabChange = (t: Tab) => {
    if (t !== 'add') setEditingEntry(null)
    setTab(t)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gold-l" style={{ animation: 'pulse 1.5s infinite' }}>
          Loading…
        </p>
      </div>
    )
  }

  const mastered = vocab.filter(v => v.mastered).length
  const contributors = new Set(vocab.map(v => v.user_id)).size

  return (
    <div className="min-h-screen">
      <Header user={user} displayName={displayName} />
      <main className="max-w-4xl mx-auto px-4 pb-16">
        <StatsBar
          total={vocab.length}
          mastered={mastered}
          learning={vocab.length - mastered}
          contributors={contributors}
        />
        <Tabs
          active={tab}
          onChange={handleTabChange}
          editMode={tab === 'add' && !!editingEntry}
        />
        {tab === 'all' && (
          <VocabList
            vocab={vocab}
            profiles={profiles}
            currentUserId={user?.id ?? ''}
            onEdit={handleEdit}
            onRefresh={fetchVocab}
          />
        )}
        {tab === 'add' && (
          <VocabForm
            userId={user?.id ?? ''}
            editEntry={editingEntry}
            onSuccess={handleFormSuccess}
            onCancel={
              editingEntry
                ? () => {
                    setEditingEntry(null)
                    setTab('all')
                  }
                : undefined
            }
          />
        )}
        {tab === 'review' && <ReviewDeck vocab={vocab} />}
      </main>
    </div>
  )
}
