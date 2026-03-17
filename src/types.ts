export interface BuildingEntry {
  id: string
  label: string
  size: number
  addedAt: string
  isNew?: boolean
}

export interface WingData {
  rooms: number
  floors: number
  entries: BuildingEntry[]
}

export interface PalaceManifest {
  lastUpdated: string
  newWindowHours: number
  totalMemories: number
  wings: {
    people: WingData
    projects: WingData
    stories: WingData
    preferences: WingData
  }
}

export type WingKey = 'people' | 'projects' | 'stories' | 'preferences'

export interface WingConfig {
  key: WingKey
  label: string
  position: [number, number, number]
  color: string
  emissive: string
  type: 'tower' | 'spire' | 'lodge' | 'library'
}

/** Enriches manifest: marks 10% of entries as isNew (deterministic per day) */
export function enrichManifest(raw: PalaceManifest): PalaceManifest {
  const today = new Date().toDateString()
  const dateSeed = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

  const enrichWing = (wing: WingData): WingData => ({
    ...wing,
    entries: wing.entries.map(e => {
      const idNum = parseInt(e.id.replace(/\D/g, '') || '0', 10)
      return { ...e, isNew: (idNum + dateSeed) % 10 === 0 }
    }),
  })

  return {
    ...raw,
    wings: {
      people: enrichWing(raw.wings.people),
      projects: enrichWing(raw.wings.projects),
      stories: enrichWing(raw.wings.stories),
      preferences: enrichWing(raw.wings.preferences),
    },
  }
}
