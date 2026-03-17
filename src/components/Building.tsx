import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { WingKey } from '../types'
import ModelBuilding from './ModelBuilding'

interface BuildingProps {
  position: [number, number, number]
  size: number
  wingType: WingKey
  isNew?: boolean
  label: string
  animationDelay?: number
  introComplete: boolean
  onHover: (label: string | null) => void
}

const DROP_HEIGHT = 25
const FALL_DURATION = 0.8
const SQUASH_DURATION = 0.3

export default function Building({
  position,
  size,
  wingType,
  isNew,
  label,
  animationDelay = 0,
  introComplete: _introComplete,
  onHover,
}: BuildingProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [, setIsHovered] = useState(false)

  // Animation state — captured at mount, never re-evaluated
  const animState = useRef<'waiting' | 'falling' | 'squashing' | 'pulsing' | 'done'>('done')
  const animTime = useRef(0)
  const shouldAnimateRef = useRef(!!isNew)
  const shouldAnimate = shouldAnimateRef.current

  useEffect(() => {
    if (shouldAnimate) {
      animState.current = 'waiting'
      const timer = setTimeout(() => {
        animState.current = 'falling'
        animTime.current = 0
      }, animationDelay * 1000 + 1500)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (shouldAnimate && groupRef.current) {
      groupRef.current.position.y = position[1] + DROP_HEIGHT
      groupRef.current.visible = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const g = groupRef.current

    switch (animState.current) {
      case 'waiting':
        g.visible = false
        break

      case 'falling': {
        g.visible = true
        animTime.current += delta
        const t = Math.min(animTime.current / FALL_DURATION, 1)
        const eased = t * t * t
        const yOffset = DROP_HEIGHT * (1 - eased)
        g.position.y = position[1] + yOffset

        if (t >= 1) {
          g.position.y = position[1]
          animState.current = 'squashing'
          animTime.current = 0
        }
        break
      }

      case 'squashing': {
        animTime.current += delta
        const t = Math.min(animTime.current / SQUASH_DURATION, 1)

        let sx: number, sy: number
        if (t < 0.3) {
          const st = t / 0.3
          sx = 1 + 0.3 * st
          sy = 1 - 0.4 * st
        } else {
          const st = (t - 0.3) / 0.7
          const spring = Math.sin(st * Math.PI) * 0.08
          sx = 1.3 - 0.3 * st + spring
          sy = 0.6 + 0.4 * st - spring
        }
        g.scale.set(sx, sy, sx)

        if (t >= 1) {
          g.scale.set(1, 1, 1)
          animState.current = 'done'
          animTime.current = 0
        }
        break
      }

      case 'done':
        break
    }
  })

  const handlePointerOver = (e: THREE.Event) => {
    (e as unknown as { stopPropagation: () => void }).stopPropagation()
    setIsHovered(true)
    onHover(label)
    document.body.style.cursor = 'pointer'
  }
  const handlePointerOut = () => {
    setIsHovered(false)
    onHover(null)
    document.body.style.cursor = 'default'
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <ModelBuilding wingType={wingType} size={size} id={label} />
    </group>
  )
}
