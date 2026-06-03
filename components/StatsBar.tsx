interface StatsBarProps {
  total: number
  mastered: number
  learning: number
  contributors: number
}

export default function StatsBar({ total, mastered, learning, contributors }: StatsBarProps) {
  const stats = [
    { value: total, label: 'Total Words' },
    { value: mastered, label: 'Mastered' },
    { value: learning, label: 'Still Learning' },
    { value: contributors, label: 'Contributors' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(({ value, label }) => (
        <div
          key={label}
          className="bg-mid rounded-[18px] px-4 py-4 text-center"
          style={{ border: '1px solid rgba(201,168,76,0.15)' }}
        >
          <div className="font-display text-3xl font-extrabold text-gold">{value}</div>
          <div
            className="text-gold-l text-[10px] font-semibold uppercase mt-1"
            style={{ letterSpacing: '0.12em' }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
