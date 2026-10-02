import { telemetry, type Telemetry } from '../data/site'
import { useCountUp } from '../hooks/useCountUp'
import { boot } from '../lib/style'

export function TelemetryTiles() {
  return (
    <section className="container telemetry boot" style={boot(6)} aria-label="Key numbers">
      <ul className="telemetry__grid">
        {telemetry.map((item, i) => (
          <Tile key={item.id} item={item} index={i} />
        ))}
      </ul>
    </section>
  )
}

function Tile({ item, index }: { item: Telemetry; index: number }) {
  const value = useCountUp(item.value, true, 1500, 900 + index * 120)
  const decimals = item.decimals ?? 0
  const shown = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  const final = item.value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <li className="tile panel">
      <span className="tile__label mono">
        T-{String(index + 1).padStart(2, '0')} · {item.label}
      </span>
      <span className="tile__value" aria-hidden="true">
        {item.prefix && <span className="tile__affix">{item.prefix}</span>}
        {shown}
        {item.suffix && <span className="tile__affix">{item.suffix}</span>}
      </span>
      <span className="visually-hidden">
        {item.prefix}
        {final}
        {item.suffix} {item.label}
      </span>
      <span className="tile__detail">{item.detail}</span>
    </li>
  )
}
