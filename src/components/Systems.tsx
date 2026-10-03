import { systems, type Stat, type SystemProject, type SystemStatus } from '../data/site'
import { stagger } from '../lib/style'
import { ArrowUpRightIcon, LockIcon } from './Icons'
import { NewTab } from './NewTab'
import { Recording } from './Recording'
import { Section } from './Section'

const statusLabel: Record<SystemStatus, string> = {
  live: 'Live',
  active: 'Active development',
  'open-source': 'Open source',
}

export function Systems() {
  return (
    <Section id="systems" index="02 · Systems" title="Projects" subtitle="Live apps, research tooling, and work in progress">
      <div className="systems__grid">
        {systems.map((project, i) => (
          <SystemPanel key={project.id} project={project} index={i} />
        ))}
      </div>
    </Section>
  )
}

function SystemPanel({ project, index }: { project: SystemProject; index: number }) {
  const titleId = `sys-${project.id}`

  return (
    <article
      className={`system panel rv${project.flagship ? ' system--flagship' : ''}${project.wide ? ' system--wide' : ''}`}
      style={stagger(index + 1)}
      aria-labelledby={titleId}
    >
      <div className="system__meta">
        <span className={`pill pill--${project.status}`}>
          <span className="dot" aria-hidden="true" />
          {statusLabel[project.status]}
        </span>
        {project.tags.map((tag) => (
          <span key={tag} className="pill pill--muted">
            {tag}
          </span>
        ))}
        <span className="system__period mono">{project.period}</span>
      </div>

      <div className="system__body">
        <div className="system__copy">
          <h3 className="system__name" id={titleId}>
            {project.name}
          </h3>
          <p className="system__subtitle">{project.subtitle}</p>
          <ul className="system__facts">
            {project.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        {project.stats && <FlagshipBoard name={project.name} stats={project.stats} />}
        {project.media && <Recording media={project.media} />}
      </div>

      <div className="system__foot">
        <ul className="system__stack" aria-label="Tech stack">
          {project.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
        <div className="system__links">
          {project.links.map((link) => (
            <a key={link.href} className="btn" href={link.href} target="_blank" rel="noreferrer">
              {link.label} <ArrowUpRightIcon />
              <NewTab />
            </a>
          ))}
          {project.note && (
            <span className="system__note mono">
              <LockIcon /> {project.note}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

// Pulse-Net's data flow: what moves between the three parts of the system.
const flow = [
  { name: 'Hospital edge nodes', detail: 'Local PyTorch training; patient data stays on site', link: 'Signed, noised updates' },
  {
    name: 'FastAPI coordinator',
    detail: 'Verifies and median-aggregates updates; ingests clinical reports and CDC/NCBI feeds; stores state in PostgreSQL',
    link: 'Hotspots and alerts',
  },
  { name: 'React dashboard', detail: 'Outbreak map and alerts' },
]

// Flagship at-a-glance: a data-flow figure plus key numbers.
function FlagshipBoard({ name, stats }: { name: string; stats: Stat[] }) {
  return (
    <div className="flagship" role="group" aria-label={`${name} at a glance`}>
      <figure className="flow">
        <ol className="flow__steps">
          {flow.map((step) => (
            <li key={step.name} className="flow__step">
              <span className="flow__box">
                <span className="flow__name">{step.name}</span>
                <span className="flow__detail">{step.detail}</span>
              </span>
              {step.link && (
                <span className="flow__link mono">
                  <span aria-hidden="true">↓ </span>
                  <span className="visually-hidden">sends </span>
                  {step.link}
                </span>
              )}
            </li>
          ))}
        </ol>
        <figcaption className="flow__caption mono">Figure 1 · {name} data flow</figcaption>
      </figure>
      <dl className="flagship__stats">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="mono">{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
