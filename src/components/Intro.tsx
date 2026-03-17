import { useEffect } from 'react'
import type { PalaceManifest } from '../types'

interface IntroProps {
  manifest: PalaceManifest
  onComplete: () => void
}

export default function Intro({ manifest, onComplete }: IntroProps) {
  const newCount = Object.values(manifest.wings).reduce(
    (sum, wing) => sum + wing.entries.filter(e => e.isNew).length, 0
  )

  useEffect(() => {
    // Auto-complete intro after animation time
    const total = 500 + 1500 + 1500 + newCount * 250 + 3000
    const timer = setTimeout(onComplete, total)
    return () => clearTimeout(timer)
  }, [newCount, onComplete])

  return null
}
