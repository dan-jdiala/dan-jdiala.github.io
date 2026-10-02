import { skills } from '../data/site'
import { stagger } from '../lib/style'
import { Section } from './Section'

export function Capabilities() {
  return (
    <Section id="capabilities" index="04" title="Capabilities" subtitle="Languages, frameworks, and tools used in the systems above">
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
        <div className="cap-cert panel rv" style={stagger(skills.length + 1)}>
          <span className="cap-cert__seal mono" aria-hidden="true">
            CCA-F
          </span>
          <div>
            <h3 className="cap-cert__title">Claude Certified Architect – Foundations</h3>
            <p className="cap-cert__meta mono">Anthropic · Jul 2026 – Present</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
