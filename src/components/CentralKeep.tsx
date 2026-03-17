import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CentralKeep() {
  const crystalRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 0.3
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + Math.sin(t * 1.5) * 0.3
    }
  })

  return (
    <group position={[0, -0.4, 0]}>
      {/* Base platform */}
      <mesh receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[2.2, 2.5, 0.3, 8]} />
        <meshToonMaterial color="#7a6a9a" emissive="#4433aa" emissiveIntensity={0.2} />
      </mesh>

      {/* Main keep body */}
      <mesh castShadow position={[0, 1.6, 0]}>
        <cylinderGeometry args={[1.4, 1.6, 3.0, 8]} />
        <meshToonMaterial color="#9a8abb" emissive="#6655cc" emissiveIntensity={0.25} />
      </mesh>

      {/* Second tier */}
      <mesh castShadow position={[0, 3.5, 0]}>
        <cylinderGeometry args={[1.0, 1.4, 1.0, 8]} />
        <meshToonMaterial color="#aa99cc" emissive="#7766dd" emissiveIntensity={0.3} />
      </mesh>

      {/* Battlements around top */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} castShadow position={[Math.cos(angle) * 1.05, 4.15, Math.sin(angle) * 1.05]}>
            <boxGeometry args={[0.2, 0.3, 0.2]} />
            <meshToonMaterial color="#aa99cc" emissive="#7766dd" emissiveIntensity={0.2} />
          </mesh>
        )
      })}

      {/* Spire */}
      <mesh castShadow position={[0, 5.2, 0]}>
        <coneGeometry args={[0.8, 2.4, 8]} />
        <meshToonMaterial color="#cc99ff" emissive="#9966ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Floating crystal at top */}
      <mesh ref={crystalRef} position={[0, 7.0, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshToonMaterial color="#ddb3ff" emissive="#aa55ff" emissiveIntensity={1.5} transparent opacity={0.9} />
      </mesh>

      {/* Magic light from crystal */}
      <pointLight ref={lightRef} position={[0, 7.0, 0]} color="#aa55ff" intensity={0.8} distance={15} />

      {/* Corner towers */}
      {[[1.4, 0, 0],[- 1.4, 0, 0],[0, 0, 1.4],[0, 0, -1.4]].map(([x, y, z], i) => (
        <group key={i} position={[x, y + 0.3, z]}>
          <mesh castShadow position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.4, 0.45, 2.8, 6]} />
            <meshToonMaterial color="#8877aa" emissive="#5544bb" emissiveIntensity={0.2} />
          </mesh>
          <mesh castShadow position={[0, 3.1, 0]}>
            <coneGeometry args={[0.45, 1.0, 6]} />
            <meshToonMaterial color="#bb99ee" emissive="#7755cc" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Glowing runes on base */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 2.3, 0.32, Math.sin(angle) * 2.3]}>
            <circleGeometry args={[0.15, 6]} />
            <meshToonMaterial color="#aa55ff" emissive="#8833ee" emissiveIntensity={2.0} />
          </mesh>
        )
      })}
    </group>
  )
}
