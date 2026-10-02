import { profile } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import { stagger } from '../lib/style'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons'

const year = new Date().getFullYear()

export function Footer() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2)

  return (
    <footer className="footer container" id="contact" aria-labelledby="contact-title">
      <div ref={ref} className={`footer__inner reveal${visible ? ' is-visible' : ''}`}>
        <p className="section-index" style={stagger(0)}>
          06 · Open a channel
        </p>
        <h2 className="footer__title" id="contact-title" style={stagger(1)}>
          Let’s build something <em>real.</em>
        </h2>
        <div className="footer__links" style={stagger(2)}>
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            <MailIcon /> Email me
          </a>
          <a className="btn" href={profile.links.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon /> LinkedIn
          </a>
          <a className="btn" href={profile.links.github} target="_blank" rel="noreferrer">
            <GitHubIcon /> GitHub
          </a>
        </div>
        <p className="footer__fine mono" style={stagger(3)}>
          © {year} {profile.name} · Built with React + TypeScript · Hosted on GitHub Pages
        </p>
      </div>
    </footer>
  )
}
