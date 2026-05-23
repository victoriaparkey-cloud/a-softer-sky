import Vibrant from 'node-vibrant'
import type { Swatch } from './types'

/**
 * Extract a palette of 5–7 dominant colours from an image file.
 * Returns swatches sorted by visual impact (population).
 */
export async function extractPalette(source: File | string): Promise<Swatch[]> {
  const builder = Vibrant.from(source instanceof File ? await fileToImageEl(source) : source)
    .quality(3)
    .maxColorCount(64)

  const palette = await builder.getPalette()

  // Vibrant gives us 6 named swatches. We want the richest selection.
  const ordered = [
    palette.Vibrant,
    palette.LightVibrant,
    palette.DarkVibrant,
    palette.Muted,
    palette.LightMuted,
    palette.DarkMuted,
  ]

  const swatches: Swatch[] = ordered
    .filter((sw): sw is NonNullable<typeof sw> => sw !== null && sw !== undefined)
    .map(sw => ({
      hex: sw.hex,
      name: '',           // filled in by Claude
      population: sw.population,
    }))
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    .slice(0, 7)

  // Guarantee at least 5 swatches (pad with muted fallbacks if needed)
  while (swatches.length < 5) {
    swatches.push({ hex: '#C8B8A2', name: '', population: 0 })
  }

  return swatches
}

/**
 * Convert a File to an HTMLImageElement the browser can render.
 * Needed because Vibrant.js in the browser can accept an img element.
 */
function fileToImageEl(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load image'))
    }
    img.src = url
  })
}

/**
 * Generate a CSS linear-gradient string from a palette, for backgrounds.
 * Goes left-to-right across the dominant colours.
 */
export function paletteToGradient(swatches: Swatch[]): string {
  if (swatches.length === 0) return 'linear-gradient(to right, #FAF7F2, #E8D5C0)'
  const stops = swatches.map((sw, i) => {
    const pct = Math.round((i / (swatches.length - 1)) * 100)
    return `${sw.hex} ${pct}%`
  })
  return `linear-gradient(to right, ${stops.join(', ')})`
}

/**
 * Determine whether a hex colour is "light" or "dark"
 * so we can pick legible text on top of it.
 */
export function isLightColour(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  // Perceived luminance (WCAG formula)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55
}
