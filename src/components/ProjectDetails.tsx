import type { SystemProject } from '../data/site'
import { ArrowUpRightIcon } from './Icons'
import { NewTab } from './NewTab'

// "How it's built": the full facts, numbers and stack behind a project card, one click away.
export function ProjectDetails({ project, tone = 'plain' }: { project: SystemProject; tone?: 'plain' | 'light' }) {
  return (
    <details className={`details details--${tone}`}>
      <summary>How it&rsquo;s built</summary>
      <ul className="details__facts">
        {project.facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
      {project.stats && <p className="details__stats">{project.stats.map((s) => `${s.value} ${s.label}`).join(' · ')}</p>}
      <p className="details__stack">
        <span className="details__label">Built with</span> {project.stack.join(', ')}
      </p>
      {project.note && <p className="details__note">{project.note}</p>}
      {project.links.length > 0 && (
        <p className="details__links">
          {project.links.map((link) => (
            <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noreferrer">
              {link.label} <ArrowUpRightIcon />
              <NewTab />
            </a>
          ))}
        </p>
      )}
    </details>
  )
}
