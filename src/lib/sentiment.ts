// Browser port of the live scoring path in my Sentiment Analysis Tool
// (PythonProject6/src/sentiment_analyzer_improved.py, sentiment_analysis()).
// Same lexicon and rules; spaCy lemmas become simple suffix stripping, and the fuzzy
// spelling fallback and domain weights are left out.

export type Lexicon = Record<string, number>

export type Label = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED'

export type Aspect = { name: string; sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' }

export type Analysis = {
  label: Label
  confidence: number
  pos: number
  neg: number
  aspects: Aspect[]
  // Per-word lexicon points for highlighting, keyed by lowercase word.
  scored: Record<string, number>
  sarcasm: boolean
}

const CONTRACTIONS: Record<string, string> = {
  "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "won't": 'will not', "wouldn't": 'would not',
  "can't": 'cannot', "couldn't": 'could not', "shouldn't": 'should not', "haven't": 'have not', "hasn't": 'has not',
  "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not', "it's": 'it is',
  "that's": 'that is', "what's": 'what is', "who's": 'who is', "i'm": 'i am', "you're": 'you are', "he's": 'he is',
  "she's": 'she is', "we're": 'we are', "they're": 'they are', "i've": 'i have', "you've": 'you have',
  "we've": 'we have', "they've": 'they have', "i'll": 'i will', "you'll": 'you will', "he'll": 'he will',
  "she'll": 'she will', "we'll": 'we will', "they'll": 'they will', "i'd": 'i would', "you'd": 'you would',
  "he'd": 'he would', "she'd": 'she would', "we'd": 'we would', "they'd": 'they would',
}

const NEUTRAL_WORDS = new Set([
  'okay', 'fine', 'average', 'decent', 'alright', 'acceptable', 'so-so', 'middling', 'mediocre', 'unremarkable',
  'ordinary', 'standard', 'normal', 'regular', 'usual', 'typical', 'ok', 'reasonable', 'satisfactory', 'adequate',
  'sufficient', 'tolerable', 'passable', 'moderate', 'fair', 'neutral', 'indifferent', 'lukewarm', 'half-hearted',
  'pretty', 'functional', 'works', 'working', 'quality', 'shipping', 'service', 'product', 'design', 'support',
  'experience',
])

const EXPLICIT_NEUTRAL_PHRASES = [
  'okay i guess', 'not bad but not great', 'not bad but not great either', 'good but not great', 'pretty average',
  'kind of average', 'so-so', 'hit or miss', 'mixed bag', 'neither good nor bad', 'fairly standard', 'nothing special',
  'average experience', 'mixed feelings', 'nothing to rave about', "can't complain", "it's okay", "it's fine",
  'works fine', "does what it's supposed to", "it's decent", 'pretty decent', 'fairly average', "it's functional",
  'nothing exceptional',
]

const CONTRAST_WORDS = new Set(['but', 'however', 'although', 'though', 'yet', 'still', 'nonetheless'])
const MIXED_CONTRAST_PHRASES = [...CONTRAST_WORDS, 'despite', 'on the other hand', 'at the same time']

// The Python list also has "could", "should", "have" and "has", which marks phrases like
// "I have loved it" as negated. The port leaves those four out.
const NEGATORS = new Set([
  'not', 'no', 'never', "n't", 'cannot', 'won', 'nothing', 'hardly', 'barely', 'scarcely', 'without', 'neither', 'nor',
])

const DIMINISHERS = new Set([
  'somewhat', 'kind', 'a bit', 'slightly', 'fairly', 'sort of', 'moderately', 'reasonably', 'relatively', 'kinda', 'pretty',
])

const CONTEXT_INTENSIFIERS: Record<string, number> = {
  extremely: 1.35, exceptionally: 1.35, remarkably: 1.35, incredibly: 1.35, absolutely: 1.35, utterly: 1.35,
  completely: 1.35, entirely: 1.35, thoroughly: 1.35, far: 1.4, way: 1.35, very: 1.25, so: 1.25, too: 1.3,
  highly: 1.28, deeply: 1.28, strongly: 1.28, greatly: 1.28, supremely: 1.3, tremendously: 1.32, enormously: 1.32,
  awfully: 1.25, terribly: 1.25, dreadfully: 1.25, quite: 1.15, fairly: 1.2, pretty: 1.1, rather: 1.1, somewhat: 1.15,
  significantly: 1.22, noticeably: 1.2, particularly: 1.18, especially: 1.18, really: 1.12, truly: 1.12,
  genuinely: 1.12, actually: 1.08, indeed: 1.08, literally: 1.08, virtually: 1.08,
}
const BASIC_INTENSIFIERS = new Set([
  'super', 'very', 'extremely', 'incredibly', 'absolutely', 'truly', 'really', 'so', 'quite', 'exceptionally',
  'remarkably', 'particularly', 'especially', 'highly', 'deeply', 'thoroughly', 'utterly', 'completely',
])

const STOP_WORDS = new Set(['the', 'is', 'a', 'of', 'and', 'in', 'to', 'with', 'on', 'at', 'by'])

const EMOJI_SENTIMENT: Record<string, number> = {
  '😍': 3, '🥰': 3, '😂': 2, '🤣': 2, '😊': 2, '😎': 2, '👍': 2, '❤️': 3, '💕': 3, '🎉': 3, '✨': 2, '⭐': 2, '🔥': 2,
  '😡': -3, '😠': -2, '😤': -1, '💔': -3, '👎': -2, '💩': -3,
}
const EMOJI_TEXT: Record<string, string> = {
  '😍': 'love beautiful gorgeous', '🥰': 'love beautiful wonderful', '😂': 'funny hilarious', '🤣': 'funny hilarious',
  '😎': 'cool awesome', '👍': 'good positive', '❤️': 'love beautiful', '💕': 'love beautiful', '🎉': 'celebrate amazing',
  '✨': 'amazing wonderful', '⭐': 'excellent', '😡': 'angry terrible', '😠': 'angry bad', '💔': 'sad broken',
  '👎': 'bad terrible', '💩': 'terrible awful',
}

const IDIOMS: [string, number][] = [
  ['steal of a deal', 3], ['a total steal', 3], ['an absolute steal', 3], ['a steal', 2], ['killer feature', 2], ['killer features', 2],
]
const IDIOM_NEGATORS = new Set(['not', 'never', 'hardly', 'no', "isn't", "wasn't", "aren't", "weren't", 'isnt', 'wasnt'])

const ASPECTS: Record<string, string[]> = {
  quality: ['quality', 'durable', 'material', 'crafted', 'stitching', 'seam', 'build'],
  shipping: ['shipping', 'delivery', 'package', 'arrived', 'packaging', 'box', 'damaged'],
  performance: ['performance', 'speed', 'fast', 'slow', 'lag', 'crash', 'reliable', 'battery'],
  design: ['design', 'aesthetic', 'visual', 'layout', 'interface', 'ui', 'ux'],
  service: ['service', 'support', 'helpful', 'responsive', 'staff', 'customer_service'],
  value: ['price', 'expensive', 'cheap', 'affordable', 'worth', 'value'],
  experience: ['experience', 'visit', 'stay', 'overall', 'impression', 'enjoyment'],
}
const ASPECT_DIMINISHERS = new Set(['bit', 'somewhat', 'kind', 'fairly', 'quite', 'rather', 'sort', 'kinda', 'a'])
const ASPECT_NEGATORS = new Set(['not', 'no', 'never', "n't", 'neither', 'nor'])

// Python's round() rounds halves to even; int() truncates toward zero.
export function pyRound(x: number): number {
  const r = Math.round(x)
  return Math.abs(x % 1) === 0.5 && r % 2 !== 0 ? r - 1 : r
}
const trunc = Math.trunc

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const CONTRACTION_RES = Object.entries(CONTRACTIONS).map(([c, e]) => [new RegExp(`\\b${escape(c)}\\b`, 'g'), e] as const)

function expandContractions(text: string): string {
  let t = text.toLowerCase()
  for (const [re, expansion] of CONTRACTION_RES) t = t.replace(re, expansion)
  return t
}

// Stand-in for spaCy's lemmatizer: try a few common suffixes against the lexicon.
function lemmaCandidates(raw: string): string[] {
  // spaCy reads "excellent." as "excellent", so trailing punctuation goes first.
  const word = raw.replace(/^[^a-z]+|[^a-z]+$/g, '')
  const out: string[] = word !== raw ? [word] : []
  if (word.endsWith('ies')) out.push(word.slice(0, -3) + 'y')
  if (word.endsWith('es')) out.push(word.slice(0, -2))
  if (word.endsWith('s') && !word.endsWith('ss')) out.push(word.slice(0, -1))
  if (word.endsWith('ied')) out.push(word.slice(0, -3) + 'y')
  if (word.endsWith('ed')) out.push(word.slice(0, -2), word.slice(0, -1))
  if (word.endsWith('ing')) out.push(word.slice(0, -3), word.slice(0, -3) + 'e')
  if (word.endsWith('ly')) out.push(word.slice(0, -2))
  return out
}

function makePoints(lex: Lexicon) {
  return (raw: string): number => {
    const word = raw.toLowerCase().trim()
    if (!word || NEUTRAL_WORDS.has(word)) return 0
    if (word in lex) return lex[word]
    for (const lemma of lemmaCandidates(word)) {
      if (NEUTRAL_WORDS.has(lemma)) return 0
      if (lemma in lex) return lex[lemma]
    }
    return 0
  }
}

function cleanInput(text: string): string[] {
  let t = expandContractions(text)
  for (const p of ['.', ',', '!', '?', ';', ':', '"', "'", '-', '—']) t = t.split(p).join(' ')
  return t.split(/\s+/).filter((w) => /^[a-z]+$/.test(w) && !STOP_WORDS.has(w))
}

function isNegated(i: number, words: string[]): boolean {
  for (let j = Math.max(0, i - 2); j < i; j++) if (NEGATORS.has(words[j])) return true
  return false
}

function contrastSentiment(sentence: string, points: (w: string) => number): [number, number, boolean] {
  const words = expandContractions(sentence).toLowerCase().split(/\s+/).filter(Boolean)
  const idx = words.findIndex((w) => CONTRAST_WORDS.has(w))
  if (idx === -1) return [0, 0, false]
  const side = (from: number, to: number): [number, number] => {
    let pos = 0
    let neg = 0
    for (let i = from; i < to; i++) {
      if (NEGATORS.has(words[i])) continue
      let p = points(words[i])
      if (isNegated(i, words)) p = p < -1 ? 1 : -p
      if (p > 0) pos += p
      else if (p < 0) neg += -p
    }
    return [pos, neg]
  }
  const [prePos, preNeg] = side(0, idx)
  const [postPos, postNeg] = side(idx + 1, words.length)
  const both = (prePos > 0 || postPos > 0) && (preNeg > 0 || postNeg > 0)
  const preNegation = idx >= 1 && NEGATORS.has(words[idx - 1])
  const postNegation = idx + 1 < words.length && NEGATORS.has(words[idx + 1])
  if (preNegation && postNegation) return [0, 0, false]
  if (preNegation) return [trunc(postPos * 0.8), trunc(postNeg * 0.8), both]
  if (postNegation) return [Math.max(0, trunc(prePos * 0.5)), Math.max(0, trunc(preNeg * 0.5)), both]
  return [trunc(prePos * 0.3) + trunc(postPos * 0.7), trunc(preNeg * 0.3) + trunc(postNeg * 0.7), both]
}

function comparisonSentiment(sentence: string): [number, number] {
  const words = sentence.toLowerCase().split(/\s+/).filter(Boolean)
  const comparisons = new Set(['better', 'worse', 'superior', 'inferior', 'greater', 'lesser', 'more', 'less', 'best', 'worst'])
  const idx = words.findIndex((w) => comparisons.has(w))
  if (idx === -1) return [0, 0]
  const w = words[idx]
  if (['better', 'superior', 'greater', 'best'].includes(w)) {
    const before = words.slice(Math.max(0, idx - 2), idx)
    if (before.some((b) => ['seen', 'known', 'had', 'used', 'expected'].includes(b))) return [0, 0]
    return [2, 0]
  }
  if (['worse', 'inferior', 'lesser', 'worst', 'less'].includes(w)) return [0, 2]
  return [0, 0]
}

function idiomAdjustment(raw: string, points: (w: string) => number): [number, number] {
  let text = ' ' + raw.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').replace(/\s+/g, ' ') + ' '
  let posDelta = 0
  let negDelta = 0
  for (const [term, base] of [...IDIOMS].sort((a, b) => b[0].length - a[0].length)) {
    const needle = ` ${term} `
    while (text.includes(needle)) {
      let weight = base
      const negated = text.slice(0, text.indexOf(needle)).split(' ').filter(Boolean).slice(-2).some((w) => IDIOM_NEGATORS.has(w))
      if (negated) {
        weight = -Math.abs(weight)
        posDelta -= term.split(' ').reduce((s, t) => s + Math.abs(points(t)), 0)
      } else {
        for (const t of term.split(' ')) {
          const b = points(t)
          if (b > 0) posDelta -= b
          else if (b < 0) negDelta -= -b
        }
      }
      if (weight > 0) posDelta += weight
      else negDelta += -weight
      text = text.replace(needle, ' _ ')
    }
  }
  return [posDelta, negDelta]
}

function aspectSentiment(raw: string, keywords: string[], points: (w: string) => number): Aspect['sentiment'] | null {
  const words = raw.toLowerCase().split(/\s+/).filter(Boolean)
  const positions = words.flatMap((w, i) => (keywords.some((k) => w.includes(k)) ? [i] : []))
  if (!positions.length) return null
  let pos = 0
  let neg = 0
  for (const at of positions) {
    let best: [number, number] | null = null
    let bestDistance = Infinity
    for (let i = Math.max(0, at - 5); i < Math.min(words.length, at + 3); i++) {
      if (ASPECT_DIMINISHERS.has(words[i]) || ASPECT_NEGATORS.has(words[i])) continue
      const p = points(words[i])
      if (p === 0) continue
      const d = Math.abs(i - at)
      if (d < bestDistance) {
        bestDistance = d
        best = [i, p]
      }
    }
    if (!best) continue
    let [idx, p] = best
    const prev = idx > 0 ? words[idx - 1] : ''
    const negated = ASPECT_NEGATORS.has(prev)
    if (!negated && ASPECT_DIMINISHERS.has(prev)) p = pyRound(p * 0.5)
    if (negated ? p < 0 : p > 0) pos += Math.abs(p)
    else neg += Math.abs(p)
  }
  if (pos > neg) return 'POSITIVE'
  if (neg > pos) return 'NEGATIVE'
  return 'NEUTRAL'
}

export function analyze(raw: string, lex: Lexicon): Analysis {
  const text = raw.replace(/[‘’]/g, "'")
  const points = makePoints(lex)
  const lower = text.toLowerCase()
  const empty: Analysis = { label: 'NEUTRAL', confidence: 0, pos: 0, neg: 0, aspects: [], scored: {}, sarcasm: false }
  if (!text.trim()) return empty

  // Highlighting: every word the lexicon knows, with its base points.
  const scored: Record<string, number> = {}
  for (const w of lower.split(/[^a-z'-]+/)) {
    const p = points(w)
    if (p) scored[w] = p
  }

  if (EXPLICIT_NEUTRAL_PHRASES.some((p) => lower.includes(p))) {
    return { ...empty, confidence: 1, scored }
  }

  let pos = 0
  let neg = 0
  let contrastMixed = false

  for (const ch of Array.from(text)) {
    const s = EMOJI_SENTIMENT[ch] ?? 0
    if (s > 0) pos += s
    else if (s < 0) neg += -s
  }
  let expanded = text
  for (const [emoji, desc] of Object.entries(EMOJI_TEXT)) expanded = expanded.split(emoji).join(` ${desc} `)

  for (const sentence of expanded.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)) {
    const [cPos, cNeg, cMixed] = contrastSentiment(sentence, points)
    if (cMixed) contrastMixed = true
    pos += cPos
    neg += cNeg

    const [compPos, compNeg] = comparisonSentiment(sentence)
    pos += compPos
    neg += compNeg
    if (compPos > 0 || compNeg > 0) continue

    const words = cleanInput(sentence)
    let sentPos = 0
    let sentNeg = 0
    words.forEach((word, i) => {
      const isIntensifier = word in CONTEXT_INTENSIFIERS || BASIC_INTENSIFIERS.has(word)
      if (isIntensifier && i + 1 < words.length && points(words[i + 1]) !== 0) return

      let p = points(word)
      if (p === 0) return
      const prev = i > 0 ? words[i - 1] : ''
      if (prev in CONTEXT_INTENSIFIERS || BASIC_INTENSIFIERS.has(prev)) {
        const mult = CONTEXT_INTENSIFIERS[prev] ?? 1.5
        p = Math.max(-4, Math.min(4, p * mult))
      }

      const negated = isNegated(i, words)
      let dim = 1
      if (i > 0) {
        const diminishes = prev === 'pretty' ? points(word) !== 0 : DIMINISHERS.has(prev)
        if (diminishes) dim = 0.75
      }
      const finalPoints = pyRound(p * dim)
      if (negated) {
        if (p > 0) sentNeg += Math.max(1, pyRound(finalPoints * 0.5))
        else sentPos += Math.max(1, pyRound(Math.abs(finalPoints) * 0.5))
      } else if (finalPoints > 0) sentPos += finalPoints
      else sentNeg += Math.abs(finalPoints)
    })
    pos += sentPos
    neg += sentNeg
  }

  const [idPos, idNeg] = idiomAdjustment(text, points)
  if (idPos || idNeg) {
    pos = Math.max(0, pos + idPos)
    neg = Math.max(0, neg + idNeg)
  }

  // MIXED: an explicit contrast with both sides present, or near-equal opposing scores.
  const hasContrastPhrase = MIXED_CONTRAST_PHRASES.some((p) => lower.includes(p))
  const total = pos + neg
  const mixed = pos > 0 && neg > 0 && ((hasContrastPhrase && contrastMixed) || Math.abs(pos - neg) / total < 0.2)

  let label: Label
  let confidence: number
  if (mixed) {
    label = 'MIXED'
    confidence = Math.min(0.6, Math.max(0.45, 0.45 + (Math.min(pos, neg) / total) * 0.15))
  } else if (total === 0) {
    label = 'NEUTRAL'
    confidence = 0
  } else if (pos !== neg) {
    label = pos > neg ? 'POSITIVE' : 'NEGATIVE'
    const margin = Math.abs(pos - neg) / (total + 1)
    confidence = Math.min(0.98, Math.max(0.35, margin * 0.75 + Math.min(total / 5, 1) * 0.25))
  } else {
    label = 'NEUTRAL'
    confidence = 0.5
  }

  const aspects: Aspect[] = []
  for (const [name, keywords] of Object.entries(ASPECTS)) {
    if (!keywords.some((k) => lower.includes(k))) continue
    const sentiment = aspectSentiment(text, keywords, points)
    if (sentiment) aspects.push({ name, sentiment })
  }

  return { label, confidence, pos, neg, aspects, scored, sarcasm: text.includes('🤡') }
}
