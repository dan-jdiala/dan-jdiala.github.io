import { useEffect, useRef, useState } from 'react'

const supportsObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window

// Returns a ref and whether the element has scrolled into view (fires once).
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  // Without IntersectionObserver, show content immediately.
  const [visible, setVisible] = useState(!supportsObserver)

  useEffect(() => {
    const node = ref.current
    if (!node || !supportsObserver) return
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
