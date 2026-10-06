import { profile } from '../data/site'
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons'
import { NewTab } from './NewTab'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer container" id="contact" aria-labelledby="contact-title">
      <h2 className="section-title" id="contact-title">
        Contact
      </h2>
      <p className="footer__text">
        Email me at{' '}
        <a className="text-link" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        , or find me on LinkedIn and GitHub.
      </p>
      <div className="footer__links">
        <a className="btn btn--primary" href={profile.resume} download>
          <DownloadIcon /> Resume (PDF)
        </a>
        <a className="btn" href={`mailto:${profile.email}`}>
          <MailIcon /> Email
        </a>
        <a className="btn" href={profile.links.linkedin} target="_blank" rel="noreferrer">
          <LinkedInIcon /> LinkedIn
          <NewTab />
        </a>
        <a className="btn" href={profile.links.github} target="_blank" rel="noreferrer">
          <GitHubIcon /> GitHub
          <NewTab />
        </a>
      </div>
      <p className="footer__fine">
        © {year} {profile.name}
      </p>
    </footer>
  )
}
