import { useNavigate } from 'react-router-dom'
import { JournalCard } from '../components/JournalCard'
import { useJournal } from '../hooks/useJournal'

export function JournalPage() {
  const { entries } = useJournal()
  const navigate = useNavigate()

  return (
    <div className="page-enter max-w-2xl mx-auto px-7 py-10 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal tracking-tight mb-1.5">
          Sky journal
        </h1>
        <p className="label-caps text-[10px]">
          {entries.length} {entries.length === 1 ? 'sky' : 'skies'} collected
        </p>
      </div>

      {/* Grid */}
      {entries.length > 0 ? (
        <div
          className="grid gap-px"
          style={{
            gridTemplateColumns: 'repeat(2, 1fr)',
            background: 'rgba(28,28,30,0.08)',
          }}
        >
          {entries.map(entry => (
            <div key={entry.id} className="bg-cream">
              <JournalCard entry={entry} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-20">
          <p className="font-serif text-xl italic text-charcoal/40 mb-3">
            Nothing here yet.
          </p>
          <p className="text-sm text-muted font-light mb-8">
            Upload your first sky to begin your journal.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/upload')}
          >
            Upload a sky
          </button>
        </div>
      )}
    </div>
  )
}
