import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

// Current time in US Eastern, updated every second.
export function useClock(): string {
  const [time, setTime] = useState(() => formatter.format(new Date()))

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatter.format(new Date())), 1000)
    return () => window.clearInterval(id)
  }, [])

  return time
}
