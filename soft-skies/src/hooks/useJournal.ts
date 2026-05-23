import { useState, useEffect, useCallback } from 'react'
import type { SkyEntry } from '../lib/types'
import { supabase, uploadPhoto } from '../lib/supabase'

const LOCAL_KEY = 'soft-skies-journal'

/**
 * useJournal — manages the user's sky journal.
 *
 * Strategy: local-first.
 * - Reads and writes to localStorage immediately (fast, offline-capable)
 * - If Supabase is configured and the user is logged in, syncs in the background
 *
 * This means the app works fully without Supabase during development.
 */
export function useJournal() {
  const [entries, setEntries] = useState<SkyEntry[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY)
      return raw ? (JSON.parse(raw) as SkyEntry[]) : []
    } catch {
      return []
    }
  })

  // Keep localStorage in sync whenever entries change
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(entries))
  }, [entries])

  const save = useCallback(async (entry: SkyEntry, photoFile?: File): Promise<void> => {
    let finalEntry = { ...entry }

    // If we have a file and Supabase is configured, upload the photo
    if (photoFile && import.meta.env.VITE_SUPABASE_URL) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const url = await uploadPhoto(photoFile, user.id)
          finalEntry = { ...finalEntry, photoUrl: url, userId: user.id }

          // Save to Supabase
          await supabase.from('sky_entries').insert({
            id: finalEntry.id,
            user_id: user.id,
            photo_url: finalEntry.photoUrl,
            photo_thumb_url: finalEntry.photoThumbUrl ?? null,
            palette: finalEntry.palette,
            location: finalEntry.location ?? null,
            weather: finalEntry.weather ?? null,
            captured_at: finalEntry.capturedAt,
          })
        }
      } catch (err) {
        console.warn('[soft-skies] Supabase sync failed, saved locally only:', err)
      }
    }

    setEntries(prev => {
      const existing = prev.findIndex(e => e.id === finalEntry.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = finalEntry
        return updated
      }
      return [finalEntry, ...prev]
    })
  }, [])

  const remove = useCallback(async (id: string): Promise<void> => {
    setEntries(prev => prev.filter(e => e.id !== id))

    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        await supabase.from('sky_entries').delete().eq('id', id)
      } catch (err) {
        console.warn('[soft-skies] Could not delete from Supabase:', err)
      }
    }
  }, [])

  const getById = useCallback((id: string): SkyEntry | undefined => {
    return entries.find(e => e.id === id)
  }, [entries])

  return { entries, save, remove, getById }
}
