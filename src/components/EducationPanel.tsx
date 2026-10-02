import { education } from '../data/site'
import { stagger } from '../lib/style'
import { Section } from './Section'

export function EducationPanel() {
  return (
    <Section id="education" index="05 · Education" title="Education" subtitle="Undergraduate, Class of 2029">
      <div className="edu panel rv" style={stagger(1)}>
        <div className="edu__main">
          <h3 className="edu__school">{education.school}</h3>
          <p className="edu__degree">{education.degree}</p>
          <p className="edu__meta mono">
            {education.location} · {education.expected}
          </p>
        </div>
        <div className="edu__gpa">
          <span className="edu__gpa-label mono">GPA</span>
          <span className="edu__gpa-value">{education.gpa}</span>
        </div>
        <div className="edu__lists">
          <div>
            <h4 className="edu__list-label mono">Honors</h4>
            <ul className="edu__honors">
              {education.honors.map((honor) => (
                <li key={honor}>{honor}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="edu__list-label mono">Coursework</h4>
            <ul className="cap-group__items">
              {education.coursework.map((course) => (
                <li key={course} className="chip">
                  {course}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}
