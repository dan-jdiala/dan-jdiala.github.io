import type { Media } from '../data/site'

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Looping project recording; visitors who prefer reduced motion get the still frame instead.
export function Recording({ media }: { media: Media }) {
  return (
    <figure className="system__media">
      <img
        src={prefersReducedMotion ? media.still : media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading="lazy"
        decoding="async"
      />
    </figure>
  )
}
