import { profile } from '../data/site'
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons'
import { NewTab } from './NewTab'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="container footer" id="contact" aria-labelledby="contact-title">
      <div className="card contact-card">
        <h2 className="contact-card__title" id="contact-title">
          <span className="visually-hidden">Contact: </span>
          Hiring or interested in building with me? <em>Let&rsquo;s talk.</em>
        </h2>
        <p className="contact-card__text">
          I&rsquo;m looking for software, ML, or data internships for 2027. Email me at{' '}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>, or find me on LinkedIn and GitHub.
        </p>
        <div className="contact-card__links">
          <a className="btn btn--light-solid" href={`mailto:${profile.email}`}>
            <MailIcon /> Email me
          </a>
          <a className="btn btn--ghost-light" href={profile.resume} download>
            <DownloadIcon /> Resume (PDF)
          </a>
          <a className="btn btn--ghost-light" href={profile.links.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon /> LinkedIn
            <NewTab />
          </a>
          <a className="btn btn--ghost-light" href={profile.links.github} target="_blank" rel="noreferrer">
            <GitHubIcon /> GitHub
            <NewTab />
          </a>
        </div>
      </div>
      <p className="footer__fine">
        © {year} {profile.name}
      </p>
    </footer>
  )
}
