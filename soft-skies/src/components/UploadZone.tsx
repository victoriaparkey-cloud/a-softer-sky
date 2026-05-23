import { useRef, useState, useCallback } from 'react'

interface UploadZoneProps {
  onFile: (file: File) => void
}

export function UploadZone({ onFile }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    onFile(file)
  }, [onFile])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="max-w-lg mx-auto px-7 py-16 text-center">
      <h1 className="font-sans text-4xl font-normal tracking-tight leading-tight mb-3">
        a softer sky
      </h1>

      <p className="text-sm text-muted font-light leading-relaxed mb-10 max-w-xs mx-auto">
        Upload a photograph of a sky — sunrise, sunset, golden hour, stormy afternoon — and we will extract its colour palette.
      </p>

      <div
        className={`drop-zone p-16 text-center transition-all duration-200 ${isDragging ? 'active' : ''}`}
        style={{ borderRadius: 2 }}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="w-9 h-9 mx-auto mb-4 flex items-center justify-center border border-black/10 rounded-full bg-white">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="#8A8682" className="w-4 h-4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V8m0 0l-3 3m3-3l3 3" />
            <rect x="3" y="3" width="18" height="18" rx="3" />
          </svg>
        </div>
        <p className="text-sm text-charcoal/60 mb-1">Drop your sky here</p>
        <p className="label-caps text-[10px]">or tap to browse — jpg, png, heic</p>
      </div>
    </div>
  )
}
