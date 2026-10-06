import { education, profile } from '../data/site'
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons'
import { NewTab } from './NewTab'

// The first screen: who, what I want, and the resume, readable in a few seconds.
export function Hero() {
  const [first, last] = splitName(profile.name)

  return (
    <section className="container bento hero" id="top" aria-labelledby="hero-name">
      {/* Flat children so phones can move the buttons above the summary. */}
      <div className="card hero-card">
        <div className="hero-card__id">
          <img className="hero-card__photo" src="/media/headshot.jpg" width={64} height={64} alt="" decoding="async" />
          <p className="hero-card__eyebrow mono">Software engineering · {education.school} · Class of 2029</p>
        </div>
        <h1 className="hero-card__name" id="hero-name">
          {first}
          <br />
          {last}
        </h1>
        {profile.summary.map((paragraph) => (
          <p className="hero-card__summary" key={paragraph}>
            {paragraph}
          </p>
        ))}
        <div className="hero-card__actions">
          <a className="btn btn--red" href={profile.resume} download>
            <DownloadIcon /> Download resume
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
      </div>

      <div className="card photo-card">
        <img src="/media/headshot.jpg" width={400} height={400} alt={`Photo of ${profile.name}`} decoding="async" />
      </div>

      <div className="card seeking-card">
        <p className="seeking-card__label mono">Looking for</p>
        <p className="seeking-card__text">{profile.seeking.replace(/\.$/, '')}</p>
      </div>

      <div className="card stat-card stat-card--night">
        <p className="stat-card__value">4.0</p>
        <p className="stat-card__label">GPA · Honors School</p>
      </div>
      <div className="card stat-card">
        <p className="stat-card__value">Top 4%</p>
        <p className="stat-card__label">National Cyber League team, 127 of 3,638</p>
      </div>
    </section>
  )
}

function splitName(name: string): [string, string] {
  const i = name.lastIndexOf(' ')
  return i === -1 ? [name, ''] : [name.slice(0, i), name.slice(i + 1)]
}
