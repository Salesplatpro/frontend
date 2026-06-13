import React from 'react'

import styles from './StatusBadge.module.scss'

type StatusBadgeProps = {
  status: string
  backgroundColor?: string
  color?: string
}

export const StatusBadge = ({
  status,
  backgroundColor,
  color,
}: StatusBadgeProps) => {
  return (
    <div
      className={styles.statusBadge}
      style={{ background: backgroundColor, color }}>
      {status}
    </div>
  )
}
