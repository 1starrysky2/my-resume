import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { ISourceOptions } from '@tsparticles/engine'

const options: ISourceOptions = {
  fullScreen: { enable: true, zIndex: 0 },
  background: { color: { value: 'transparent' } },
  fpsLimit: 90,
  particles: {
    number: { value: 55, density: { enable: true, width: 1200, height: 1200 } },
    color: { value: ['#3b82f6', '#f472b6', '#e0e7ff', '#7dd3fc'] },
    shape: { type: 'circle' },
    opacity: { value: { min: 0.2, max: 0.55 } },
    size: { value: { min: 0.5, max: 2.8 } },
    links: {
      enable: true,
      distance: 110,
      color: { value: '#93c5fd' },
      opacity: 0.18,
      width: 0.5,
    },
    move: {
      enable: true,
      speed: 0.45,
      direction: 'none',
      outModes: { default: 'bounce' },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' },
    },
    modes: {
      grab: { distance: 140, links: { opacity: 0.35 } },
    },
  },
  detectRetina: true,
}

export function ParticleBackground() {
  const [ready, setReady] = useState(false)
  const id = useMemo(() => 'tsparticles-resume', [])

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setReady(true))
  }, [])

  if (!ready) return null

  return <Particles id={id} className="particle-canvas" options={options} />
}
