import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

// Current US Eastern time (HH:MM), updated at each minute boundary.
export function useClock(): string {
  const [time, setTime] = useState(() => formatter.format(new Date()))

  useEffect(() => {
    let interval = 0
    const tick = () => setTime(formatter.format(new Date()))
    const timeout = window.setTimeout(() => {
      tick()
      interval = window.setInterval(tick, 60_000)
    }, 60_000 - (Date.now() % 60_000))
    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [])

  return time
}
