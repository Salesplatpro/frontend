import React from 'react'

import ProgressBar from '../../../utils/ProgressBar'
import type { Verdict } from '../VerdictBadge/VerdictBadge'
import styles from './MatchScoreRing.module.scss'

interface MatchScoreRingProps {
  verdict: Verdict | null
  averageScore: number | null
  /** Recruiter-facing CV match percent — preferred over the qualitative verdict label. */
  cvSimilarityScore?: number | null
  /** True when verdict generation has failed — shown instead of "Not Available". */
  failed?: boolean
  /** The application's screening stage — when set and not 'completed', shows "Screening" if no CV score is ready yet. */
  currentStage?: string
}

const COLORS: Record<Verdict, { path: string; trail: string }> = {
  high: { path: 'var(--color-success)', trail: 'rgba(27, 123, 68, 0.12)' },
  medium: { path: 'var(--color-warning)', trail: 'rgba(181, 71, 8, 0.12)' },
  low: { path: 'var(--color-danger)', trail: 'rgba(196, 50, 10, 0.1)' },
}

const DEFAULT_COLORS = {
  path: 'var(--color-primary)',
  trail: 'rgba(60, 111, 212, 0.12)',
}

export const MatchScoreRing = ({
  verdict,
  averageScore,
  cvSimilarityScore,
  failed,
  currentStage,
}: MatchScoreRingProps) => {
  const score =
    cvSimilarityScore != null
      ? cvSimilarityScore
      : averageScore != null
      ? averageScore
      : null

  if (score == null) {
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

  const { path, trail } = verdict ? COLORS[verdict] : DEFAULT_COLORS

  return (
    <div className={styles.container}>
      <ProgressBar
        percentage={score}
        size={48}
        textColor={path}
        pathColor={path}
        trailColor={trail}
      />
      <span className={styles.label}>CV match</span>
    </div>
  )
}
