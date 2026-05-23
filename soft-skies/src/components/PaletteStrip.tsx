import type { Swatch } from '../lib/types'

interface PaletteStripProps {
  swatches: Swatch[]
  height?: string   // Tailwind height class, e.g. 'h-1.5' or 'h-1'
  className?: string
}

export function PaletteStrip({ swatches, height = 'h-1.5', className = '' }: PaletteStripProps) {
  return (
    <div className={`flex overflow-hidden ${height} ${className}`}>
      {swatches.map((sw, i) => (
        <span key={i} className="flex-1" style={{ background: sw.hex }} />
      ))}
    </div>
  )
}
