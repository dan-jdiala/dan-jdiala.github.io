import { useState } from 'react'
import type { Media } from '../data/site'

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A looping GIF with a pause control (WCAG 2.2.2). Reduced-motion visitors start on the still frame.
export function Recording({ media }: { media: Media }) {
  const [playing, setPlaying] = useState(!prefersReducedMotion)

  return (
    <figure className="system__media">
      <img
        src={playing ? media.src : media.still}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading="lazy"
        decoding="async"
      />
      <figcaption className="system__media-caption mono">
        <span>{media.caption}</span>
        <button type="button" className="media-toggle" onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Pause recording' : 'Play recording'}
        </button>
      </figcaption>
    </figure>
  )
}
