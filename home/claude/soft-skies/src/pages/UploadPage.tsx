import { useState } from 'react'
import { UploadZone } from '../components/UploadZone'
import { LoadingState } from '../components/LoadingState'
import { SkyReading } from '../components/SkyReading'
import { useSkyProcessor } from '../hooks/useSkyProcessor'
import { useJournal } from '../hooks/useJournal'

export function UploadPage() {
  const { state, process, reset } = useSkyProcessor()
  const { save } = useJournal()
  const [saved, setSaved] = useState(false)

  async function handleFile(file: File) {
    setSaved(false)
    await process(file)
  }

  async function handleDemo() {
    const canvas = document.createElement('canvas')
    canvas.width = 1200; canvas.height = 675
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 0, 675)
    grad.addColorStop(0, '#1a1a2e')
    grad.addColorStop(0.35, '#e8502a')
    grad.addColorStop(0.6, '#f4a25a')
    grad.addColorStop(0.8, '#fad49a')
    grad.addColorStop(1, '#fde8c4')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1200, 675)
    ctx.globalAlpha = 0.1
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.ellipse(500, 200, 260, 60, -0.1, 0, Math.PI * 2); ctx.fill()

    canvas.toBlob(async blob => {
      if (!blob) return
      const file = new File([blob], 'demo-sunset.jpg', { type: 'image/jpeg' })
      await handleFile(file)
    }, 'image/jpeg', 0.92)
  }

  async function handleSave() {
    if (!state.entry) return
    await save(state.entry)
    setSaved(true)
  }

  if (state.status === 'extracting') {
    return <LoadingState previewUrl={state.previewUrl} status="extracting" />
  }

  if (state.status === 'done' && state.entry) {
    return (
      <SkyReading
        entry={state.entry}
        onSave={handleSave}
        onNewSky={reset}
        saved={saved}
      />
    )
  }

  return (
    <UploadZone
      onFile={handleFile}
      onDemo={handleDemo}
    />
  )
}
