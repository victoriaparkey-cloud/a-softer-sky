import { useRef } from 'react'
import type { SkyEntry } from '../lib/types'

interface ShareCardProps {
  entry: SkyEntry
  onBack: () => void
}

export function ShareCard({ entry, onBack }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  async function downloadCard() {
    // In production: use html2canvas or a Supabase Edge Function
    // to render a proper 1080×1080 PNG
    try {
      const { default: html2canvas } = await import('html2canvas')
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1C1C1E',
      })
      const link = document.createElement('a')
      link.download = `${entry.title.replace(/\s+/g, '-').toLowerCase()}-soft-skies.jpg`
      link.href = canvas.toDataURL('image/jpeg', 0.92)
      link.click()
    } catch {
      alert('Download not available in this environment — try deploying to Vercel.')
    }
  }

  return (
    <div className="page-enter max-w-lg mx-auto px-7 py-12">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-normal tracking-tight mb-2">Share this sky</h2>
        <p className="text-sm text-muted font-light leading-relaxed">
          A card sized for Instagram, Pinterest, or wherever you share beautiful things.
        </p>
      </div>

      {/* Card preview */}
      <div
        ref={cardRef}
        className="bg-moonstone overflow-hidden mb-7"
        style={{ borderRadius: 2, aspectRatio: '1/1', maxWidth: 380, margin: '0 auto 28px' }}
      >
        {/* Photo */}
        <img
          src={entry.photoUrl}
          alt={entry.title}
          className="w-full object-cover block"
          style={{ height: '75%' }}
          crossOrigin="anonymous"
        />

        {/* Palette strip */}
        <div className="flex" style={{ height: 5 }}>
          {entry.palette.map((sw, i) => (
            <span key={i} className="flex-1" style={{ background: sw.hex }} />
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ height: '25%', boxSizing: 'border-box' }}
        >
          <div>
            <p className="font-serif text-sm text-white/85 mb-1.5">{entry.title}</p>
            <div className="flex gap-1">
              {entry.palette.slice(0, 5).map((sw, i) => (
                <span
                  key={i}
                  style={{ width: 12, height: 12, borderRadius: '50%', background: sw.hex, display: 'inline-block' }}
                />
              ))}
            </div>
          </div>
          <span className="font-serif text-xs italic" style={{ color: 'rgba(255,255,255,0.35)' }}>
            soft skies
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button className="btn-primary" onClick={downloadCard}>
          Download card
        </button>
        <button className="btn-ghost" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  )
}
