import { useState } from 'react'
import { moreProjects, systems, type SystemProject, type SystemStatus } from '../data/site'
import { ArrowUpRightIcon } from './Icons'
import { NewTab } from './NewTab'
import { Recording } from './Recording'
import { Section } from './Section'

const statusLabel: Record<SystemStatus, string> = {
  live: 'Live',
  active: 'In progress',
  'open-source': 'Open source',
}

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="projects">
        {systems.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </div>
      {moreProjects.length > 0 && <MoreProjects />}
    </Section>
  )
}

const PHONE_FACTS = 2

function Project({ project }: { project: SystemProject }) {
  const titleId = `project-${project.id}`
  const [expanded, setExpanded] = useState(false)
  const extra = project.facts.length - PHONE_FACTS
  const meta = [statusLabel[project.status], ...project.tags, project.period]

  return (
    <article className="project" aria-labelledby={titleId}>
      <h3 className="project__name" id={titleId}>
        {project.name}
      </h3>
      <p className="project__meta">{meta.join(' · ')}</p>
      <p className="project__subtitle">{project.subtitle}</p>

      {project.screenshot && (
        <figure className="project__shot">
          <img
            src={project.screenshot.src}
            alt={project.screenshot.alt}
            width={project.screenshot.width}
            height={project.screenshot.height}
            loading="lazy"
            decoding="async"
          />
        </figure>
      )}
      {project.media && <Recording media={project.media} />}
      {project.id === 'pulse-net' && <PulseNetFlow />}

      <ul className={`project__facts${expanded ? ' is-expanded' : ''}`} id={`${titleId}-facts`}>
        {project.facts.map((fact, i) => (
          <li key={fact} className={i >= PHONE_FACTS ? 'fact--extra' : undefined}>
            {fact}
          </li>
        ))}
      </ul>
      {extra > 0 && (
        <button
          type="button"
          className="facts-toggle"
          aria-expanded={expanded}
          aria-controls={`${titleId}-facts`}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? 'Show less' : `Show ${extra} more`}
        </button>
      )}

      {project.stats && (
        <p className="project__stats">{project.stats.map((stat) => `${stat.value} ${stat.label}`).join(' · ')}</p>
      )}
      <p className="project__stack">
        <span className="label">Built with</span> {project.stack.join(', ')}
      </p>

      {(project.links.length > 0 || project.note) && (
        <div className="project__links">
          {project.links.map((link) => (
            <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noreferrer">
              {link.label} <ArrowUpRightIcon />
              <NewTab />
            </a>
          ))}
          {project.note && <span className="project__note">{project.note}</span>}
        </div>
      )}
    </article>
  )
}

// Pulse-Net's data flow: what moves between the three parts of the system.
const flow = [
  { name: 'Hospital edge nodes', detail: 'Train locally with PyTorch; patient data stays on site.', link: 'signed, private model updates' },
  {
    name: 'FastAPI coordinator',
    detail: 'Verifies and median-aggregates updates, ingests clinical reports and CDC/NCBI feeds, stores state in PostgreSQL.',
    link: 'hotspots and alerts',
  },
  { name: 'React dashboard', detail: 'Outbreak map and alerts.' },
]

function PulseNetFlow() {
  return (
    <figure className="flow">
      <figcaption className="label">How it fits together</figcaption>
      <ol className="flow__steps">
        {flow.map((step) => (
          <li key={step.name} className="flow__step">
            <strong>{step.name}.</strong> {step.detail}
            {step.link && (
              <span className="flow__link">
                <span aria-hidden="true">↓ </span>
                <span className="visually-hidden">Sends </span>
                {step.link}
              </span>
            )}
          </li>
        ))}
      </ol>
    </figure>
  )
}

// Smaller and course projects, linked to the code.
function MoreProjects() {
  return (
    <div className="more">
      <h3 className="more__title">Smaller projects</h3>
      <ul className="more__list">
        {moreProjects.map((project) => (
          <li key={project.name} className="more__item">
            <p className="more__head">
              <strong>{project.name}</strong> <span className="more__context">({project.context})</span>
            </p>
            <p className="more__desc">{project.description}</p>
            <p className="more__foot">
              <span className="label">Built with</span> {project.stack.join(', ')} ·{' '}
              <a className="text-link" href={project.link.href} target="_blank" rel="noreferrer">
                {project.link.label} <ArrowUpRightIcon />
                <span className="visually-hidden"> for {project.name}</span>
                <NewTab />
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
