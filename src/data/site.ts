// All site content lives here. Keep it in sync with Resumes/resume.html.

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
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  detail: string
}

export type SystemStatus = 'live' | 'active' | 'open-source'

export type SystemProject = {
  id: string
  name: string
  subtitle: string
  status: SystemStatus
  tags: string[]
  period: string
  stack: string[]
  facts: string[]
  links: Link[]
  note?: string
  flagship?: boolean
}

export type LogEvent = {
  id: string
  stamp: string
  kind: 'role' | 'cert' | 'competition' | 'leadership' | 'club'
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
  role: 'Software Engineering @ Monmouth University',
  location: 'Long Branch, NJ',
  status: 'Seeking Summer 2027 internships',
  summary:
    "I'm an undergraduate Software Engineering student who builds real-world projects end to end, from ML systems and data pipelines to websites, and I'm expanding into mobile apps and hardware.",
  email: 's1398883@monmouth.edu',
  links: {
    linkedin: 'https://www.linkedin.com/in/daniel-john-diala',
    github: 'https://github.com/dan-jdiala',
  },
}

export const telemetry: Telemetry[] = [
  { id: 'gpa', value: 4.0, decimals: 1, label: 'GPA', detail: 'B.S. Software Engineering' },
  { id: 'pn-tests', value: 1500, suffix: '+', label: 'automated tests', detail: 'Pulse-Net · pytest in CI' },
  { id: 'ccarf-tests', value: 2000, suffix: '+', label: 'automated tests', detail: 'Study web app · Vitest + Playwright' },
  { id: 'live', value: 2, label: 'live web apps', detail: 'Hosted on AWS' },
  { id: 'ncl', value: 4, prefix: 'Top ', suffix: '%', label: 'NCL team rank', detail: '127 of 3,638 teams' },
]

export const systems: SystemProject[] = [
  {
    id: 'pulse-net',
    name: 'Pulse-Net',
    subtitle: 'Federated pandemic early-warning system',
    status: 'active',
    tags: ['Private repo'],
    period: 'Jan 2026 – Present',
    stack: ['Python', 'PyTorch', 'FastAPI', 'PostgreSQL', 'React', 'Docker'],
    facts: [
      'Five simulated hospitals train PyTorch models locally and share only signed, differentially private updates, merged with a poisoning-resistant coordinate-wise median.',
      'A transformer trained with supervised contrastive loss flags novel pathogens by embedding distance: 83.6% validation accuracy across 16 classes on synthetic data.',
      'Mutual TLS, deny-by-default access control, homomorphic encryption, live CDC wastewater and genomic data feeds, and a React dashboard with outbreak maps, backed by 1,500+ tests in CI.',
    ],
    links: [],
    note: 'Private repository',
    flagship: true,
  },
  {
    id: 'ccarf',
    name: 'Claude Certified Architect Study Web App',
    subtitle: 'Exam-prep platform for Monmouth AI Literacy students',
    status: 'live',
    tags: ['Teaching'],
    period: '2026',
    stack: ['Next.js', 'TypeScript', 'React', 'Vitest', 'Playwright', 'AWS EC2'],
    facts: [
      "30 lessons, 30 study decks, 10 guided labs, 180 practice questions, and two timed practice exams for Anthropic's Claude Certified Architect – Foundations exam.",
      'Deployed on AWS EC2 and covered by 2,000+ Vitest unit tests and Playwright end-to-end tests.',
    ],
    links: [{ label: 'Open live site', href: 'https://monmouthaiteaching.com/ccarf' }],
  },
  {
    id: 'garel',
    name: 'GArel Playground',
    subtitle: 'Research web app for program cost analysis',
    status: 'live',
    tags: ['Research'],
    period: 'May 2026 – Present',
    stack: ['React', 'TypeScript', 'Vite', 'FastAPI', 'OCaml', 'Docker'],
    facts: [
      'Browser playground for GArel, an OCaml bidirectional type checker (from Qu et al., ICFP 2019) that analyzes a program’s cost without running it, with constraint-generation visualizations.',
      'FastAPI backend runs the checker in a sandboxed subprocess with rate limiting and timeouts; Playwright end-to-end suites cover the UI.',
    ],
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
      'Flask REST API (15+ endpoints) and Streamlit dashboard; cut runtime for 500 reviews from 17s to 5s with batched spaCy processing and bulk SQLite inserts.',
    ],
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
      'Modernized GArel, an OCaml bidirectional type checker (from Qu et al., ICFP 2019) that analyzes program cost statically.',
      'Fixed drift in a 36-program test corpus and stress-tested the checker to map its limits.',
      'Currently evaluating CHC- and SMT-solver-based alternatives to scale the analysis.',
      'Built the GArel Playground web app, hosted on AWS.',
    ],
  },
  {
    id: 'ncl',
    stamp: '2026-04',
    kind: 'competition',
    title: 'National Cyber League',
    org: 'CyberHawks',
    bullets: ['Team: top 4% (127 of 3,638). Individual: top 14% (1,011 of 7,011).'],
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
  {
    id: 'cyberhawks',
    stamp: '2025-09',
    kind: 'club',
    title: 'Member',
    org: 'Monmouth University CyberHawks',
    period: 'Sep 2025 – Present',
    bullets: [],
  },
]

export const skills: SkillGroup[] = [
  { label: 'Languages', items: ['Python', 'Java', 'TypeScript', 'JavaScript', 'SQL', 'OCaml', 'HTML/CSS'] },
  { label: 'ML & Data', items: ['PyTorch', 'spaCy', 'NLP', 'pandas', 'NumPy', 'Federated learning', 'Differential privacy'] },
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
