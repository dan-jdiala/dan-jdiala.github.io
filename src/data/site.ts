// All site content lives here. Keep it in sync with Resumes/resume.html.
// Every claim should be checkable against the project repos.

export type Link = { label: string; href: string }

export type Profile = {
  name: string
  role: string
  location: string
  status: string
  summary: string
  email: string
  links: { linkedin: string; github: string }
}

export type Telemetry = {
  id: string
  value: string
  label: string
  detail: string
}

export type SystemStatus = 'live' | 'active' | 'open-source'

export type CaseNotes = {
  problem: string
  role: string
  challenge: string
  limits: string
}

export type Stat = { value: string; label: string }

export type SystemProject = {
  id: string
  name: string
  subtitle: string
  status: SystemStatus
  tags: string[]
  period: string
  stack: string[]
  facts: string[]
  caseNotes: CaseNotes
  links: Link[]
  note?: string
  stats?: Stat[]
  flagship?: boolean
}

export type LogEvent = {
  id: string
  stamp: string
  kind: 'role' | 'cert' | 'competition' | 'leadership'
  title: string
  org: string
  period?: string
  bullets: string[]
}

export type SkillGroup = { label: string; items: string[] }

export type Education = {
  school: string
  location: string
  degree: string
  expected: string
  gpa: string
  honors: string[]
  coursework: string[]
}

export const profile: Profile = {
  name: 'Daniel-John Diala',
  role: 'Software Engineering @ Monmouth University · 4.0 GPA',
  location: 'Long Branch, NJ',
  status: 'Seeking Summer 2027 internships',
  summary:
    "I'm an undergraduate Software Engineering student who builds real-world projects end to end, from ML systems and data pipelines to websites, and I'm looking to eventually expand into mobile apps and hardware.",
  email: 's1398883@monmouth.edu',
  links: {
    linkedin: 'https://www.linkedin.com/in/daniel-john-diala',
    github: 'https://github.com/dan-jdiala',
  },
}

export const telemetry: Telemetry[] = [
  { id: 'gpa', value: '4.0', label: 'GPA', detail: 'B.S. Software Engineering, Class of 2029' },
  { id: 'live', value: '2', label: 'live web apps', detail: 'Study app + GArel Playground, on AWS' },
  { id: 'tests', value: '3,500+', label: 'automated tests', detail: 'pytest, Vitest, Playwright across projects' },
  { id: 'ncl', value: 'Top 4%', label: 'NCL team rank', detail: '127 of 3,638 teams, Spring 2026' },
]

