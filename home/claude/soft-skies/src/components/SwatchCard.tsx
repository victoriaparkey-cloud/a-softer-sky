import { useState } from 'react'
import type { Swatch } from '../lib/types'
import { isLightColour } from '../lib/colours'

interface SwatchCardProps {
  swatch: Swatch
  size?: 'sm' | 'md' | 'lg'
}

export function SwatchCard({ swatch, size = 'md' }: SwatchCardProps) {
  const [copied, setCopied] = useState(false)

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  }

  async function copyHex() {
    try {
      await navigator.clipboard.writeText(swatch.hex)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard not available
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Colour block */}
      <button
        onClick={copyHex}
        className={`${sizeClasses[size]} border border-black/[0.06] cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95`}
        style={{ background: swatch.hex, borderRadius: 2 }}
        title={`Copy ${swatch.hex}`}
        aria-label={`Copy colour ${swatch.hex}`}
      >
        {copied && (
          <span
            className="flex items-center justify-center w-full h-full text-xs font-sans"
            style={{ color: isLightColour(swatch.hex) ? '#1C1C1E' : '#FAF7F2', opacity: 0.7 }}
          >
            ✓
          </span>
        )}
      </button>

      {/* Colour name */}
      {swatch.name && (
        <span className="text-[10px] text-muted leading-snug max-w-[56px]">
          {swatch.name}
        </span>
      )}

      {/* Hex value */}
      <span className="font-mono text-[9px] text-muted/60 uppercase">
        {swatch.hex}
      </span>
    </div>
  )
}
