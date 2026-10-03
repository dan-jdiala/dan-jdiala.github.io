import { useEffect, useRef } from 'react'
import { nearestIndex } from '../lattice/geometry'
import { LatticeRenderer } from '../lattice/renderer'

// Sections that send a signal pulse the first time they scroll into view.
const SECTION_IDS = ['systems', 'log', 'capabilities', 'education', 'contact']

// The site's background lattice: faint nodes on the grid, plus a brief amber signal
// on load and when each section first appears. Nothing loops; reduced motion shows nodes only.
export function LatticeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: LatticeRenderer
    try {
      renderer = new LatticeRenderer(canvas)
    } catch {
      return
    }

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => renderer.resize(), 150)
    }
    window.addEventListener('resize', onResize)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      return () => window.removeEventListener('resize', onResize)
    }

    // Start on the grid line just above an element, in open space rather than behind text.
    const pulseFrom = (el: Element | null, steps: number, duration: number) => {
      if (!el || document.hidden) return
      const r = el.getBoundingClientRect()
      renderer.emit(nearestIndex(r.left), nearestIndex(r.top - 30), steps, duration)
    }

    const loadTimer = window.setTimeout(() => {
      const narrow = window.innerWidth < 600
      pulseFrom(document.querySelector('.eyebrow'), narrow ? 5 : 10, narrow ? 900 : 1200)
    }, 450)

    const seen = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (!entry.isIntersecting || seen.has(id)) continue
          seen.add(id)
          const narrow = window.innerWidth < 600
          pulseFrom(entry.target.querySelector('.section-head, .section-index') ?? entry.target, narrow ? 4 : 8, narrow ? 800 : 1100)
        }
      },
      { threshold: 0.2 },
    )
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    const onVisibility = () => {
      if (document.hidden) renderer.stop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.clearTimeout(loadTimer)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      observer.disconnect()
      renderer.stop()
    }
  }, [])

  return <canvas ref={canvasRef} className="lattice" aria-hidden="true" />
}
