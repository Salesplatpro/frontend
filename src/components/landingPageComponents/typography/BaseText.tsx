import cn from 'classnames'
import React from 'react'
import { ReactNode } from 'react'

import styles from '../styles/Text.module.scss'

type BaseTextProps = {
  children: ReactNode
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  fontColor?: 'default' | 'tag' | 'secondary' | 'white'
  fontWeight?: 'normal' | 'medium' | 'bold'
}

export const BaseText = ({
  children,
  fontSize = 'md',
  fontColor = 'default',
  fontWeight = 'normal',
}: BaseTextProps) => {
  const fontsize = styles[fontSize]
  const fontcolor = styles[fontColor]
  const fontweight = styles[fontWeight]

  return <div className={cn(fontsize, fontcolor, fontweight)}>{children}</div>
}
