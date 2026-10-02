import { systems, type SystemProject, type SystemStatus } from '../data/site'
import { stagger } from '../lib/style'
import { ArrowUpRightIcon, LockIcon } from './Icons'
import { Section } from './Section'

const statusLabel: Record<SystemStatus, string> = {
  live: 'Live',
  active: 'Active development',
  'open-source': 'Open source',
}

export function Systems() {
  return (
    <Section id="systems" index="02" title="Systems" subtitle="Projects in production, in research, and in progress">
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
      className={`system panel rv${project.flagship ? ' system--flagship' : ''}`}
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

        {project.flagship && <FlagshipReadout />}
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
              <span className="visually-hidden"> (opens in a new tab)</span>
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

// Pulse-Net's at-a-glance numbers, styled like a node status board.
function FlagshipReadout() {
  const nodes = ['NA', 'EU', 'APAC', 'AFR', 'SA']
  const stats = [
    { value: '5', label: 'hospital nodes' },
    { value: '16', label: 'pathogen classes' },
    { value: 'ε 1.0', label: 'privacy budget' },
    { value: '1,500+', label: 'tests in CI' },
  ]

  return (
    <div className="flagship" aria-label="Pulse-Net at a glance">
      <div className="flagship__nodes" aria-hidden="true">
        {nodes.map((node, i) => (
          <span key={node} className="node" style={stagger(i)}>
            <span className="node__dot" />
            <span className="mono">{node}</span>
          </span>
        ))}
        <span className="node node--hub">
          <span className="node__dot" />
          <span className="mono">COORDINATOR</span>
        </span>
      </div>
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
