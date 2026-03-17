import Island from './Island'
import CentralKeep from './CentralKeep'
import Wing from './Wing'
import type { PalaceManifest } from '../types'

interface PalaceProps {
  manifest: PalaceManifest
  introComplete: boolean
  onHover: (label: string | null) => void
}

// Expanded wing positions for 230 buildings
const WING_POSITIONS: Record<string, [number, number, number]> = {
  people: [0, 0.1, -14],
  projects: [14, 0.1, 0],
  stories: [0, 0.1, 14],
  preferences: [-14, 0.1, 0],
}

export default function Palace({ manifest, introComplete, onHover }: PalaceProps) {
  return (
    <group>
      <Island />
      <CentralKeep />
      {(Object.keys(manifest.wings) as Array<keyof typeof manifest.wings>).map((wingKey) => (
        <Wing
          key={wingKey}
          wingKey={wingKey}
          data={manifest.wings[wingKey]}
          centerPosition={WING_POSITIONS[wingKey]}
          introComplete={introComplete}
          onHover={onHover}
        />
      ))}
    </group>
  )
}
