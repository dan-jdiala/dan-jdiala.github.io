import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { SystemProject } from '../data/site'
import { useOnScreen, useReducedMotion } from '../hooks/motion'
import { analyze, type Label, type Lexicon } from '../lib/sentiment'
import { ProjectDetails } from './ProjectDetails'

// The sentiment card types reviews on its own, scoring them live with a browser port of my
// tool's rules and its full lexicon. "Type your own" hands the box to the visitor.

const DEMO_REVIEWS = [
  "Love the sleek design and the battery lasts all day, but the service was rude and it's overpriced.",
  'Honestly not bad at all. Setup was easy and support was super helpful.',
  'Terrible app. It crashed twice and the update made it even slower.',
]

const PRESETS = [
  { label: 'Rave', text: 'Absolutely beautiful screen and very fast performance. Best purchase this year!' },
  { label: 'Complaint', text: 'The interface is confusing and the support team never answered.' },
  { label: 'Mixed', text: 'Great price, but the shipping was slow and the box was damaged.' },
  { label: 'Not bad at all', text: 'Honestly not bad at all. Setup was easy and support was super helpful.' },
]

const TYPE_MS = 45
const HOLD_TICKS = 70 // pause on a finished review before the next one

const SPANS = DEMO_REVIEWS.map((r) => r.length + HOLD_TICKS)
const CYCLE_TICKS = SPANS.reduce((a, b) => a + b, 0)

// Which review is showing and how many of its characters are typed, for a tick count.
function position(tick: number): [number, number] {
  let rest = tick
  for (let i = 0; i < SPANS.length; i++) {
    if (rest < SPANS[i]) return [i, rest]
    rest -= SPANS[i]
  }
  return [0, 0]
}

const LABEL_TEXT: Record<Label, string> = { POSITIVE: 'Positive', NEGATIVE: 'Negative', NEUTRAL: 'Neutral', MIXED: 'Mixed' }

export function SentimentCard({ project }: { project: SystemProject }) {
  const [mode, setMode] = useState<'watch' | 'type'>('watch')
  const [paused, setPaused] = useState(false)
  // One counter drives the typing: it walks through every review plus a hold after each.
  // It starts at the end of the first review so the server render shows a finished example.
  const [tick, setTick] = useState(DEMO_REVIEWS[0].length)
  const [userText, setUserText] = useState('')
  const [lexicon, setLexicon] = useState<Lexicon | null>(null)
  const cardRef = useRef<HTMLElement>(null)
  const inputId = useId()
  const visible = useOnScreen(cardRef)
  const reduced = useReducedMotion()

  // The 6,800-word lexicon (about 25 KB compressed) loads after the page settles, or as soon
  // as the card comes on screen, whichever is first.
  const [wantLexicon, setWantLexicon] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setWantLexicon(true), 2500)
    return () => window.clearTimeout(timer)
  }, [])
  useEffect(() => {
    if (!(visible || wantLexicon) || lexicon) return
    import('../data/lexicon.json').then((m) => setLexicon(m.default as Lexicon)).catch(() => {})
  }, [visible, wantLexicon, lexicon])

  const running = mode === 'watch' && !paused && !reduced && visible
  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setTick((n) => (n + 1) % CYCLE_TICKS), TYPE_MS)
    return () => window.clearInterval(timer)
  }, [running])
  const [review, typed] = position(tick)

  const text = mode === 'watch' ? DEMO_REVIEWS[review].slice(0, typed) : userText
  const result = useMemo(() => (lexicon ? analyze(text, lexicon) : null), [text, lexicon])
  const total = result ? result.pos + result.neg : 0

  return (
    <article ref={cardRef} className="card sentiment-card" aria-labelledby="sentiment-title">
      <div className="sentiment-card__top">
        <span className="pill pill--ink">Try it · Sentiment</span>
        {mode === 'watch' && !reduced && (
          <button type="button" className="btn btn--small" onClick={() => setPaused((p) => !p)}>
            {paused ? 'Play' : 'Pause'}
            <span className="visually-hidden"> the typing animation</span>
          </button>
        )}
      </div>
      <h3 className="sentiment-card__title" id="sentiment-title">
        Write a review. Watch it get scored.
      </h3>

      {mode === 'watch' ? (
        <>
          <p className="review-box">
            <Highlighted text={text} scored={result?.scored} />
            <span className="review-box__caret" aria-hidden="true" />
          </p>
          <button
            type="button"
            className="btn btn--red"
            onClick={() => {
              setMode('type')
              setUserText('')
            }}
          >
            Type your own review
          </button>
        </>
      ) : (
        <>
          <label className="sentiment-card__label" htmlFor={inputId}>
            Your review
          </label>
          <textarea
            id={inputId}
            className="review-input"
            rows={3}
            value={userText}
            placeholder="e.g. The screen is gorgeous but shipping was slow"
            onChange={(e) => setUserText(e.target.value)}
            autoFocus
          />
          <div className="presets" role="group" aria-label="Example reviews">
            {PRESETS.map((p) => (
              <button key={p.label} type="button" className="preset" onClick={() => setUserText(p.text)}>
                {p.label}
              </button>
            ))}
          </div>
          {userText && (
            <p className="review-box review-box--echo">
              <Highlighted text={userText} scored={result?.scored} />
            </p>
          )}
          <button type="button" className="btn btn--small sentiment-card__back" onClick={() => setMode('watch')}>
            Watch it type again
          </button>
        </>
      )}

      <div className="result" aria-live="polite">
        <div className="result__head">
          <span className={`result__label result__label--${(result?.label ?? 'NEUTRAL').toLowerCase()}`}>
            {result ? LABEL_TEXT[result.label] : 'Loading…'}
          </span>
          {result && result.label !== 'NEUTRAL' && (
            <span className="result__conf mono">{Math.round(result.confidence * 100)}% confident</span>
          )}
        </div>
        <svg className="result__bar" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
          <rect className="result__track" x={0} y={0} width={100} height={8} rx={4} />
          {total > 0 && result && (
            <>
              <rect className="result__pos" x={0} y={0} width={(result.pos / total) * 100} height={8} />
              <rect className="result__neg" x={(result.pos / total) * 100} y={0} width={(result.neg / total) * 100} height={8} />
            </>
          )}
        </svg>
        <ul className="result__aspects" aria-label="Aspects">
          {result?.aspects
            .filter((a) => a.sentiment !== 'NEUTRAL')
            .map((a) => (
              <li key={a.name} className={a.sentiment === 'POSITIVE' ? 'aspect aspect--pos' : 'aspect aspect--neg'}>
                {a.name} {a.sentiment === 'POSITIVE' ? '+' : '−'}
                <span className="visually-hidden">{a.sentiment === 'POSITIVE' ? ' positive' : ' negative'}</span>
              </li>
            ))}
        </ul>
      </div>
      <p className="sentiment-card__fine">
        A browser port of my tool&rsquo;s rules with the same 6,800-word lexicon (no spaCy or domain weights).
      </p>

      <ProjectDetails project={project} />
    </article>
  )
}

// The text with each word the lexicon scored tinted green or red.
function Highlighted({ text, scored }: { text: string; scored?: Record<string, number> }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, i) => {
        const key = part.toLowerCase().replace(/[^a-z'-]/g, '')
        const p = scored?.[key] ?? 0
        if (!p) return <span key={i}>{part}</span>
        return (
          <mark key={i} className={p > 0 ? 'hl hl--pos' : 'hl hl--neg'}>
            {part}
          </mark>
        )
      })}
    </>
  )
}
