import { useEffect, useRef, useState } from 'react'
import type { Media } from '../data/site'

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Project demo video with a YouTube-style center play/pause control (WCAG 2.2.2).
// Autoplays muted while on screen unless the visitor paused it or prefers reduced motion.
export function Recording({ media }: { media: Media }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(prefersReducedMotion)
  const [flash, setFlash] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused) {
          video.play().catch(() => setPlaying(false))
        } else if (!entry.isIntersecting) {
          video.pause()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [userPaused])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      setUserPaused(false)
      video.play().catch(() => setPlaying(false))
    } else {
      setUserPaused(true)
      video.pause()
    }
    setFlash((n) => n + 1)
  }

  return (
    <figure className="system__media">
      <div className={`player${playing ? ' is-playing' : ' is-paused'}`}>
        <video
          ref={videoRef}
          src={media.src}
          poster={media.still}
          width={media.width}
          height={media.height}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <button type="button" className="player__toggle" onClick={toggle} aria-label={playing ? 'Pause demo' : 'Play demo'}>
          <span key={flash} className={`player__icon${flash ? ' is-flashing' : ''}`} aria-hidden="true">
            {playing ? (
              <svg viewBox="0 0 24 24" width="28" height="28">
                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="30" height="30">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </figure>
  )
}
