import { events, type LogEvent } from '../data/site'
import { stagger } from '../lib/style'
import { Section } from './Section'

const kindLabel: Record<LogEvent['kind'], string> = {
  role: 'Role',
  cert: 'Certification',
  competition: 'Competition',
  leadership: 'Leadership',
}

export function EventLog() {
  return (
    <Section id="log" index="03 · Event log" title="Experience" subtitle="Roles, certifications, and activities, newest first">
      <ol className="log">
        {events.map((event, i) => (
          <li key={event.id} className={`log__entry rv log__entry--${event.kind}`} style={stagger(i + 1)}>
            <time className="log__stamp mono" dateTime={event.stamp}>
              {event.stamp}
            </time>
            <span className="log__marker" aria-hidden="true" />
            <div className="log__card panel">
              <EntryBody event={event} />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function EntryHeader({ event }: { event: LogEvent }) {
  return (
    <>
      <span className="log__kind mono">{kindLabel[event.kind]}</span>
      <h3 className="log__title">{event.title}</h3>
      <span className="log__org">
        {event.org}
        {event.period && <span className="log__period mono"> · {event.period}</span>}
      </span>
    </>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="log__bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

// Entries with several bullets are expandable (roles start open); short entries show everything.
function EntryBody({ event }: { event: LogEvent }) {
  if (event.bullets.length <= 1) {
    return (
      <>
        <div className="log__summary log__summary--static">
          <EntryHeader event={event} />
        </div>
        {event.bullets.length === 1 && <Bullets items={event.bullets} />}
      </>
    )
  }

  return (
    <details open={event.kind === 'role'}>
      <summary className="log__summary">
        <EntryHeader event={event} />
        <span className="log__toggle mono" aria-hidden="true" />
      </summary>
      <Bullets items={event.bullets} />
    </details>
  )
}
