import { profile } from '../data/site'
import { DownloadIcon } from './Icons'

const nav = [
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__name" href="#top">
          DJ Diala<span className="visually-hidden"> (Daniel-John Diala), back to top</span>
        </a>
        <nav className="site-nav" aria-label="Sections">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        {/* Resume stays one tap away while scrolling, on every screen size. */}
        <a className="btn btn--ink header-resume" href={profile.resume} download>
          <DownloadIcon /> Resume
        </a>
      </div>
    </header>
  )
}
