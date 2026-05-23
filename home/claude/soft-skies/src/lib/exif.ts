import type { SkyLocation } from './types'

export interface ExifMeta {
  capturedAt?: string       // ISO date string
  location?: SkyLocation
}

/**
 * Extract date/time and GPS location from a photo file's EXIF data.
 * Falls back gracefully — if no EXIF, returns file.lastModified date.
 */
export async function extractExifMeta(file: File): Promise<ExifMeta> {
  const result: ExifMeta = {}

  // Default: use file's last modified time
  result.capturedAt = new Date(file.lastModified).toISOString()

  try {
    // Dynamically load ExifReader so it doesn't bloat the initial bundle
    const ExifReader = await import('https://cdn.jsdelivr.net/npm/exifreader@4.14.1/dist/exif-reader.esm.min.js')

    const buffer = await file.arrayBuffer()
    const tags = ExifReader.load(buffer, { expanded: true })

    const exif = (tags as Record<string, Record<string, { description: string }>>).exif ?? {}
    const gps  = (tags as Record<string, Record<string, number>>).gps ?? {}

    // Date + time from EXIF
    const dateStr = exif.DateTimeOriginal?.description ?? exif.DateTime?.description
    if (dateStr) {
      const [datePart, timePart] = dateStr.split(' ')
      if (datePart) {
        const [y, m, d] = datePart.split(':').map(Number)
        const [hh, mm, ss] = (timePart ?? '00:00:00').split(':').map(Number)
        result.capturedAt = new Date(y, m - 1, d, hh, mm, ss).toISOString()
      }
    }

    // GPS → reverse geocode
    const lat = gps.Latitude as unknown as number
    const lng = gps.Longitude as unknown as number
    if (typeof lat === 'number' && typeof lng === 'number') {
      const label = await reverseGeocode(lat, lng)
      if (label) {
        result.location = { lat, lng, label }
      }
    }
  } catch {
    // EXIF unavailable or parse error — use defaults
  }

  return result
}

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    const addr = data.address ?? {}
    const parts = [
      addr.city ?? addr.town ?? addr.village ?? addr.county,
      addr.country,
    ].filter(Boolean)
    return parts.length ? parts.join(', ') : null
  } catch {
    return null
  }
}
