import cn from 'classnames'
import React, { ReactNode } from 'react'

import styles from './Heading.module.scss'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

type HeadingProps = {
  children: ReactNode
  level?: HeadingLevel
  className?: string
}

const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

export const Heading = ({ children, level = 1, className }: HeadingProps) => {
  const Component = tags[level - 1]

  return (
    <Component className={cn(styles.heading, styles[`h${level}`], className)}>
      {children}
    </Component>
  )
}
