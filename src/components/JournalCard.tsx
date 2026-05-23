import { useNavigate } from 'react-router-dom'
import type { SkyEntry } from '../lib/types'
import { PaletteStrip } from './PaletteStrip'

interface JournalCardProps {
  entry: SkyEntry
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toUpperCase()
}

export function JournalCard({ entry }: JournalCardProps) {
  const navigate = useNavigate()

  return (
    <article
      className="cursor-pointer group"
      onClick={() => navigate(`/entry/${entry.id}`)}
    >
      {/* Photo */}
      <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={entry.photoThumbUrl ?? entry.photoUrl}
          alt={entry.location?.label ?? formatDate(entry.capturedAt)}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {/* Thin palette strip */}
      <PaletteStrip swatches={entry.palette} height="h-0.5" />

      {/* Metadata */}
      <div className="px-3.5 py-3">
        <h3 className="font-serif text-sm font-normal tracking-tight mb-0.5">
          {entry.location?.label ?? formatDate(entry.capturedAt)}
        </h3>
        {entry.location?.label && (
          <p className="label-caps text-[9px]">
            {formatDate(entry.capturedAt)}
          </p>
        )}
      </div>
    </article>
  )
}
