import { events } from '../data/site'
import { Section } from './Section'

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="entries">
        {events.map((event) => (
          <li key={event.id} className="entry">
            <div className="entry__head">
              <h3 className="entry__title">{event.title}</h3>
              {event.period && <span className="entry__period">{event.period}</span>}
            </div>
            <p className="entry__org">{event.org}</p>
            {event.bullets.length > 0 && (
              <ul className="entry__bullets">
                {event.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </Section>
  )
}
