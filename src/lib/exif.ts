import type { SkyLocation } from './types'

export interface ExifMeta {
  capturedAt?: string
  location?: SkyLocation
}

export async function extractExifMeta(file: File): Promise<ExifMeta> {
  const result: ExifMeta = {}
  result.capturedAt = new Date(file.lastModified).toISOString()

  try {
    const ExifReader = await import('exifreader')
    const buffer = await file.arrayBuffer()
    const tags = ExifReader.load(buffer, { expanded: true }) as Record<string, Record<string, { description: string }>>

    const exif = tags.exif ?? {}
    const gps = tags.gps as unknown as Record<string, number> ?? {}

    const dateStr = exif.DateTimeOriginal?.description ?? exif.DateTime?.description
    if (dateStr) {
      const [datePart, timePart] = dateStr.split(' ')
      if (datePart) {
        const [y, m, d] = datePart.split(':').map(Number)
        const [hh, mm, ss] = (timePart ?? '00:00:00').split(':').map(Number)
        result.capturedAt = new Date(y, m - 1, d, hh, mm, ss).toISOString()
      }
    }

    const lat = gps.Latitude
    const lng = gps.Longitude
    if (typeof lat === 'number' && typeof lng === 'number') {
      const label = await reverseGeocode(lat, lng)
      if (label) result.location = { lat, lng, label }
    }
  } catch {
    // fall back to file date
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
    const parts = [addr.city ?? addr.town ?? addr.village ?? addr.county, addr.country].filter(Boolean)
    return parts.length ? parts.join(', ') : null
  } catch {
    return null
  }
}
