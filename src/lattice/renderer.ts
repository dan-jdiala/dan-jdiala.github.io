import { nodePoints, signalPath, type Point } from './geometry'

type Pulse = {
  path: Point[]
  start: number
  duration: number
}

const NODE_COLOR = 'rgba(159, 179, 209, 0.22)'
const SIGNAL = '245, 165, 36'
const TRAIL_FADE_MS = 650

// Draws the faint lattice nodes and any active signal pulses on one canvas.
// The animation loop runs only while a pulse is visible, then stops.
export class LatticeRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private width = 0
  private height = 0
  private nodes: Point[] = []
  private pulses: Pulse[] = []
  private frame = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D is not supported')
    this.ctx = ctx
    this.resize()
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas.width = Math.round(this.width * dpr)
    this.canvas.height = Math.round(this.height * dpr)
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.nodes = nodePoints(this.width, this.height)
    this.draw(performance.now())
  }

  emit(startI: number, startJ: number, steps: number, duration: number, allowRise = true) {
    const path = signalPath(startI, startJ, steps, this.width, this.height, allowRise)
    this.pulses.push({ path, start: performance.now(), duration })
    if (!this.frame) this.frame = requestAnimationFrame(this.tick)
  }

  stop() {
    cancelAnimationFrame(this.frame)
    this.frame = 0
    this.pulses = []
    this.draw(performance.now())
  }

  private tick = (now: number) => {
    this.pulses = this.pulses.filter((p) => now - p.start < p.duration + TRAIL_FADE_MS)
    this.draw(now)
    this.frame = this.pulses.length ? requestAnimationFrame(this.tick) : 0
  }

  private draw(now: number) {
    const { ctx } = this
    ctx.clearRect(0, 0, this.width, this.height)

    ctx.fillStyle = NODE_COLOR
    for (const n of this.nodes) {
      ctx.beginPath()
      ctx.arc(n.x, n.y, 1.3, 0, Math.PI * 2)
      ctx.fill()
    }

    for (const pulse of this.pulses) this.drawPulse(pulse, now)
  }

  private drawPulse(pulse: Pulse, now: number) {
    const { ctx } = this
    const segments = pulse.path.length - 1
    if (segments < 1) return
    const elapsed = now - pulse.start
    const progress = Math.min(elapsed / pulse.duration, 1)
    const eased = 1 - Math.pow(1 - progress, 2)
    const headPos = eased * segments
    const msPerSegment = pulse.duration / segments

    // Trail: each segment fades out after the head has passed it.
    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    for (let s = 0; s < Math.ceil(headPos); s++) {
      const a = pulse.path[s]
      const b = pulse.path[s + 1]
      const partial = Math.min(headPos - s, 1)
      const passedAt = (s + partial) * msPerSegment
      const alpha = Math.max(0, 1 - (elapsed - passedAt) / TRAIL_FADE_MS) * 0.6
      if (alpha <= 0) continue
      ctx.strokeStyle = `rgba(${SIGNAL}, ${alpha})`
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(a.x + (b.x - a.x) * partial, a.y + (b.y - a.y) * partial)
      ctx.stroke()
    }

    // Head: a small glowing point that fades once it arrives.
    if (progress < 1 || elapsed < pulse.duration + 250) {
      const s = Math.min(Math.floor(headPos), segments - 1)
      const t = headPos - s
      const a = pulse.path[s]
      const b = pulse.path[s + 1]
      const fade = progress < 1 ? 1 : Math.max(0, 1 - (elapsed - pulse.duration) / 250)
      ctx.save()
      ctx.shadowColor = `rgba(${SIGNAL}, ${0.9 * fade})`
      ctx.shadowBlur = 12
      ctx.fillStyle = `rgba(${SIGNAL}, ${fade})`
      ctx.beginPath()
      ctx.arc(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 2.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }
}
