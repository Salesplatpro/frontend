import React, { useState } from 'react'

import styles from './VerdictBadge.module.scss'

export type Verdict = 'high' | 'medium' | 'low'

interface VerdictBadgeProps {
  /** null once the recruiter has no verdict yet — pass `pending` to show an "Analyzing" state instead of nothing. */
  verdict: Verdict | null
  /** The AI's explanation for the verdict — recruiter-only, expandable on demand. */
  reasoning?: string | null
  /** True once the pipeline is complete but the verdict hasn't been generated yet. */
  pending?: boolean
  /** Small pill-only variant for table cells — no reasoning toggle. */
  compact?: boolean
}

const LABELS: Record<Verdict, string> = {
  high: 'High Match',
  medium: 'Medium Match',
  low: 'Low Match',
}

export const VerdictBadge = ({
  verdict,
  reasoning,
  pending,
  compact,
}: VerdictBadgeProps) => {
  const [expanded, setExpanded] = useState(false)

  if (!verdict) {
    if (!pending) return null
    return (
      <div className={`${styles.badge} ${styles.analyzing}`}>
        <span className={styles.pulse} />
        Analyzing match…
      </div>
    )
  }

  const pill = (
    <div className={`${styles.badge} ${styles[verdict]}`}>
      {LABELS[verdict]}
    </div>
  )

  if (compact || !reasoning) return pill

  return (
    <div className={styles.container}>
      {pill}
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}>
        {expanded ? 'Hide reasoning' : 'Why?'}
      </button>
      {expanded && <p className={styles.reasoning}>{reasoning}</p>}
    </div>
  )
}
