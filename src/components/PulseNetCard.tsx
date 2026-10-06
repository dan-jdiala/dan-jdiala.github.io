import { useEffect, useId, useRef, useState } from 'react'
import type { SystemProject } from '../data/site'
import { useOnScreen, useReducedMotion } from '../hooks/motion'
import { ProjectDetails } from './ProjectDetails'

// Pulse-Net's card. It runs on its own ("attract mode"): hospitals send updates to the
// coordinator, and now and then a poisoned one gets outvoted by the median. "Take control"
// turns it into a challenge. Both are simplified simulations of the real aggregation.
// No inline style attributes: the production CSP is style-src 'self'.

const HONEST = [0.42, 0.55, 0.47, 0.6, 0.5]
const AXIS_MAX = 5
const RED_ZONE = 1
const CYCLE = 2.6 // seconds per round of updates
const STILL_FRAME = 1.25 * CYCLE // a frame with a poisoned update arriving

const fmt = (v: number) => v.toFixed(2)
const median = (vs: number[]) => [...vs].sort((a, b) => a - b)[Math.floor(vs.length / 2)]
const mean = (vs: number[]) => vs.reduce((a, b) => a + b, 0) / vs.length

export function PulseNetCard({ project }: { project: SystemProject }) {
  const [mode, setMode] = useState<'watch' | 'play'>('watch')
  const [paused, setPaused] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const narrow = useNarrow()
  const reduced = useReducedMotion()
  const visible = useOnScreen(cardRef)
  const t = useClock(mode === 'watch' && !paused && !reduced && visible, STILL_FRAME)

  return (
    <article ref={cardRef} className="card pulse-card" aria-labelledby="pulse-title">
      <div className="pulse-card__top">
        <span className="pill pill--light">Try it · Pulse-Net</span>
        <span className="pulse-card__note">
          {mode === 'watch' ? 'Simulation running on its own' : 'Your turn · simplified simulation'}
        </span>
        {mode === 'watch' && !reduced && (
          <button type="button" className="btn btn--ghost-light btn--small" onClick={() => setPaused((p) => !p)}>
            {paused ? 'Play' : 'Pause'}
            <span className="visually-hidden"> the animation</span>
          </button>
        )}
      </div>
      <h3 className="pulse-card__title" id="pulse-title">
        Try to fool Pulse-Net&rsquo;s defense
      </h3>
      <p className="pulse-card__lede">
        Five hospitals train locally and send model updates. A plain average is easy to fool. Can you fool the median Pulse-Net
        actually uses?
      </p>

      {mode === 'watch' ? (
        <>
          <Scene t={t} narrow={narrow} />
          <div className="pulse-card__cta">
            <p>Every few seconds one hospital sends a poisoned update, and the median outvotes it. Now you try.</p>
            <button type="button" className="btn btn--light" onClick={() => setMode('play')}>
              Take control
            </button>
          </div>
        </>
      ) : (
        <Challenge narrow={narrow} onBack={() => setMode('watch')} />
      )}

      <ProjectDetails project={project} tone="light" />
    </article>
  )
}

