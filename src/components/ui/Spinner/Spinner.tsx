import cn from 'classnames'
import React from 'react'

import styles from './Spinner.module.scss'

type SpinnerSize = 'sm' | 'md' | 'lg'

type SpinnerProps = {
  size?: SpinnerSize
  fullPage?: boolean
  className?: string
}

export const Spinner = ({
  size = 'lg',
  fullPage = false,
  className,
}: SpinnerProps) => (
  <div className={cn(styles.container, fullPage && styles.fullPage, className)}>
    <div className={cn(styles.spinner, styles[size])} />
  </div>
)
