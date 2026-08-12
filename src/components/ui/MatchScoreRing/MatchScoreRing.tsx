import React from 'react'

import ProgressBar from '../../../utils/ProgressBar'
import type { Verdict } from '../VerdictBadge/VerdictBadge'
import styles from './MatchScoreRing.module.scss'

interface MatchScoreRingProps {
  verdict: Verdict | null
  averageScore: number | null
  /** True when verdict generation has failed — shown instead of "Not Available". */
  failed?: boolean
  /** The application's screening stage — when set and not 'completed', shows "Screening" instead of "Not Available" so an in-progress applicant isn't mistaken for a failed AI match. */
  currentStage?: string
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
  failed,
  currentStage,
}: MatchScoreRingProps) => {
  if (!verdict || averageScore == null) {
    if (failed) {
      return (
        <div className={styles.container}>
          <div className={styles.failed}>!</div>
          <span className={styles.failedLabel}>Failed</span>
        </div>
      )
    }
    if (currentStage && currentStage !== 'completed') {
      return (
        <div className={styles.container}>
          <div className={styles.empty}>-%</div>
          <span className={styles.label}>Screening</span>
        </div>
      )
    }
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
