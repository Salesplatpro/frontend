import cn from 'classnames'
import React, { ReactNode } from 'react'

import styles from './Card.module.scss'

type CardProps = {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => (
  <div className={cn(styles.card, className)}>{children}</div>
)
