import { useReducedMotion } from 'motion/react'

/** Shared, one-time viewport entrance. Reduced motion renders content immediately. */
export function useReveal(delay = 0) {
  const reducedMotion = useReducedMotion()
  return {
    initial: reducedMotion ? (false as const) : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: {
      duration: reducedMotion ? 0 : 0.5,
      delay: reducedMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }
}
