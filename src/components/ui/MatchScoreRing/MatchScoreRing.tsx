import React from 'react'

import ProgressBar from '../../../utils/ProgressBar'
import type { Verdict } from '../VerdictBadge/VerdictBadge'
import styles from './MatchScoreRing.module.scss'

interface MatchScoreRingProps {
  verdict: Verdict | null
  /** The AI's overall fit score (0-100) — the real "AI Match" number. Always preferred once the verdict has finished generating. */
  overallFitScore?: number | null
  averageScore: number | null
  /** Early-pipeline CV similarity percent — shown only while the AI verdict is still pending, clearly labeled as such so it's never mistaken for the finished AI match. */
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
  overallFitScore,
  averageScore,
  cvSimilarityScore,
  failed,
  currentStage,
}: MatchScoreRingProps) => {
  // The finished AI match score always wins once it exists. Before that, fall
  // back to whatever early-pipeline signal is available so the cell isn't
  // blank — but label it clearly as a screening-stage number, never "AI Match".
  const hasAiScore = overallFitScore != null
  const score = hasAiScore
    ? overallFitScore
    : cvSimilarityScore != null
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
      <span className={styles.label}>
        {hasAiScore ? 'AI match' : 'CV match (screening)'}
      </span>
    </div>
  )
}
