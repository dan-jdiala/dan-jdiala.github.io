import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type SectionProps = {
  id: string
  index: string
  title: string
  subtitle: string
  children: ReactNode
}

export function Section({ id, index, title, subtitle, children }: SectionProps) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.05)

  return (
    <section className="section container" id={id} aria-labelledby={`${id}-title`}>
      <div ref={ref} className={`reveal${visible ? ' is-visible' : ''}`}>
        <header className="section-head">
          <span className="section-index" aria-hidden="true">
            {index}
          </span>
          <h2 className="section-title" id={`${id}-title`}>
            {title}
          </h2>
          <p className="section-sub">{subtitle}</p>
        </header>
        {children}
      </div>
    </section>
  )
}
