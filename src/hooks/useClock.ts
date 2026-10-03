import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

// Current US Eastern time (HH:MM), updated at each minute boundary. Empty until mounted,
// so prerendered HTML (built at deploy time) never shows a stale time or mismatches.
export function useClock(): string {
  const [time, setTime] = useState('')

  useEffect(() => {
    let interval = 0
    const tick = () => setTime(formatter.format(new Date()))
    const first = window.setTimeout(tick, 0)
    const aligned = window.setTimeout(() => {
      tick()
      interval = window.setInterval(tick, 60_000)
    }, 60_000 - (Date.now() % 60_000))
    return () => {
      window.clearTimeout(first)
      window.clearTimeout(aligned)
      window.clearInterval(interval)
    }
  }, [])

  return time
}
