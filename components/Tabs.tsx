import type { Tab } from '@/types'

interface TabsProps {
  active: Tab
  onChange: (tab: Tab) => void
  editMode?: boolean
}

export default function Tabs({ active, onChange, editMode }: TabsProps) {
  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'All Words' },
    { key: 'add', label: editMode ? 'Edit Word' : 'Add Word' },
    { key: 'review', label: 'Review' },
  ]

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className="px-5 py-2 rounded-[30px] text-sm font-semibold transition-all"
          style={
            active === key
              ? { backgroundColor: '#C9A84C', color: '#0D0D0D' }
              : {
                  color: '#E8D5A3',
                  border: '1px solid rgba(201,168,76,0.3)',
                  backgroundColor: 'transparent',
                }
          }
          onMouseOver={e => {
            if (active !== key) {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#C9A84C'
              ;(e.currentTarget as HTMLElement).style.color = '#C9A84C'
            }
          }}
          onMouseOut={e => {
            if (active !== key) {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'
              ;(e.currentTarget as HTMLElement).style.color = '#E8D5A3'
            }
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
