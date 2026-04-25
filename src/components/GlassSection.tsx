import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  id?: string
}

export function GlassSection({ children, className = '', id }: Props) {
  return (
    <section id={id} className={`glass-section ${className}`.trim()}>
      {children}
    </section>
  )
}
