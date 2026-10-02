import { events, type LogEvent } from '../data/site'
import { stagger } from '../lib/style'
import { Section } from './Section'

const kindLabel: Record<LogEvent['kind'], string> = {
  role: 'Role',
  cert: 'Certification',
  competition: 'Competition',
  leadership: 'Leadership',
  club: 'Club',
}

export function EventLog() {
  return (
    <Section id="log" index="03" title="Event log" subtitle="Experience, certifications, and activities, newest first">
      <ol className="log">
        {events.map((event, i) => (
          <li key={event.id} className={`log__entry rv log__entry--${event.kind}`} style={stagger(i + 1)}>
            <time className="log__stamp mono" dateTime={event.stamp}>
              {event.stamp}
            </time>
            <span className="log__marker" aria-hidden="true" />
            <div className="log__card panel">
              <EntryBody event={event} defaultOpen={event.kind === 'role'} />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function EntryBody({ event, defaultOpen }: { event: LogEvent; defaultOpen: boolean }) {
  const header = (
    <>
      <span className="log__kind mono">{kindLabel[event.kind]}</span>
      <span className="log__title">{event.title}</span>
      <span className="log__org">
        {event.org}
        {event.period && <span className="log__period mono"> · {event.period}</span>}
      </span>
    </>
  )

  if (event.bullets.length === 0) {
    return <div className="log__summary log__summary--static">{header}</div>
  }

  return (
    <details open={defaultOpen}>
      <summary className="log__summary">
        {header}
        <span className="log__toggle mono" aria-hidden="true" />
      </summary>
      <ul className="log__bullets">
        {event.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </details>
  )
}
