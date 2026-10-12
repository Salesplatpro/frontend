import cn from 'classnames'
import React from 'react'
import { HiArrowSmDown, HiArrowSmUp } from 'react-icons/hi'
import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

import styles from './MetricCard.module.scss'

type MetricCardProps = {
  label: string
  value?: string
  hint?: string
  /** Percent change versus the previous period; null when it can't be computed. */
  delta?: number | null
  deltaLabel?: string
  to?: string
  attention?: boolean
  loading?: boolean
}

const DeltaChip = ({ delta, label }: { delta: number; label?: string }) => {
  const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
  const sign = delta > 0 ? '+' : ''
  return (
    <span className={cn(styles.delta, styles[direction])}>
      {direction === 'up' && <HiArrowSmUp aria-hidden size={14} />}
      {direction === 'down' && <HiArrowSmDown aria-hidden size={14} />}
      <span>
        {sign}
        {delta}%
      </span>
      {label && <span className={styles.deltaLabel}>{label}</span>}
    </span>
  )
}

export const MetricCard = ({
  label,
  value,
  hint,
  delta,
  deltaLabel,
  to,
  attention = false,
  loading = false,
}: MetricCardProps) => {
  const body = (
    <Card className={cn(styles.card, attention && styles.attention)}>
      <p className={styles.label}>{label}</p>
      {loading || value === undefined ? (
        <>
          <Skeleton height="2rem" width="60%" />
          <Skeleton height="0.875rem" width="40%" />
        </>
      ) : (
        <>
          <p className={styles.value}>{value}</p>
          {hint && <p className={styles.hint}>{hint}</p>}
          {delta != null && <DeltaChip delta={delta} label={deltaLabel} />}
        </>
      )}
    </Card>
  )

  if (!to) return body
  return (
    <Link to={to} className={styles.link} aria-label={`${label}: view details`}>
      {body}
    </Link>
  )
}