export const systems: SystemProject[] = [
  {
    id: 'pulse-net',
    name: 'Pulse-Net',
    subtitle: 'Federated pandemic early-warning prototype (synthetic data)',
    status: 'active',
    tags: [],
    period: 'Jan 2026 – Present',
    stack: ['Python', 'PyTorch', 'FastAPI', 'PostgreSQL', 'React', 'Docker'],
    facts: [
      'Hospital edge nodes train a PyTorch model on local (simulated) patient data and send only Ed25519-signed, Laplace-noised updates (ε = 1.0 per round), never patient records. The FastAPI coordinator merges them with norm clipping and a coordinate-wise median to resist poisoned submissions.',
      'A transformer trained with supervised contrastive loss classifies 16 pathogen profiles at 83.6% validation accuracy on synthetic data and flags possible novel pathogens by their embedding distance from known classes.',
      'JWT auth with role-based access control, 23 SQLAlchemy models with hand-written SQL migrations, optional mutual TLS with CRL/OCSP revocation, CDC wastewater and NCBI GenBank feeds, and a React dashboard with an outbreak map; about 1,500 pytest tests.',
    ],
    caseNotes: {
      problem:
        'Outbreaks are often recognized late, and hospitals can’t pool patient records to spot them sooner because of privacy rules.',
      role: 'Solo project: I designed and built the edge client, FastAPI coordinator, PostgreSQL schema, ML models, and React dashboard.',
      challenge:
        'Making the update path fail closed: hospitals enroll signing keys, every update is signature-checked, a nonce ledger blocks replays, and revoked keys are rejected, so a forged or repeated submission is refused rather than merged.',
      limits:
        'Runs on synthetic data; the 4–7 day early-warning lead is a design goal, not a measured result. Homomorphic-encryption and zero-knowledge components fall back to simulations without native libraries, and production startup refuses simulated crypto.',
    },
    links: [],
    note: 'Private repository',
    stats: [
      { value: '5', label: 'simulated hospitals' },
      { value: '16', label: 'pathogen classes' },
      { value: 'ε 1.0', label: 'noise per round' },
      { value: '1,500+', label: 'pytest tests' },
    ],
    flagship: true,
  },
  {
    id: 'ccarf',
    name: 'Claude Certified Architect Study Web App',
    subtitle: 'Exam-prep platform for Monmouth AI Literacy students',
    status: 'live',
    tags: ['Teaching'],
    period: 'Aug 2026 – Present',
    stack: ['Next.js', 'TypeScript', 'React', 'Vitest', 'Playwright', 'AWS EC2'],
    facts: [
      "Exam-prep platform for Anthropic's Claude Certified Architect – Foundations exam: 30 lessons, 30 study decks, 10 guided labs, 180 practice questions, and two timed 60-question practice exams.",
      'Deployed on AWS EC2; covered by 2,000+ Vitest unit tests and Playwright end-to-end tests, including automated accessibility checks.',
    ],
    caseNotes: {
      problem: 'AI Literacy students needed structured, self-paced preparation for a new certification exam.',
      role: 'Built the app (101 of 102 commits) and use it with students as the course’s teaching assistant.',
      challenge:
        'Keeping timed exam rehearsal separate from everyday practice, so a mock exam never distorts a student’s mastery tracking, and tying every lesson to the published exam blueprint.',
      limits: 'An independent study aid, not affiliated with Anthropic. Progress is stored in the browser, with no accounts.',
    },
    links: [{ label: 'Open live site', href: 'https://monmouthaiteaching.com/ccarf' }],
  },
  {
    id: 'garel',
    name: 'GArel Playground',
    subtitle: 'Teaching and research web app for relational cost analysis',
    status: 'live',
    tags: ['Research'],
    period: 'Jun 2026 – Present',
    stack: ['React', 'TypeScript', 'Vite', 'FastAPI', 'OCaml', 'Docker'],
    facts: [
      'Browser playground for GArel, an OCaml bidirectional type checker (from Qu et al., ICFP 2019) that proves bounds on how much one program run can cost relative to another, without running either, with constraint-generation visualizations.',
      'FastAPI backend runs the checker as a sandboxed subprocess (time caps, rate limiting, read-only, capability-dropped containers on an internal network); Playwright end-to-end suites cover the UI.',
    ],
    caseNotes: {
      problem: 'The research checker was command-line only, which made relational cost analysis hard for newcomers to try or learn.',
      role: 'Primary developer of the playground (272 of 295 commits), alongside the research on modernizing the checker.',
      challenge:
        'Safely running research code for anyone on the internet: wall-clock caps, process-group kills, per-client rate limits, concurrency slots, and locked-down containers.',
      limits: '25 of the 36 corpus programs currently verify; the app reports the remaining failures clearly instead of hiding them.',
    },
    links: [{ label: 'Open live site', href: 'https://relationalreasoning.com/garel/' }],
  },
  {
    id: 'sentiment',
    name: 'Sentiment Analysis Tool',
    subtitle: 'NLP review analysis with a REST API and dashboard',
    status: 'open-source',
    tags: [],
    period: 'Dec 2025 – Jan 2026',
    stack: ['Python', 'spaCy', 'Flask', 'SQLite', 'Streamlit', 'Plotly'],
    facts: [
      'Classifies reviews as positive, negative, neutral, or mixed using a 6,800-term graded lexicon with negation handling and emoji sarcasm cues, plus aspect-based analysis.',
      'Flask REST API (15+ endpoints, OpenAPI docs) and Streamlit dashboard; in local benchmarks, cut runtime for 500 reviews from 17s to 5s with batched spaCy processing, lemma caching, and bulk SQLite inserts.',
    ],
    caseNotes: {
      problem: 'Star ratings hide what a reviewer actually liked or disliked, and mixed reviews get flattened into one score.',
      role: 'Solo project.',
      challenge:
        'Handling nuance with rules instead of a trained model: negation (“not bad”), intensifiers, sarcasm cues, and reviews that are positive about one aspect and negative about another.',
      limits: 'Lexicon-based, with no labeled accuracy evaluation yet; the speedup was measured locally.',
    },
    links: [{ label: 'View code', href: 'https://github.com/dan-jdiala/sentiment-analysis-tool' }],
  },
]

