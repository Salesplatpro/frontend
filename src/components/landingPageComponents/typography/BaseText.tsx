import cn from 'classnames'
import React from 'react'
import { ReactNode } from 'react'

import styles from '../styles/Text.module.scss'

type BaseTextProps = {
  children: ReactNode
  fontSize?:
    | 'fs-xs'
    | 'fs-sm'
    | 'fs-md'
    | 'fs-lg'
    | 'fs-xl'
    | 'fs-2xl'
    | 'fs-3xl'
    | 'fs-4xl'
  fontColor?: 'default' | 'primary' | 'tag' | 'secondary' | 'white'
  fontWeight?: 'normal' | 'bold' | 'bolder'
  onClick?: () => void
  className?: string
}

export const BaseText = ({
  children,
  fontSize = 'fs-md',
  fontColor = 'default',
  fontWeight = 'normal',
  onClick = () => {},
  className,
}: BaseTextProps) => {
  const fontsize = styles[fontSize]
  const fontcolor = styles[fontColor]
  const fontweight = styles[fontWeight]

  return (
    <div
      className={cn(fontsize, fontcolor, fontweight, className)}
      onClick={onClick}>
      {children}
    </div>
  )
}
