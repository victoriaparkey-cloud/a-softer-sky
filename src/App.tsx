import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Nav } from './components/Nav'
import { UploadPage } from './pages/UploadPage'

function VisitorCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('https://api.countapi.xyz/hit/a-softer-sky.com/visits')
      .then(r => r.json())
      .then(d => setCount(d.value))
      .catch(() => setCount(null))
  }, [])

  if (count === null) return null

  return (
    <span
      className="text-xs text-muted"
      style={{ fontFamily: '"DM Mono", monospace', fontWeight: 300 }}
    >
      {count.toLocaleString()} skies so far
    </span>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>
        <footer className="border-t border-black/[0.06] px-7 py-6 flex items-center justify-between">
          <span className="text-xs text-muted font-light">made by victoria parkey</span>
          <VisitorCount />
          <a href="https://instagram.com/a_softer_sky" target="_blank" rel="noopener noreferrer" className="text-xs text-muted hover:text-charcoal transition-colors duration-200 no-underline">@a_softer_sky</a>
        </footer>
      </div>
      <Analytics />
    </BrowserRouter>
  )
}