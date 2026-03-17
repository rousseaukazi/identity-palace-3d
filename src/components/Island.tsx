import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('./models/tree-large.glb')
useGLTF.preload('./models/tree-small.glb')
useGLTF.preload('./models/rocks-large.glb')
useGLTF.preload('./models/fountain-round.glb')

function SceneModel({ path, position, scale, rotation }: {
  path: string; position: [number, number, number]; scale?: number; rotation?: [number, number, number]
}) {
  const { scene } = useGLTF(path)
  const clone = useMemo(() => scene.clone(), [scene])
  return <primitive object={clone} position={position} scale={scale ?? 1} rotation={rotation} />
}

export default function Island() {
  const groundGeom = useMemo(() => {
    const points = []
    for (let i = 0; i <= 20; i++) {
      const t = i / 20
      const r = 18 + Math.sin(t * Math.PI * 3) * 2.5 + Math.cos(t * Math.PI * 5) * 1.2
      points.push(new THREE.Vector2(r * (1 - t * 0.15), -t * 4.5))
    }
    points.push(new THREE.Vector2(0, -5))
    return new THREE.LatheGeometry(points, 32)
  }, [])

  // Deterministic tree positions — avoid wing paths (N/E/S/W corridors)
  const trees = useMemo(() => {
    const positions: { pos: [number, number, number]; large: boolean; scale: number; rot: number }[] = []
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2 + 0.35 // offset to avoid axis-aligned wing paths
      // Skip trees too close to wing corridors (every 90°)
      const nearWingPath = [0, Math.PI/2, Math.PI, Math.PI*1.5].some(
        a => Math.abs(((angle % (Math.PI*2)) - a + Math.PI) % (Math.PI*2) - Math.PI) < 0.35
      )
      if (nearWingPath) continue

      const r = 6 + Math.sin(i * 5.3) * 3 + Math.cos(i * 3.1) * 2
      if (r < 4 || r > 15) continue
      positions.push({
        pos: [Math.cos(angle) * r, 0.05, Math.sin(angle) * r],
        large: i % 3 !== 0,
        scale: 0.8 + Math.sin(i * 2.7) * 0.3,
        rot: (i * 1.7) % (Math.PI * 2),
      })
    }
    return positions
  }, [])

  return (
    <group position={[0, -0.5, 0]}>
      {/* Main island body */}
      <mesh geometry={groundGeom} receiveShadow>
        <meshToonMaterial color="#2d4a2d" emissive="#1a3a1a" emissiveIntensity={0.1} />
      </mesh>

      {/* Top grass layer */}
      <mesh receiveShadow position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[17, 48]} />
        <meshToonMaterial color="#3a6a3a" emissive="#1a4a1a" emissiveIntensity={0.15} />
      </mesh>

      {/* Stone path rings */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7, 7.5, 48]} />
        <meshToonMaterial color="#888898" emissive="#4444aa" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13, 13.5, 48]} />
        <meshToonMaterial color="#888898" emissive="#4444aa" emissiveIntensity={0.08} />
      </mesh>

      {/* Edge rocks (procedural) */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2
        const r = 16 + Math.sin(i * 3.7) * 0.8
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0.1, Math.sin(angle) * r]} castShadow>
            <dodecahedronGeometry args={[0.3 + Math.sin(i * 2.1) * 0.1, 0]} />
            <meshToonMaterial color="#666676" emissive="#222233" emissiveIntensity={0.05} />
          </mesh>
        )
      })}

      {/* GLTF trees scattered across the island */}
      {trees.map((t, i) => (
        <SceneModel
          key={`tree-${i}`}
          path={t.large ? './models/tree-large.glb' : './models/tree-small.glb'}
          position={t.pos}
          scale={t.scale}
          rotation={[0, t.rot, 0]}
        />
      ))}

      {/* Central fountain */}
      <SceneModel path="./models/fountain-round.glb" position={[0, 0.1, 0]} scale={1.2} />

      {/* Underside mist */}
      {[0.5, 1.5, 2.5].map((d, i) => (
        <mesh key={i} position={[0, -d - 0.2, 0]} rotation={[-Math.PI / 2, 0, i * 0.4]}>
          <circleGeometry args={[14 - i * 2, 24]} />
          <meshBasicMaterial color="#1a1a3a" transparent opacity={0.4 - i * 0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}
