import { telemetry } from '../data/site'
import { boot } from '../lib/style'

export function TelemetryTiles() {
  return (
    <section className="container telemetry boot" style={boot(6)} aria-label="Key numbers">
      <ul className="telemetry__grid">
        {telemetry.map((item, i) => (
          <li key={item.id} className="tile panel">
            <span className="tile__label mono" aria-hidden="true">
              T-{String(i + 1).padStart(2, '0')} · {item.label}
            </span>
            <span className="tile__value">
              {item.value}
              <span className="visually-hidden"> {item.label}</span>
            </span>
            <span className="tile__detail">{item.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
