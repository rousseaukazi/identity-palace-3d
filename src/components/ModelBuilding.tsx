import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { WingKey } from '../types'

interface ModelBuildingProps {
  wingType: WingKey
  size: number
  id: string
}

// Preload all models used
useGLTF.preload('./models/tower-square-base.glb')
useGLTF.preload('./models/tower-square-mid.glb')
useGLTF.preload('./models/tower-square-top-roof-high.glb')
useGLTF.preload('./models/tower-square-roof.glb')
useGLTF.preload('./models/tower-hexagon-base.glb')
useGLTF.preload('./models/tower-hexagon-mid.glb')
useGLTF.preload('./models/tower-hexagon-roof.glb')
useGLTF.preload('./models/tower-hexagon-top-wood.glb')
useGLTF.preload('./models/tower-slant-roof.glb')
useGLTF.preload('./models/wall-wood.glb')
useGLTF.preload('./models/wall-wood-door.glb')
useGLTF.preload('./models/wall-wood-window-shutters.glb')
useGLTF.preload('./models/wall.glb')
useGLTF.preload('./models/wall-window-stone.glb')
useGLTF.preload('./models/wall-door.glb')
useGLTF.preload('./models/roof-high-gable.glb')
useGLTF.preload('./models/roof-gable.glb')
useGLTF.preload('./models/flag-pennant.glb')

function Model({ path, position, rotation, scale }: {
  path: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}) {
  const { scene } = useGLTF(path)
  const clone = useMemo(() => scene.clone(), [scene])
  return (
    <primitive
      object={clone}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}

// Castle square tower (for people wing)
function SquareTower({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <Model path="./models/tower-square-base.glb" position={[0, 0, 0]} />
      <Model path="./models/tower-square-mid.glb" position={[0, 1, 0]} />
      <Model path="./models/tower-square-top-roof-high.glb" position={[0, 2, 0]} />
      <Model path="./models/flag-pennant.glb" position={[0, 3.3, 0]} />
    </group>
  )
}

// Castle hexagonal tower (for projects wing)
function HexTower({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <Model path="./models/tower-hexagon-base.glb" position={[0, 0, 0]} />
      <Model path="./models/tower-hexagon-mid.glb" position={[0, 1, 0]} />
      <Model path="./models/tower-hexagon-roof.glb" position={[0, 2, 0]} />
    </group>
  )
}

// Wood cottage (for stories wing) — 4 walls + gabled roof
function WoodCottage({ scale, variant }: { scale: number; variant: number }) {
  const wallY = 0
  const roofY = 1.0
  return (
    <group scale={scale}>
      {/* Front wall with door */}
      <Model path="./models/wall-wood-door.glb" position={[0, wallY, -1]} rotation={[0, 0, 0]} />
      {/* Back wall */}
      <Model path="./models/wall-wood.glb" position={[0, wallY, 1]} rotation={[0, Math.PI, 0]} />
      {/* Left wall */}
      <Model
        path={variant === 0 ? "./models/wall-wood-window-shutters.glb" : "./models/wall-wood.glb"}
        position={[-1, wallY, 0]} rotation={[0, Math.PI / 2, 0]}
      />
      {/* Right wall */}
      <Model
        path={variant === 1 ? "./models/wall-wood-window-shutters.glb" : "./models/wall-wood.glb"}
        position={[1, wallY, 0]} rotation={[0, -Math.PI / 2, 0]}
      />
      {/* Gabled roof */}
      <Model path="./models/roof-high-gable.glb" position={[0, roofY, 0]} />
    </group>
  )
}

// Stone library (for preferences wing) — stone walls + flat gable roof
function StoneHouse({ scale, variant }: { scale: number; variant: number }) {
  const wallY = 0
  const roofY = 1.0
  return (
    <group scale={scale}>
      {/* Front wall with door */}
      <Model path="./models/wall-door.glb" position={[0, wallY, -1]} rotation={[0, 0, 0]} />
      {/* Back wall */}
      <Model path="./models/wall.glb" position={[0, wallY, 1]} rotation={[0, Math.PI, 0]} />
      {/* Left wall with window */}
      <Model
        path={variant === 0 ? "./models/wall-window-stone.glb" : "./models/wall.glb"}
        position={[-1, wallY, 0]} rotation={[0, Math.PI / 2, 0]}
      />
      {/* Right wall */}
      <Model path="./models/wall.glb" position={[1, wallY, 0]} rotation={[0, -Math.PI / 2, 0]} />
      {/* Gable roof */}
      <Model path="./models/roof-gable.glb" position={[0, roofY, 0]} />
    </group>
  )
}

export default function ModelBuilding({ wingType, size, id }: ModelBuildingProps) {
  const idNum = parseInt(id.replace(/\D/g, '') || '0', 10)
  const variant = idNum % 3

  switch (wingType) {
    case 'people':
      return variant < 2
        ? <SquareTower scale={size * 0.5} />
        : <HexTower scale={size * 0.5} />

    case 'projects':
      return variant < 2
        ? <HexTower scale={size * 0.5} />
        : <SquareTower scale={size * 0.45} />

    case 'stories':
      return <WoodCottage scale={size * 0.4} variant={variant} />

    case 'preferences':
      return <StoneHouse scale={size * 0.4} variant={variant} />

    default:
      return null
  }
}
