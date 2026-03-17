import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload, Sky, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Palace from './components/Palace'
import Particles from './components/Particles'
import Intro from './components/Intro'
import UI from './components/UI'
import type { PalaceManifest } from './types'
import { enrichManifest } from './types'

export default function App() {
  const [manifest, setManifest] = useState<PalaceManifest | null>(null)
  const [introComplete, setIntroComplete] = useState(false)
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)

  useEffect(() => {
    fetch('./palace-manifest.json')
      .then(r => r.json())
      .then(raw => setManifest(enrichManifest(raw)))
      .catch(console.error)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [28, 22, 28], fov: 45, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        shadows
        onPointerMissed={() => setHoveredLabel(null)}
      >
        {/* Scene setup */}
        <color attach="background" args={['#1a0d2e']} />
        <fog attach="fog" args={['#1a0d2e', 50, 130]} />
        <Sky sunPosition={[100, 20, 100]} turbidity={8} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
        <Stars radius={120} depth={60} count={3000} factor={3} saturation={0.5} fade />

        {/* Lighting */}
        <ambientLight intensity={0.4} color="#8899cc" />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.2}
          color="#ffe4aa"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <hemisphereLight args={['#1a1a4a', '#0d0d1f', 0.3]} />
        <pointLight position={[0, 8, 0]} intensity={0.6} color="#aa88ff" distance={30} />

        <Suspense fallback={null}>
          {manifest && (
            <Palace
              manifest={manifest}
              introComplete={introComplete}
              onHover={setHoveredLabel}
            />
          )}
          <Particles />
          {manifest && !introComplete && (
            <Intro
              manifest={manifest}
              onComplete={() => setIntroComplete(true)}
            />
          )}
          <Preload all />
        </Suspense>

        <OrbitControls
          enabled={introComplete}
          minDistance={8}
          maxDistance={90}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={0.2}
          target={[0, 1, 0]}
          enableDamping
          dampingFactor={0.05}
        />

        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            radius={0.4}
          />
        </EffectComposer>
      </Canvas>

      {manifest && (
        <UI
          manifest={manifest}
          hoveredLabel={hoveredLabel}
          introComplete={introComplete}
          onSkipIntro={() => setIntroComplete(true)}
        />
      )}
    </div>
  )
}
