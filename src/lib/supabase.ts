import { createClient } from '@supabase/supabase-js'
import type { SkyRow } from './types'

// ── These come from your .env file ─────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[soft-skies] Supabase env vars not set. ' +
    'Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. ' +
    'The app will run in local-only mode until then.'
  )
}

// Typed Supabase client. The generic tells it what our DB looks like.
export const supabase = createClient<{ sky_entries: { Row: SkyRow } }>(
  SUPABASE_URL ?? 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY ?? 'placeholder'
)

// ── Storage helpers ────────────────────────────────────────────────────────

const BUCKET = 'sky-photos'

/**
 * Upload a sky photo file to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadPhoto(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: '3600',
  })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Delete a photo from Supabase Storage by its public URL.
 */
export async function deletePhoto(publicUrl: string): Promise<void> {
  // Extract the path from the URL
  const path = publicUrl.split(`${BUCKET}/`)[1]
  if (!path) return
  await supabase.storage.from(BUCKET).remove([path])
}
