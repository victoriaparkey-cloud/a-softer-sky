import { NavLink } from 'react-router-dom'

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-black/[0.06]">
      <div className="flex items-center justify-between px-7 py-5">
        <NavLink to="/" className="font-sans text-lg tracking-tight text-charcoal no-underline">
          a softer sky
        </NavLink>
      </div>
    </nav>
  )
}
