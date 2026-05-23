import { useParams, useNavigate } from 'react-router-dom'
import { SkyReading } from '../components/SkyReading'
import { useJournal } from '../hooks/useJournal'

export function EntryPage() {
  const { id } = useParams<{ id: string }>()
  const { getById } = useJournal()
  const navigate = useNavigate()

  const entry = id ? getById(id) : undefined

  if (!entry) {
    return (
      <div className="text-center py-20 px-7">
        <p className="font-serif text-xl italic text-charcoal/40 mb-4">Sky not found.</p>
        <button className="btn-ghost" onClick={() => navigate('/journal')}>
          Back to journal
        </button>
      </div>
    )
  }

  return (
    <SkyReading
      entry={entry}
      onSave={() => {}}
      onNewSky={() => navigate('/upload')}
      saved={true}
    />
  )
}