function Scene({ t, narrow }: { t: number; narrow: boolean }) {
  const W = narrow ? 360 : 760
  const H = narrow ? 290 : 300
  const hx = narrow ? 34 : 70
  const cx = narrow ? 210 : 470
  const cy = H / 2 - 6
  const ax = narrow ? 304 : 650
  const hy = (i: number) => 34 + i * ((H - 80) / 4)

  const cycle = Math.floor(t / CYCLE)
  const phase = t / CYCLE - cycle
  const attacker = cycle % 2 === 1 ? Math.floor(cycle / 2) % 5 : -1
  const out = Math.min(1, Math.max(0, (phase - 0.7) / 0.28))

  return (
    <div className="live-scene">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Animation: five hospitals send updates to the coordinator; a poisoned update is outvoted by the median before alerts go out.">
        {HONEST.map((_, i) => (
          <line key={`l${i}`} className="scene__link" x1={hx} y1={hy(i)} x2={cx} y2={cy} />
        ))}
        <line className="scene__link" x1={cx} y1={cy} x2={ax} y2={cy} />
        {HONEST.map((_, i) => {
          const p = Math.min(1, Math.max(0, (phase - i * 0.06) / 0.6))
          const bad = i === attacker
          const opacity = p <= 0 ? 0 : p < 1 ? 1 : bad ? Math.max(0, 1 - (phase - 0.84) / 0.12) : 0
          return (
            <circle
              key={`p${i}`}
              className={bad ? 'scene__packet scene__packet--bad' : 'scene__packet'}
              cx={hx + (cx - 30 - hx) * p}
              cy={hy(i) + (cy - hy(i)) * p}
              r={bad ? 8 : 6}
              opacity={opacity}
            />
          )
        })}
        {HONEST.map((_, i) => (
          <g key={`h${i}`} className={i === attacker ? 'scene__node scene__node--bad' : 'scene__node'}>
            <circle cx={hx} cy={hy(i)} r={narrow ? 17 : 20} />
            <text x={hx} y={hy(i) + 4} textAnchor="middle">
              H{i + 1}
            </text>
          </g>
        ))}
        <circle className="scene__hub" cx={cx} cy={cy} r={narrow ? 32 : 40} />
        <text className="scene__hub-label" x={cx} y={cy - 2} textAnchor="middle">
          median
        </text>
        <text className="scene__hub-sub" x={cx} y={cy + 13} textAnchor="middle">
          coordinator
        </text>
        <circle className="scene__packet" cx={cx + 30 + (ax - 24 - cx - 30) * out} cy={cy} r={6} opacity={out > 0 && out < 1 ? 1 : 0} />
        <rect className="scene__alerts" x={ax - 24} y={cy - 26} width={narrow ? 52 : 62} height={52} rx={10} />
        <text className="scene__alerts-label" x={ax - 24 + (narrow ? 26 : 31)} y={cy + 4} textAnchor="middle">
          alerts
        </text>
        {attacker >= 0 && phase > 0.62 && phase < 0.95 && (
          <g className="scene__tag">
            <rect x={cx - 82} y={cy - (narrow ? 64 : 74)} width={164} height={26} rx={13} />
            <text x={cx} y={cy - (narrow ? 47 : 57)} textAnchor="middle">
              bad update outvoted
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

function Challenge({ narrow, onBack }: { narrow: boolean; onBack: () => void }) {
  const [attackers, setAttackers] = useState([false, false, false, false, false])
  const [push, setPush] = useState(3)
  const [goals, setGoals] = useState({ average: false, median: false })
  const sliderId = useId()

  const valuesFor = (a: boolean[], p: number) => HONEST.map((v, i) => (a[i] ? p : v))
  const values = valuesFor(attackers, push)
  const avg = mean(values)
  const med = median(values)
  const count = attackers.filter(Boolean).length

  // A goal stays ticked once reached, even if the visitor then backs off.
  const update = (nextAttackers: boolean[], nextPush: number) => {
    const next = valuesFor(nextAttackers, nextPush)
    setAttackers(nextAttackers)
    setPush(nextPush)
    setGoals((g) => ({ average: g.average || mean(next) >= RED_ZONE, median: g.median || median(next) >= RED_ZONE }))
  }

  const W = narrow ? 340 : 700
  const L = 16
  const R = W - 16
  const AXIS_Y = 132
  const x = (v: number) => L + (Math.min(v, AXIS_MAX) / AXIS_MAX) * (R - L)

  let verdict: string
  if (goals.average && goals.median) verdict = 'Pulse-Net holds until attackers are the majority (3 of 5). That is the point of using a median.'
  else if (count >= 3) verdict = 'Attackers now outnumber honest hospitals, so they can move even the median.'
  else if (goals.average) verdict = 'The plain average is fooled. Pulse-Net’s median still sits with the honest hospitals. How many attackers would it take?'
  else if (count === 0) verdict = 'Click a hospital to turn it into an attacker.'
  else verdict = 'Drag the strength up and watch the dashed average line.'

  return (
    <div className="challenge">
      <svg className="challenge__plot" viewBox={`0 0 ${W} ${AXIS_Y + 24}`} role="img" aria-label={`Plain average ${fmt(avg)}, Pulse-Net median ${fmt(med)}.`}>
        <rect className="challenge__zone" x={x(RED_ZONE)} y={0} width={R - x(RED_ZONE)} height={AXIS_Y} />
        <text className="challenge__zone-label" x={x(RED_ZONE) + 8} y={16}>
          RED ZONE
        </text>
        <line className="challenge__axis" x1={L} x2={R} y1={AXIS_Y} y2={AXIS_Y} />
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <text key={v} className="challenge__tick" x={x(v)} y={AXIS_Y + 18} textAnchor="middle">
            {v}
          </text>
        ))}
        <line className="challenge__median" x1={x(med)} x2={x(med)} y1={22} y2={AXIS_Y} />
        <line className="challenge__mean" x1={x(avg)} x2={x(avg)} y1={22} y2={AXIS_Y} />
        {values.map((v, i) => (
          <circle key={i} className={attackers[i] ? 'challenge__dot challenge__dot--bad' : 'challenge__dot'} cx={x(v)} cy={34 + i * 21} r={attackers[i] ? 8 : 6.5} />
        ))}
      </svg>

      <div className="demo-controls">
        <div className="challenge__toggles" role="group" aria-label="Choose attackers">
          {attackers.map((on, i) => (
            <button
              key={i}
              type="button"
              className="challenge__toggle"
              aria-pressed={on}
              onClick={() => update(attackers.map((was, j) => (j === i ? !was : was)), push)}
            >
              H{i + 1}
              <span className="visually-hidden"> (hospital {i + 1})</span>
              {on && <span className="challenge__tag"> attacker</span>}
            </button>
          ))}
        </div>
        <label className="challenge__slider" htmlFor={sliderId}>
          <span>Strength</span>
          <input id={sliderId} type="range" min={1} max={AXIS_MAX} step={0.1} value={push} onChange={(e) => update(attackers, Number(e.target.value))} />
        </label>
        <button type="button" className="btn btn--ghost-light btn--small" onClick={onBack}>
          Watch demo
        </button>
      </div>

      <div className="challenge__goals">
        <p className={goals.average ? 'goal goal--done' : 'goal'}>
          <span aria-hidden="true">{goals.average ? '✓' : '○'}</span> Fool a plain average · {fmt(avg)}
          <span className="visually-hidden">{goals.average ? ' (done)' : ' (not yet)'}</span>
        </p>
        <p className={goals.median ? 'goal goal--done' : 'goal'}>
          <span aria-hidden="true">{goals.median ? '✓' : '○'}</span> Fool Pulse-Net&rsquo;s median · {fmt(med)}
          <span className="visually-hidden">{goals.median ? ' (done)' : ' (not yet)'}</span>
        </p>
      </div>
      <p className="challenge__verdict" aria-live="polite">
        {verdict}
      </p>
    </div>
  )
}

// Seconds since start while running; holds a fixed frame otherwise. Server render uses that frame.
function useClock(running: boolean, still: number) {
  const [t, setT] = useState(still)
  useEffect(() => {
    if (!running) return
    let frame = 0
    let last = performance.now()
    let acc = 0
    const tick = (now: number) => {
      acc += (now - last) / 1000
      last = now
      // About 30 updates a second is plenty for a few moving dots.
      if (acc >= 1 / 30) {
        setT((v) => v + acc)
        acc = 0
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running])
  return t
}

// Server render and first paint use the wide layout; phones switch after hydration.
function useNarrow() {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 600px)')
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return narrow
}
