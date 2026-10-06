import { profile } from '../data/site'
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons'
import { NewTab } from './NewTab'

export function Hero() {
  return (
    <section className="hero container" id="top" aria-labelledby="hero-name">
      <div className="hero__id">
        <img
          className="hero__photo"
          src="/media/headshot.jpg"
          width={96}
          height={96}
          alt={`Photo of ${profile.name}`}
          decoding="async"
        />
        <div>
          <h1 className="hero__name" id="hero-name">
            {profile.name}
          </h1>
          <p className="hero__role">{profile.role}</p>
        </div>
      </div>

      {profile.summary.map((paragraph) => (
        <p className="hero__summary" key={paragraph}>
          {paragraph}
        </p>
      ))}

      <div className="hero__actions">
        <a className="btn btn--primary" href={profile.resume} download>
          <DownloadIcon /> Download resume (PDF)
        </a>
        <a className="btn" href={`mailto:${profile.email}`}>
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
      </div>
    </section>
  )
}
