import cn from 'classnames'
import React, { ReactNode } from 'react'

import styles from './Alert.module.scss'

type AlertVariant = 'success' | 'error' | 'info' | 'warning'

type AlertProps = {
  variant?: AlertVariant
  children: ReactNode
  className?: string
}

export const Alert = ({
  variant = 'info',
  children,
  className,
}: AlertProps) => (
  <div role="alert" className={cn(styles.alert, styles[variant], className)}>
    {children}
  </div>
)
