// ── Core domain types ──────────────────────────────────────────────────────

export interface Swatch {
  hex: string
  name: string
  population?: number
}

export interface SkyEntry {
  id: string
  photoUrl: string        // Supabase storage URL (or base64 for local draft)
  photoThumbUrl?: string  // Smaller thumbnail for grid
  palette: Swatch[]
  location?: SkyLocation
  weather?: WeatherMeta
  capturedAt: string      // ISO date string
  createdAt: string       // ISO date string (when saved to journal)
  userId?: string
}

export interface SkyLocation {
  lat: number
  lng: number
  label: string           // e.g. "Portland, Oregon"
}

export interface WeatherMeta {
  condition: string       // e.g. "partly cloudy"
  tempC?: number
  description?: string
}

// ── App state ───────────────────────────────────────────────────────────────

export type AppScreen = 'upload' | 'loading' | 'reading' | 'journal' | 'share'

export interface UploadState {
  file: File | null
  previewUrl: string | null
  status: 'idle' | 'extracting' | 'generating' | 'done' | 'error'
  error?: string
}

// ── Supabase DB row (mirrors your table schema) ─────────────────────────────

export interface SkyRow {
  id: string
  user_id: string
  photo_url: string
  photo_thumb_url: string | null
  palette: Swatch[]
  location: SkyLocation | null
  weather: WeatherMeta | null
  captured_at: string
  created_at: string
}

// ── Utility ─────────────────────────────────────────────────────────────────

export function rowToEntry(row: SkyRow): SkyEntry {
  return {
    id: row.id,
    photoUrl: row.photo_url,
    photoThumbUrl: row.photo_thumb_url ?? undefined,
    palette: row.palette,
    location: row.location ?? undefined,
    weather: row.weather ?? undefined,
    capturedAt: row.captured_at,
    createdAt: row.created_at,
    userId: row.user_id,
  }
}
