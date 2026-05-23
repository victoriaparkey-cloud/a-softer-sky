import { NavLink } from 'react-router-dom'

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-black/[0.06]">
      <div className="flex items-center justify-between px-7 py-5">
        {/* Wordmark */}
        <NavLink
          to="/"
          className="font-serif text-lg tracking-tight text-charcoal no-underline"
        >
          soft <em className="italic text-muted not-italic" style={{ fontStyle: 'italic' }}>skies</em>
        </NavLink>

        {/* Nav links */}
        <div className="flex gap-6">
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `label-caps transition-colors duration-200 no-underline ${
                isActive ? 'text-charcoal' : 'text-muted hover:text-charcoal'
              }`
            }
          >
            new sky
          </NavLink>
          <NavLink
            to="/journal"
            className={({ isActive }) =>
              `label-caps transition-colors duration-200 no-underline ${
                isActive ? 'text-charcoal' : 'text-muted hover:text-charcoal'
              }`
            }
          >
            journal
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
