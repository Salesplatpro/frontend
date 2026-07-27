import React from 'react'

import ProgressBar from '../../../utils/ProgressBar'
import type { Verdict } from '../VerdictBadge/VerdictBadge'
import styles from './MatchScoreRing.module.scss'

interface MatchScoreRingProps {
  verdict: Verdict | null
  averageScore: number | null
}

const LABELS: Record<Verdict, string> = {
  high: 'Strong Match',
  medium: 'Good Match',
  low: 'Weak Match',
}

const COLORS: Record<Verdict, { path: string; trail: string }> = {
  high: { path: 'var(--color-success)', trail: 'rgba(27, 123, 68, 0.12)' },
  medium: { path: 'var(--color-warning)', trail: 'rgba(181, 71, 8, 0.12)' },
  low: { path: 'var(--color-danger)', trail: 'rgba(196, 50, 10, 0.1)' },
}

export const MatchScoreRing = ({
  verdict,
  averageScore,
}: MatchScoreRingProps) => {
  if (!verdict || averageScore == null) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>-%</div>
        <span className={styles.label}>Not Available</span>
      </div>
    )
  }

  const { path, trail } = COLORS[verdict]

  return (
    <div className={styles.container}>
      <ProgressBar
        percentage={averageScore}
        size={48}
        textColor={path}
        pathColor={path}
        trailColor={trail}
      />
      <span className={styles.label}>{LABELS[verdict]}</span>
    </div>
  )
}
