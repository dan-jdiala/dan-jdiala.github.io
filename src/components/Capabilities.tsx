import { skills } from '../data/site'
import { stagger } from '../lib/style'
import { Section } from './Section'

export function Capabilities() {
  return (
    <Section id="capabilities" index="04 · Capabilities" title="Skills" subtitle="Languages, frameworks, and tools used in the projects above">
      <div className="capabilities">
        {skills.map((group, i) => (
          <div key={group.label} className="cap-group panel rv" style={stagger(i + 1)}>
            <h3 className="cap-group__label mono">{group.label}</h3>
            <ul className="cap-group__items">
              {group.items.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
