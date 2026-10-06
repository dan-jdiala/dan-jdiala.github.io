import { education, profile } from '../data/site'
import { boot } from '../lib/style'
import { DownloadIcon, MailIcon } from './Icons'

const readout = [
  { key: 'Education', value: `${education.school} · ’29` },
  { key: 'Focus', value: 'ML systems · Data · Web' },
  { key: 'Certified', value: 'Claude Certified Architect' },
]

// Decorative early-warning trace: a baseline that drifts, then spikes past the threshold.
const trace =
  'M0 70 L20 68 L40 71 L60 66 L80 69 L100 64 L120 67 L140 62 L160 65 L180 58 L200 61 L220 52 L240 55 L260 44 L280 38 L300 24 L320 30 L340 16'

export function Hero() {
  const [first, last] = splitName(profile.name)

  return (
    <section className="hero container" id="top" aria-labelledby="hero-name">
      <div className="hero__main">
        <div className="hero__id boot" style={boot(1)}>
          <img
            className="hero__photo"
            src="/media/headshot.jpg"
            width={88}
            height={88}
            alt={`Photo of ${profile.name}`}
            decoding="async"
          />
          <p className="eyebrow mono">
            <span className="eyebrow__index">01</span> Operator profile
          </p>
        </div>
        <h1 className="hero__name boot" id="hero-name" style={boot(2)}>
          {first}
          <br />
          <em>{last}</em>
        </h1>
        <p className="hero__role mono boot" style={boot(3)}>
          {profile.role}
        </p>
        <p className="hero__summary boot" style={boot(4)}>
          {profile.summary}
        </p>
        <div className="hero__actions boot" style={boot(5)}>
          <a className="btn btn--primary" href={profile.resume} download>
            <DownloadIcon /> Download resume (PDF)
          </a>
          <a className="btn" href={`mailto:${profile.email}`}>
            <MailIcon /> Email me
          </a>
        </div>
      </div>

      <div className="hero__readout panel boot" style={boot(4)} role="group" aria-label="Profile summary">
        <div className="readout__head mono">
          <span>SYS · PROFILE</span>
          <span className="readout__ok">
            <span className="dot" aria-hidden="true" /> NOMINAL
          </span>
        </div>
        <dl className="readout__list">
          {readout.map((row) => (
            <div className="readout__row" key={row.key}>
              <dt className="mono">{row.key}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <figure className="monitor" aria-hidden="true">
          <svg viewBox="0 0 340 84" preserveAspectRatio="none">
            <line className="monitor__threshold" x1="0" x2="340" y1="34" y2="34" />
            <path className="monitor__trace" d={trace} />
            <circle className="monitor__alert" cx="300" cy="24" r="4" />
          </svg>
          <figcaption className="mono">
            <span>SIGNAL MONITOR · ILLUSTRATIVE</span>
            <span className="monitor__flag">THRESHOLD CROSSED</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function splitName(name: string): [string, string] {
  const i = name.lastIndexOf(' ')
  return i === -1 ? [name, ''] : [name.slice(0, i), name.slice(i + 1)]
}
