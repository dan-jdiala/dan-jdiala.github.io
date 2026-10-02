type IconProps = { title?: string }

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function a11y(title?: string) {
  return title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true }
}

export function MailIcon({ title }: IconProps) {
  return (
    <svg {...base} {...a11y(title)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  )
}

export function LinkedInIcon({ title }: IconProps) {
  return (
    <svg {...base} {...a11y(title)}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M8 10.5V16M8 7.75v.01M12 16v-3.25a2.25 2.25 0 0 1 4.5 0V16M12 10.5V16" />
    </svg>
  )
}

export function GitHubIcon({ title }: IconProps) {
  return (
    <svg {...base} {...a11y(title)}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  )
}

export function ArrowUpRightIcon({ title }: IconProps) {
  return (
    <svg {...base} {...a11y(title)}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function ArrowDownIcon({ title }: IconProps) {
  return (
    <svg {...base} {...a11y(title)}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  )
}

export function LockIcon({ title }: IconProps) {
  return (
    <svg {...base} {...a11y(title)}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
