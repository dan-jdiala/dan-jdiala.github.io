import { education } from '../data/site'
import { Section } from './Section'

export function Education() {
  return (
    <Section id="education" title="Education">
      <div className="entry">
        <div className="entry__head">
          <h3 className="entry__title">{education.school}</h3>
          <span className="entry__period">{education.expected}</span>
        </div>
        <p className="entry__org">
          {education.degree} · GPA {education.gpa} · {education.location}
        </p>
        <ul className="entry__bullets">
          <li>{education.honors.join('; ')}</li>
          <li>Coursework: {education.coursework.join(', ')}</li>
        </ul>
      </div>
    </Section>
  )
}
