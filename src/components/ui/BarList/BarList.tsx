import React from 'react'
import { Link } from 'react-router-dom'

import styles from './BarList.module.scss'

export interface BarListItem {
  key: string
  label: string
  value: number
  href?: string
}

type BarListProps = {
  items: BarListItem[]
  ariaLabel: string
  emptyLabel?: string
}

export const BarList = ({
  items,
  ariaLabel,
  emptyLabel = 'No data yet',
}: BarListProps) => {
  const max = Math.max(0, ...items.map((item) => item.value))
  const total = items.reduce((sum, item) => sum + item.value, 0)

  if (total === 0) {
    return <p className={styles.empty}>{emptyLabel}</p>
  }

  return (
    <ul className={styles.list} aria-label={ariaLabel}>
      {items.map((item) => {
        const width = max > 0 ? Math.max((item.value / max) * 100, 0) : 0
        const share = Math.round((item.value / total) * 100)
        const row = (
          <>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.value}>
              {item.value.toLocaleString('en-US')}
              <span className={styles.share}>{share}%</span>
            </span>
            <span className={styles.track} aria-hidden>
              <span className={styles.fill} style={{ width: `${width}%` }} />
            </span>
          </>
        )
        return (
          <li key={item.key}>
            {item.href ? (
              <Link to={item.href} className={styles.row}>
                {row}
              </Link>
            ) : (
              <div className={styles.row}>{row}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
