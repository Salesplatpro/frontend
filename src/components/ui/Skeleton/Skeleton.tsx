import cn from 'classnames'
import React from 'react'

import styles from './Skeleton.module.scss'

type SkeletonProps = {
  width?: string | number
  height?: string | number
  className?: string
}

export const Skeleton = ({
  width = '100%',
  height = '1rem',
  className,
}: SkeletonProps) => (
  <div
    aria-hidden
    className={cn(styles.skeleton, className)}
    style={{ width, height }}
  />
)
