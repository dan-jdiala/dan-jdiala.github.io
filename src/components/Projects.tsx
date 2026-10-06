import { moreProjects, systems, type SystemProject } from '../data/site'
import { ArrowUpRightIcon } from './Icons'
import { NewTab } from './NewTab'
import { ProjectDetails } from './ProjectDetails'
import { PulseNetCard } from './PulseNetCard'
import { SentimentCard } from './SentimentCard'

const byId = (id: string) => systems.find((p) => p.id === id)

export function Projects() {
  const pulse = byId('pulse-net')
  const sentiment = byId('sentiment')
  const shots = systems.filter((p) => p.screenshot)

  return (
    <section className="container section" id="projects" aria-labelledby="projects-title">
      <div className="section__head">
        <h2 className="section__title" id="projects-title">
          Projects
        </h2>
        <p className="section__sub">Two of them you can play with right here.</p>
      </div>
      <div className="bento projects">
        {pulse && <PulseNetCard project={pulse} />}
        {sentiment && <SentimentCard project={sentiment} />}
        {shots.map((project) => (
          <ShotCard key={project.id} project={project} />
        ))}
        {moreProjects.length > 0 && <MoreProjects />}
      </div>
    </section>
  )
}

// A live web app: a screenshot, what it is, and a link to try it.
function ShotCard({ project }: { project: SystemProject }) {
  const shot = project.screenshot!
  const live = project.links[0]
  return (
    <article className="card shot-card" aria-labelledby={`shot-${project.id}`}>
      <img className="shot-card__img" src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
      <div className="shot-card__body">
        <p className="shot-card__meta mono">
          {project.status === 'live' ? 'Live' : project.status} · {[...project.tags, project.period].join(' · ')}
        </p>
        <h3 className="shot-card__name" id={`shot-${project.id}`}>
          {project.name}
        </h3>
        <p className="shot-card__text">{project.subtitle}</p>
        {live && (
          <a className="text-link" href={live.href} target="_blank" rel="noreferrer">
            {live.label} <ArrowUpRightIcon />
            <NewTab />
          </a>
        )}
        <ProjectDetails project={project} />
      </div>
    </article>
  )
}

function MoreProjects() {
  return (
    <article className="card more-card" aria-labelledby="more-title">
      <h3 className="more-card__title" id="more-title">
        Smaller projects
      </h3>
      <ul className="more-card__list">
        {moreProjects.map((project) => (
          <li key={project.name}>
            <p className="more-card__name">
              {project.name} <span className="more-card__context">· {project.context}</span>
            </p>
            <p className="more-card__desc">{project.description}</p>
            <p className="more-card__foot">
              <span className="mono">{project.stack.join(' · ')}</span>
              <a className="text-link" href={project.link.href} target="_blank" rel="noreferrer">
                {project.link.label} <ArrowUpRightIcon />
                <span className="visually-hidden"> for {project.name}</span>
                <NewTab />
              </a>
            </p>
          </li>
        ))}
      </ul>
    </article>
  )
}
