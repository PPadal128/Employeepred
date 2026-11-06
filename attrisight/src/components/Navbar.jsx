import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
const links = [['Platform', '#platform'], ['Predict', '#predict'], ['Bulk', '#bulk'], ['History', '#history'], ['Learn', '#learn'], ['About', '#about']]
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`nav ${solid || open ? 'nav--solid' : ''}`}>
      <div className="wrap nav__row">
        <a href="#top" className="logo" onClick={() => setOpen(false)}>AttriSight</a>
        <nav className="nav__links" aria-label="Primary">{links.map(([l, h]) => <a key={h} href={h}>{l}</a>)}</nav>
        <a href="#predict" className="btn btn--lime nav__cta">Predict churn</a>
        <button className="nav__toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="nav__mobile" aria-label="Mobile">
          {links.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
          <a href="#predict" className="btn btn--lime" onClick={() => setOpen(false)}>Predict churn</a>
        </nav>
      )}
    </header>
  )
}
