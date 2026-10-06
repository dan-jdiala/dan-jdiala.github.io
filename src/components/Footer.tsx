import { profile } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import { stagger } from '../lib/style'
import { GitHubIcon, LinkedInIcon, MailIcon, DownloadIcon } from './Icons'
import { NewTab } from './NewTab'

const year = new Date().getFullYear()

export function Footer() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2)

  return (
    <footer className="footer container" id="contact" aria-labelledby="contact-title">
      <div ref={ref} className={`footer__inner reveal${visible ? ' is-visible' : ''}`}>
        <p className="section-index" style={stagger(0)} aria-hidden="true">
          06 · Open a channel
        </p>
        <h2 className="footer__title" id="contact-title" style={stagger(1)}>
          <span className="visually-hidden">Contact: </span>
          Hiring or interested in building with me? <em>Let’s talk.</em>
        </h2>
        <div className="footer__links" style={stagger(2)}>
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            <MailIcon /> Email me
          </a>
          <a className="btn" href={profile.links.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon /> LinkedIn
            <NewTab />
          </a>
          <a className="btn" href={profile.links.github} target="_blank" rel="noreferrer">
            <GitHubIcon /> GitHub
            <NewTab />
          </a>
          <a className="btn" href={profile.resume} download>
            <DownloadIcon /> Resume (PDF)
          </a>
        </div>
        <p className="footer__fine mono" style={stagger(3)}>
          © {year} {profile.name}
        </p>
      </div>
    </footer>
  )
}
