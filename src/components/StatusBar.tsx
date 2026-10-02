import { profile } from '../data/site'
import { useClock } from '../hooks/useClock'
import { boot } from '../lib/style'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons'

const nav = [
  { href: '#systems', label: 'Systems' },
  { href: '#log', label: 'Log' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#education', label: 'Education' },
]

export function StatusBar() {
  const time = useClock()

  return (
    <header className="status-bar boot" style={boot(0)}>
      <div className="container status-bar__inner">
        <a className="monogram" href="#top" aria-label={`${profile.name}, back to top`}>
          DJD
        </a>

        <p className="status-chip">
          <span className="dot" aria-hidden="true" />
          <span className="status-chip__label">Status</span>
          <span className="status-chip__text">{profile.status}</span>
        </p>

        <nav className="status-nav" aria-label="Sections">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="status-tools">
          <span className="clock mono" aria-label={`Eastern Time ${time}`}>
            <span className="clock__zone">ET</span> {time}
          </span>
          <a className="icon-link" href={`mailto:${profile.email}`} aria-label="Email">
            <MailIcon />
          </a>
          <a className="icon-link" href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <a className="icon-link" href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitHubIcon />
          </a>
        </div>
      </div>
    </header>
  )
}
