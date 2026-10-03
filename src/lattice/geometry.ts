// Grid math shared by the lattice renderer. The CSS background grid is 48px with lines
// drawn at the top/left 1px of each tile, offset by -1px, so line centers sit at 48k - 0.5.

export const CELL = 48

export type Point = { x: number; y: number }

export function lineCoord(index: number): number {
  return index * CELL - 0.5
}

export function nearestIndex(px: number): number {
  return Math.max(1, Math.round((px + 0.5) / CELL))
}

// Intersections shown as faint nodes: every other line, so the lattice reads as a sparse mesh.
export function nodePoints(width: number, height: number): Point[] {
  const points: Point[] = []
  for (let i = 2; lineCoord(i) < width; i += 2) {
    for (let j = 2; lineCoord(j) < height; j += 2) {
      points.push({ x: lineCoord(i), y: lineCoord(j) })
    }
  }
  return points
}

// A signal path along grid lines: a short walk that mostly travels right, with occasional
// turns, never reversing. It never drops below its start line (the open gap above a heading)
// and rises at most one line, staying below the header.
export function signalPath(
  startI: number,
  startJ: number,
  steps: number,
  width: number,
  height: number,
  allowRise = true,
): Point[] {
  const maxI = Math.floor((width + 0.5) / CELL) - 1
  const maxJ = Math.floor((height + 0.5) / CELL) - 1
  let i = Math.min(Math.max(startI, 1), maxI)
  let j = Math.min(Math.max(startJ, 2), maxJ)
  const minJ = allowRise ? Math.max(2, j - 1) : j
  const bandMaxJ = j
  const path: Point[] = [{ x: lineCoord(i), y: lineCoord(j) }]
  let last: 'h' | 'v' = 'v'

  for (let n = 0; n < steps; n++) {
    const turn = last === 'h' && Math.random() < 0.3
    if (turn) {
      const up = j <= minJ ? false : j >= bandMaxJ ? true : Math.random() < 0.5
      j += up ? -1 : 1
      last = 'v'
    } else if (i < maxI) {
      i += 1
      last = 'h'
    } else {
      break
    }
    path.push({ x: lineCoord(i), y: lineCoord(j) })
  }
  return path
}
