import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

export function GradientHeading({ children, as: Tag = 'h2', className = '' }: Props) {
  return (
    <Tag className={`gradient-heading ${className}`.trim()}>{children}</Tag>
  )
}