export const events: LogEvent[] = [
  {
    id: 'ta',
    stamp: '2026-09',
    kind: 'role',
    title: 'AI Literacy Teaching Assistant',
    org: 'Monmouth University',
    period: 'Sep 2026 – Present',
    bullets: [
      'Help students set up agentic AI systems and use AI tools effectively and ethically.',
      'Explain unfamiliar AI concepts in one-on-one and classroom settings.',
      'Built the Claude Certified Architect study web app used to prepare for the certification exam.',
    ],
  },
  {
    id: 'cert',
    stamp: '2026-07',
    kind: 'cert',
    title: 'Claude Certified Architect – Foundations',
    org: 'Anthropic',
    period: 'Issued Jul 2026',
    bullets: ['Architecture-level skills for designing, integrating, and operating production AI systems.'],
  },
  {
    id: 'research',
    stamp: '2026-05',
    kind: 'role',
    title: 'Undergraduate Research Assistant',
    org: 'Monmouth University',
    period: 'May 2026 – Present',
    bullets: [
      'Modernized GArel, an OCaml bidirectional type checker (from Qu et al., ICFP 2019) for relational cost analysis.',
      'Fixed drift in a 36-program test corpus, stress-tested the checker to map its limits, and developed one of two independent solution paths.',
      'Currently evaluating CHC- and SMT-solver-based alternatives to scale the analysis.',
      'Built the GArel Playground web app, hosted on AWS.',
    ],
  },
  {
    id: 'ncl',
    stamp: '2026-04',
    kind: 'competition',
    title: 'National Cyber League (Spring 2026)',
    org: 'Monmouth University CyberHawks',
    period: 'Member since Sep 2025',
    bullets: ['Team: top 4% (127 of 3,638). Individual: top 15% (1,011 of 7,011).'],
  },
  {
    id: 'ieee',
    stamp: '2026-03',
    kind: 'leadership',
    title: 'University & External Relations Committee Chair',
    org: 'IEEE/ACM Student Chapter',
    period: 'Mar 2026 – Present',
    bullets: [],
  },
]

export const skills: SkillGroup[] = [
  { label: 'Languages', items: ['Python', 'Java', 'TypeScript', 'JavaScript', 'SQL', 'OCaml', 'HTML/CSS'] },
  { label: 'ML & Data', items: ['PyTorch', 'spaCy', 'NLP', 'pandas', 'NumPy', 'Federated learning'] },
  { label: 'Web & Backend', items: ['React', 'Next.js', 'FastAPI', 'Flask', 'REST APIs', 'PostgreSQL', 'SQLAlchemy', 'Redis'] },
  { label: 'Infra & Testing', items: ['AWS (EC2)', 'Docker', 'Git', 'GitHub Actions', 'pytest', 'Vitest', 'Playwright'] },
  { label: 'AI Tools', items: ['Claude', 'Claude Code', 'Anthropic API', 'Agentic AI workflows'] },
]

export const education: Education = {
  school: 'Monmouth University',
  location: 'West Long Branch, NJ',
  degree: 'B.S. Software Engineering',
  expected: 'Expected May 2029',
  gpa: '4.0 / 4.0',
  honors: ["Dean's List (Fall 2025, Spring 2026)", 'Academic Excellence Scholarship', 'Shirley Family Scholarship'],
  coursework: ['Data Structures & Algorithms', 'Discrete Mathematics', 'Computer Architecture', 'Calculus I & II'],
}
