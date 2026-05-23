import { useState, useCallback } from 'react'
import type { SkyEntry } from '../lib/types'
import { extractPalette } from '../lib/colours'
import { extractExifMeta } from '../lib/exif'

export type ProcessStatus = 'idle' | 'extracting' | 'done' | 'error'

export interface ProcessState {
  status: ProcessStatus
  previewUrl: string | null
  entry: SkyEntry | null
  error: string | null
}

export function useSkyProcessor() {
  const [state, setState] = useState<ProcessState>({
    status: 'idle',
    previewUrl: null,
    entry: null,
    error: null,
  })

  const process = useCallback(async (file: File): Promise<void> => {
    const previewUrl = URL.createObjectURL(file)
    setState({ status: 'extracting', previewUrl, entry: null, error: null })

    try {
      // Run palette extraction and EXIF reading in parallel
      const [palette, exifMeta] = await Promise.all([
        extractPalette(file),
        extractExifMeta(file),
      ])

      const now = new Date().toISOString()

      const entry: SkyEntry = {
        id: crypto.randomUUID(),
        photoUrl: previewUrl,
        palette,
        location: exifMeta.location,
        capturedAt: exifMeta.capturedAt ?? now,
        createdAt: now,
      }

      setState({ status: 'done', previewUrl, entry, error: null })
    } catch (err) {
      setState(s => ({
        ...s,
        status: 'error',
        error: err instanceof Error ? err.message : 'Something went wrong',
      }))
    }
  }, [])

  const reset = useCallback(() => {
    setState({ status: 'idle', previewUrl: null, entry: null, error: null })
  }, [])

  return { state, process, reset }
}
