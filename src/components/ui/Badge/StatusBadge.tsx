import React from 'react'

import styles from './StatusBadge.module.scss'

type StatusBadgeProps = {
  status: string
  backgroundColor?: string
  color?: string
  showDot?: boolean
}

export const StatusBadge = ({
  status,
  backgroundColor,
  color,
  showDot,
}: StatusBadgeProps) => {
  return (
    <div
      className={styles.statusBadge}
      style={{ background: backgroundColor, color }}>
      {showDot && <span className={styles.dot} style={{ background: color }} />}
      {status}
    </div>
  )
}
