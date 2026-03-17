import { useMemo } from 'react'
import Building from './Building'
import type { WingData, WingKey } from '../types'

interface WingProps {
  wingKey: WingKey
  data: WingData
  centerPosition: [number, number, number]
  introComplete: boolean
  onHover: (label: string | null) => void
}

// 5-ring layout for scaling to 70+ buildings per wing
const RING_CONFIG = [
  { maxEntries: 6, radius: 1.8 },
  { maxEntries: 10, radius: 3.2 },
  { maxEntries: 14, radius: 4.8 },
  { maxEntries: 18, radius: 6.5 },
  { maxEntries: Infinity, radius: 8.5 },
]

export default function Wing({ wingKey, data, centerPosition, introComplete, onHover }: WingProps) {
  const positions = useMemo(() => {
    const [cx, cy, cz] = centerPosition
    const entries = data.entries

    // Assign entries to rings
    let assigned = 0
    const rings: { entries: typeof entries; radius: number; startIdx: number }[] = []

    for (const ring of RING_CONFIG) {
      const remaining = entries.length - assigned
      if (remaining <= 0) break
      const count = Math.min(ring.maxEntries, remaining)
      rings.push({
        entries: entries.slice(assigned, assigned + count),
        radius: ring.radius,
        startIdx: assigned,
      })
      assigned += count
    }

    const result: { entry: typeof entries[0]; pos: [number, number, number]; delay: number }[] = []

    for (const ring of rings) {
      const count = ring.entries.length
      ring.entries.forEach((entry, i) => {
        const angle = (i / count) * Math.PI * 2 + ring.radius * 0.2
        const r = ring.radius + entry.size * 0.08
        // Deterministic jitter
        const jx = Math.sin((ring.startIdx + i) * 7.3 + wingKey.length) * 0.25
        const jz = Math.cos((ring.startIdx + i) * 4.1 + wingKey.length) * 0.25

        result.push({
          entry,
          pos: [
            cx + Math.cos(angle) * r + jx,
            cy,
            cz + Math.sin(angle) * r + jz,
          ],
          delay: (ring.startIdx + i) * 0.08,
        })
      })
    }

    return result
  }, [data.entries, centerPosition, wingKey])

  return (
    <group>
      {positions.map(({ entry, pos, delay }) => (
        <Building
          key={entry.id}
          position={pos}
          size={entry.size}
          wingType={wingKey}
          isNew={entry.isNew}
          label={entry.label}
          animationDelay={delay}
          introComplete={introComplete}
          onHover={onHover}
        />
      ))}
    </group>
  )
}
