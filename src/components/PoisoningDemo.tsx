import { useEffect, useId, useState } from 'react'

// Interactive simplification of Pulse-Net's aggregation: one number stands in for each
// hospital's model update. Visitors mark hospitals as attackers and compare the plain
// average with the median the coordinator actually uses.
// No inline style attributes: the production CSP is style-src 'self'.

const HONEST = [0.42, 0.55, 0.47, 0.6, 0.5]
const AXIS_MAX = 5
const HONEST_LOW = Math.min(...HONEST)
const HONEST_HIGH = Math.max(...HONEST)
const HONEST_MEAN = HONEST.reduce((a, b) => a + b, 0) / HONEST.length

// SVG layout (viewBox units). Phones get a narrower viewBox so the text isn't scaled down.
const WIDE = 640
const NARROW = 360
const LEFT = 24
const LANE_TOP = 34
const LANE_GAP = 17
const AXIS_Y = LANE_TOP + LANE_GAP * 4 + 22
const H = AXIS_Y + 26

const fmt = (v: number) => v.toFixed(2)

function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

export function PoisoningDemo() {
  const [attackers, setAttackers] = useState<boolean[]>([false, false, false, false, true])
  const [push, setPush] = useState(3)
  const sliderId = useId()
  const W = useNarrow() ? NARROW : WIDE
  const right = W - 20
  const x = (v: number) => LEFT + (Math.min(v, AXIS_MAX) / AXIS_MAX) * (right - LEFT)

  const values = HONEST.map((v, i) => (attackers[i] ? push : v))
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const med = median(values)
  const count = attackers.filter(Boolean).length

  const toggle = (i: number) => setAttackers((a) => a.map((on, j) => (j === i ? !on : on)))

  let verdict: string
  if (count === 0) {
    verdict = 'No attackers: the average and the median both sit with the hospitals.'
  } else if (count < 3) {
    verdict = `The average moves from ${fmt(HONEST_MEAN)} to ${fmt(mean)}, toward the attacker${count > 1 ? 's' : ''}. The median stays with the honest hospitals.`
  } else {
    verdict = `${count} of 5 hospitals are attackers, so they're the majority and even the median follows them. The median only holds while attackers are a minority.`
  }

  // Keep the two marker labels from overlapping: the one further right reads to the right.
  const meanRight = mean >= med

  return (
    <figure className="demo">
      <figcaption>
        <span className="demo__title">Try it: poison the model</span>
        <span className="demo__lede">
          Each hospital sends an update. Turn some into attackers and watch what a plain average does compared with the
          median Pulse-Net uses.
        </span>
      </figcaption>

      <svg className="demo__plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Average ${fmt(mean)}, median ${fmt(med)}.`}>
        <rect className="demo__band" x={x(HONEST_LOW) - 6} y={LANE_TOP - 10} width={x(HONEST_HIGH) - x(HONEST_LOW) + 12} height={LANE_GAP * 4 + 20} rx={4} />

        <line className="demo__axis" x1={LEFT} x2={right} y1={AXIS_Y} y2={AXIS_Y} />
        {[0, 1, 2, 3, 4, 5].map((t) => (
          <g key={t}>
            <line className="demo__axis" x1={x(t)} x2={x(t)} y1={AXIS_Y} y2={AXIS_Y + 5} />
            <text className="demo__tick" x={x(t)} y={AXIS_Y + 19} textAnchor="middle">
              {t}
            </text>
          </g>
        ))}

        <line className="demo__mean" x1={x(mean)} x2={x(mean)} y1={18} y2={AXIS_Y} />
        <text className="demo__mean-label" x={x(mean) + (meanRight ? 6 : -6)} y={14} textAnchor={meanRight ? 'start' : 'end'}>
          Average {fmt(mean)}
        </text>
        <line className="demo__median" x1={x(med)} x2={x(med)} y1={18} y2={AXIS_Y} />
        <text className="demo__median-label" x={x(med) + (meanRight ? -6 : 6)} y={14} textAnchor={meanRight ? 'end' : 'start'}>
          Median {fmt(med)}
        </text>

        {values.map((v, i) => {
          const cy = LANE_TOP + i * LANE_GAP
          return (
            <g key={i} className={attackers[i] ? 'demo__dot demo__dot--attacker' : 'demo__dot'}>
              <circle cx={x(v)} cy={cy} r={6} />
              <text x={x(v) + (v > AXIS_MAX - 0.6 ? -11 : 11)} y={cy + 4} textAnchor={v > AXIS_MAX - 0.6 ? 'end' : 'start'}>
                H{i + 1}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="demo__controls">
        <div className="demo__hospitals" role="group" aria-label="Choose attackers">
          {attackers.map((on, i) => (
            <button key={i} type="button" className="demo__toggle" aria-pressed={on} onClick={() => toggle(i)}>
              H{i + 1}
              <span className="visually-hidden"> (hospital {i + 1})</span>
              {on && <span className="demo__tag"> attacker</span>}
            </button>
          ))}
        </div>
        <label className="demo__slider" htmlFor={sliderId}>
          <span>Attack strength</span>
          <input
            id={sliderId}
            type="range"
            min={1}
            max={AXIS_MAX}
            step={0.1}
            value={push}
            onChange={(e) => setPush(Number(e.target.value))}
          />
        </label>
      </div>

      <p className="demo__verdict" aria-live="polite">
        {verdict}
      </p>
      <p className="demo__fine">
        Simplified simulation: one number stands in for each model update. Pulse-Net clips each update's size, then takes
        the median separately for every model weight.
      </p>
    </figure>
  )
}

// Server render and first paint use the wide layout; phones switch after hydration.
function useNarrow() {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 560px)')
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return narrow
}
