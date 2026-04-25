import { useEffect } from 'react'

export function MouseGlow() {
  useEffect(() => {
    const root = document.documentElement
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      root.style.setProperty('--mouse-x', `${x}%`)
      root.style.setProperty('--mouse-y', `${y}%`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div
      className="mouse-glow"
      aria-hidden
    />
  )
}
