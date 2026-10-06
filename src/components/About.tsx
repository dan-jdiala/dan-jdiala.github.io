import { education, events, skills } from '../data/site'

// Experience, skills and education as three cards.
export function About() {
  return (
    <section className="container section" id="experience" aria-labelledby="experience-title">
      <div className="bento about">
        <article className="card experience-card" aria-labelledby="experience-title">
          <h2 className="card__heading" id="experience-title">
            Experience
          </h2>
          <ol className="timeline">
            {events.map((event) => (
              <li key={event.id} className="timeline__item">
                <div className="timeline__head">
                  <h3 className="timeline__title">{event.title}</h3>
                  {event.period && <span className="timeline__period mono">{event.period}</span>}
                </div>
                <p className="timeline__org">{event.org}</p>
                {event.bullets.length > 0 && (
                  <ul className="timeline__bullets">
                    {event.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </article>

        <article className="card skills-card" aria-labelledby="skills-title">
          <h2 className="card__heading" id="skills-title">
            Skills
          </h2>
          <dl className="skills">
            {skills.map((group) => (
              <div key={group.label} className="skills__group">
                <dt className="mono">{group.label}</dt>
                <dd>
                  <ul className="chips">
                    {group.items.map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="card education-card" aria-labelledby="education-title">
          <h2 className="card__heading" id="education-title">
            Education
          </h2>
          <p className="education-card__school">{education.school}</p>
          <p className="education-card__degree">
            {education.degree} · {education.expected}
          </p>
          <p className="education-card__gpa">
            <span className="mono">GPA</span> {education.gpa}
          </p>
          <ul className="education-card__list">
            {education.honors.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className="education-card__course">
            <span className="mono">Coursework</span> {education.coursework.join(', ')}
          </p>
        </article>
      </div>
    </section>
  )
}
