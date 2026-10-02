import type { CSSProperties } from 'react'

// Boot-sequence step (staggered page-load animation).
export const boot = (step: number) => ({ '--boot': step }) as CSSProperties

// Stagger index for scroll reveals.
export const stagger = (index: number) => ({ '--i': index }) as CSSProperties
