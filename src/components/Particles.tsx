import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 200

export default function Particles() {
  const meshRef = useRef<THREE.Points>(null)

  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * 11
      positions[i * 3] = Math.cos(angle) * r
      positions[i * 3 + 1] = Math.random() * 12 - 1
      positions[i * 3 + 2] = Math.sin(angle) * r

      velocities[i * 3] = (Math.random() - 0.5) * 0.005
      velocities[i * 3 + 1] = 0.01 + Math.random() * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005

      sizes[i] = Math.random() * 0.06 + 0.02
    }

    return { positions, velocities, sizes }
  }, [])

  const positionAttr = useRef(new THREE.BufferAttribute(positions.slice(), 3))

  useFrame(() => {
    const pos = positionAttr.current.array as Float32Array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] += velocities[i * 3]
      pos[i * 3 + 1] += velocities[i * 3 + 1]
      pos[i * 3 + 2] += velocities[i * 3 + 2]

      // Drift slightly
      velocities[i * 3] += (Math.random() - 0.5) * 0.0008
      velocities[i * 3 + 2] += (Math.random() - 0.5) * 0.0008

      // Clamp drift
      velocities[i * 3] *= 0.98
      velocities[i * 3 + 2] *= 0.98

      // Reset if too high
      if (pos[i * 3 + 1] > 12) {
        const angle = Math.random() * Math.PI * 2
        const r = Math.random() * 10
        pos[i * 3] = Math.cos(angle) * r
        pos[i * 3 + 1] = -1
        pos[i * 3 + 2] = Math.sin(angle) * r
      }
    }
    positionAttr.current.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" {...positionAttr.current} args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color="#cc99ff"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
