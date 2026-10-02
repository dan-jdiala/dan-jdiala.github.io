import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

// Counts from 0 to `target` once `start` becomes true (ease-out cubic).
// With reduced motion, the final value is shown immediately.
export function useCountUp(target: number, start: boolean, duration = 1400, delay = 0): number {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (reduced || !start) return

    let frame = 0
    let startTime: number | null = null
    const timer = window.setTimeout(() => {
      const tick = (now: number) => {
        startTime ??= now
        const t = Math.min((now - startTime) / duration, 1)
        setValue(target * (1 - Math.pow(1 - t, 3)))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, delay)

    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [target, start, duration, delay, reduced])

  return reduced ? target : value
}
