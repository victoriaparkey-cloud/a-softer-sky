import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Nav } from './components/Nav'
import { UploadPage } from './pages/UploadPage'

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
          <a href="https://instagram.com/a_softer_sky" target="_blank" rel="noopener noreferrer" className="text-xs text-muted hover:text-charcoal transition-colors duration-200 no-underline">@a_softer_sky</a>
        </footer>
      </div>
    </BrowserRouter>
  )
}
