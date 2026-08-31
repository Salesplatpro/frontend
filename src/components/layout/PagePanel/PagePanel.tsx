import React from 'react'
import { Link } from 'react-router-dom'

import styles from './PagePanel.module.scss'

type PagePanelProps = {
  children: React.ReactNode
  title?: React.ReactNode
  hint?: React.ReactNode
  action?: React.ReactNode
  actionTo?: string
  actionLabel?: string
  flush?: boolean
  className?: string
}

export const PagePanel: React.FC<PagePanelProps> = ({
  children,
  title,
  hint,
  action,
  actionTo,
  actionLabel,
  flush = false,
  className,
}) => {
  const hasHeader = title || hint || action || actionTo

  return (
    <section
      className={[styles.panel, flush ? styles.flush : '', className]
        .filter(Boolean)
        .join(' ')}>
      {hasHeader ? (
        <div className={styles.header}>
          <div>
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            {hint ? <p className={styles.hint}>{hint}</p> : null}
          </div>
          {actionTo && actionLabel ? (
            <Link className={styles.link} to={actionTo}>
              {actionLabel}
            </Link>
          ) : (
            action
          )}
        </div>
      ) : null}
      {children}
    </section>
  )
}

type StatGridProps = {
  children: React.ReactNode
  columns?: 3 | 4
}

export const StatGrid: React.FC<StatGridProps> = ({
  children,
  columns = 3,
}) => (
  <div
    className={
      columns === 4
        ? `${styles.statsGrid} ${styles.statsGridFour}`
        : styles.statsGrid
    }>
    {children}
  </div>
)

type StatCardProps = {
  icon?: React.ReactNode
  value: React.ReactNode
  label: string
  caption?: React.ReactNode
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  caption,
}) => (
  <div className={styles.statCard}>
    {icon ? <span className={styles.statIcon}>{icon}</span> : null}
    <span className={styles.statValue}>{value}</span>
    {caption ? <span className={styles.statCaption}>{caption}</span> : null}
    <span className={styles.statLabel}>{label}</span>
  </div>
)
