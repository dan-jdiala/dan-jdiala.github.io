import { skills } from '../data/site'
import { Section } from './Section'

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <dl className="skills">
        {skills.map((group) => (
          <div key={group.label} className="skills__row">
            <dt className="label">{group.label}</dt>
            <dd>{group.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
