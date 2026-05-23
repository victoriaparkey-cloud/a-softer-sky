import { useState, useRef, useCallback } from 'react'
import type { SkyEntry } from '../lib/types'
import { isLightColour } from '../lib/colours'

interface SkyReadingProps {
  entry: SkyEntry
  onNewSky: () => void
}

function parseDateLabel(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  }
}

export function SkyReading({ entry, onNewSky }: SkyReadingProps) {
  const defaults = parseDateLabel(entry.capturedAt)
  const [location, setLocation] = useState(entry.location?.label ?? '')
  const [date, setDate] = useState(defaults.date)
  const [time, setTime] = useState(defaults.time)
  const [swatchCount, setSwatchCount] = useState(Math.min(entry.palette.length, 5))
  const [downloading, setDownloading] = useState(false)
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const metaLines = [location, date, time].filter(Boolean)
  const visibleSwatches = entry.palette.slice(0, swatchCount)

  async function copyHex(hex: string) {
    try {
      await navigator.clipboard.writeText(hex)
      setCopiedHex(hex)
      setTimeout(() => setCopiedHex(null), 1400)
    } catch {}
  }

  const download = useCallback(async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      const dataUrl = canvas.toDataURL('image/jpeg', 0.93)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile) {
        const win = window.open()
        if (win) {
          win.document.write('<img src="' + dataUrl + '" style="width:100%;max-width:100%">')
          win.document.title = 'long press to save'
        }
      } else {
        const link = document.createElement('a')
        const slug = (location || 'sky').replace(/\s+/g, '-').toLowerCase()
        link.download = slug + '-a-softer-sky.jpg'
        link.href = dataUrl
        link.click()
      }
    } catch {
      alert('Download failed — try right-clicking the card to save the image.')
    } finally {
      setDownloading(false)
    }
  }, [location, cardRef])

  return (
    <div className="page-enter max-w-2xl mx-auto px-7 pb-20 pt-8">
      <div
        ref={cardRef}
        className="flex overflow-hidden bg-white"
        style={{ border: '0.5px solid rgba(28,28,30,0.12)', borderRadius: 3 }}
      >
        <div className="relative" style={{ flex: '0 0 62%', background: '#111' }}>
          <img
            src={entry.photoUrl}
            alt="sky"
            crossOrigin="anonymous"
            className="w-full h-full object-cover block"
            style={{ minHeight: 280 }}
          />
          {metaLines.length > 0 && (
            <div
              className="absolute top-3.5 left-3.5"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 12,
                fontWeight: 300,
                lineHeight: 1.65,
                letterSpacing: '0.02em',
                color: 'rgba(255,255,255,0.88)',
                whiteSpace: 'pre',
                textShadow: '0 1px 3px rgba(0,0,0,0.45)',
              }}
            >
              {metaLines.join('\n')}
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              right: 14,
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 11,
              fontWeight: 300,
              letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.65)',
              textShadow: '0 1px 3px rgba(0,0,0,0.45)',
            }}
          >
            @a_softer_sky
          </div>
        </div>
        <div className="flex flex-col" style={{ flex: '0 0 38%' }}>
          {visibleSwatches.map((sw, i) => (
            <button
              key={i}
              onClick={() => copyHex(sw.hex)}
              className="flex-1 flex items-end px-2.5 pb-1.5 group"
              style={{ background: sw.hex, border: 'none', cursor: 'pointer' }}
              title={'Copy ' + sw.hex}
            >
              <span
                className="text-[9px] font-mono font-light tracking-wider opacity-0 group-hover:opacity-60 transition-opacity duration-150"
                style={{ color: isLightColour(sw.hex) ? '#000' : '#fff' }}
              >
                {copiedHex === sw.hex ? 'copied' : sw.hex.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4 mt-6">
        <div className="flex flex-col gap-1">
          <label className="label-caps text-[10px]">Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Joshua Tree, USA"
            className="input text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="label-caps text-[10px]">Date</label>
          <input
            type="text"
            value={date}
            onChange={e => setDate(e.target.value)}
            placeholder="28 Sept 2023"
            className="input text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="label-caps text-[10px]">Time</label>
          <input
            type="text"
            value={time}
            onChange={e => setTime(e.target.value)}
            placeholder="06:19"
            className="input text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="label-caps text-[10px]">Swatches ({entry.palette.length} found)</label>
          <input
            type="number"
            min={3}
            max={entry.palette.length}
            value={swatchCount}
            onChange={e => setSwatchCount(Math.min(Math.max(parseInt(e.target.value) || 3, 3), entry.palette.length))}
            className="input text-sm"
          />
        </div>
      </div>

      <div className="flex gap-3 flex-wrap mt-6">
        <button
          className="btn-primary"
          onClick={download}
          disabled={downloading}
          style={{ opacity: downloading ? 0.6 : 1 }}
        >
          {downloading ? 'Preparing...' : 'Download card'}
        </button>
        <button className="btn-ghost" onClick={onNewSky}>
          New sky
        </button>
      </div>
    </div>
  )
}
