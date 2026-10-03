import { useEffect, useRef, useState } from 'react'

// Returns a ref and whether the element has scrolled into view (fires once).
// Starts hidden on both server and client so prerendered HTML hydrates cleanly; the
// hiding itself is CSS that only applies when scripting is enabled.
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      // Very old browsers: show content right away.
      queueMicrotask(() => setVisible(true))
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}
