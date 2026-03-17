import { useEffect, useState } from 'react'
import type { PalaceManifest } from '../types'

interface UIProps {
  manifest: PalaceManifest
  hoveredLabel: string | null
  introComplete: boolean
  onSkipIntro: () => void
}

type IntroPhase = 'loading' | 'text' | 'building' | 'done'

export default function UI({ manifest, hoveredLabel, introComplete, onSkipIntro }: UIProps) {
  const [introPhase, setIntroPhase] = useState<IntroPhase>('loading')
  const [showSkip, setShowSkip] = useState(true)

  useEffect(() => {
    if (introComplete) {
      setIntroPhase('done')
      return
    }
    const t1 = setTimeout(() => setIntroPhase('text'), 800)
    const t2 = setTimeout(() => setIntroPhase('building'), 2800)
    const t3 = setTimeout(() => { setIntroPhase('done'); setShowSkip(false) }, 9000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [introComplete])

  useEffect(() => {
    if (introComplete) setIntroPhase('done')
  }, [introComplete])

  // Format lastUpdated as "today", "yesterday", or a date
  const lastUpdatedLabel = (() => {
    const d = new Date(manifest.lastUpdated)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })()

  const handleKeySkip = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !introComplete) onSkipIntro()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeySkip)
    return () => window.removeEventListener('keydown', handleKeySkip)
  })

  const wingLabels: Record<string, { dir: string; color: string; name: string }> = {
    people: { dir: 'N', color: '#c4a882', name: 'Connections' },
    projects: { dir: 'E', color: '#6ab0d4', name: 'Career & Life' },
    stories: { dir: 'S', color: '#d4b06a', name: 'Mind & Self' },
    preferences: { dir: 'W', color: '#8a8aaa', name: 'Style & Habits' },
  }

  return (
    <>
      {/* Top-left title */}
      <div className="ui-panel title-panel">
        <div className="palace-title">Identity Palace</div>
        <div className="palace-subtitle">21 dimensions of self</div>
      </div>

      {/* Top-right stats */}
      <div className="ui-panel stats-panel">
        <div className="stat-line">
          <span className="stat-num">{manifest.totalMemories.toLocaleString()}</span>
          <span className="stat-label">memories</span>
        </div>
        <div className="stat-line">
          <span className="stat-num">4</span>
          <span className="stat-label">wings</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-date">Updated {lastUpdatedLabel}</div>
      </div>

      {/* Bottom compass */}
      <div className="ui-panel compass-panel">
        {Object.entries(wingLabels).map(([key, { dir, color, name }]) => (
          <div key={key} className="compass-item">
            <span className="compass-dir" style={{ color }}>{dir}</span>
            <span className="compass-name">{name}</span>
          </div>
        ))}
      </div>

      {/* Hover label */}
      {hoveredLabel && (
        <div className="hover-label">
          <div className="hover-label-inner">
            <div className="hover-orb" />
            {hoveredLabel}
          </div>
        </div>
      )}

      {/* Intro overlay */}
      {introPhase !== 'done' && (
        <div
          className={`intro-overlay ${introPhase === 'loading' ? 'fade-out-slow' : ''}`}
          onClick={() => onSkipIntro()}
        >
          {introPhase === 'text' && (
            <div className="intro-text fade-in-up">
              <div className="intro-headline">Your identity, in architecture.</div>
              <div className="intro-sub">
            {manifest.totalMemories} insights across 21 dimensions
          </div>
            </div>
          )}
          {introPhase === 'building' && (
            <div className="intro-text fade-in-up">
              <div className="intro-headline">Constructing your palace...</div>
            </div>
          )}
          {showSkip && (
            <div className="skip-hint">press space or click to skip</div>
          )}
        </div>
      )}

      {/* Wing labels in 3D space (simplified as fixed corners) */}
      <div className="wing-labels">
        <div className="wing-label" style={{ top: '38%', left: '50%', transform: 'translateX(-50%)' }}>
          <span style={{ color: '#c4a882' }}>◆</span> Connections
        </div>
        <div className="wing-label" style={{ top: '53%', right: '15%' }}>
          <span style={{ color: '#6ab0d4' }}>◆</span> Career & Life
        </div>
        <div className="wing-label" style={{ top: '68%', left: '50%', transform: 'translateX(-50%)' }}>
          <span style={{ color: '#d4b06a' }}>◆</span> Mind & Self
        </div>
        <div className="wing-label" style={{ top: '53%', left: '15%' }}>
          <span style={{ color: '#8a8aaa' }}>◆</span> Style & Habits
        </div>
      </div>
    </>
  )
}
