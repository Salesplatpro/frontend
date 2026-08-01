import React, { useState } from 'react'

import styles from './VerdictBadge.module.scss'

export type Verdict = 'high' | 'medium' | 'low'
export type Recommendation = 'hire' | 'interview_further' | 'no_hire'

interface VerdictBadgeProps {
  /** null once the recruiter has no verdict yet — pass `pending` to show an "Analyzing" state instead of nothing. */
  verdict: Verdict | null
  /** The AI's explanation for the verdict — recruiter-only, expandable on demand. Shown only when no itemized strengths/weaknesses/risks are available (older verdicts). */
  reasoning?: string | null
  /** Evidence-based itemized lists, each citing something specific from the candidate's profile. */
  strengths?: string[] | null
  weaknesses?: string[] | null
  risks?: string[] | null
  /** The AI's hire/no-hire recommendation for this candidate. */
  recommendation?: Recommendation | null
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

const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  hire: 'Recommend: Hire',
  interview_further: 'Recommend: Interview Further',
  no_hire: 'Recommend: No Hire',
}

export const VerdictBadge = ({
  verdict,
  reasoning,
  strengths,
  weaknesses,
  risks,
  recommendation,
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

  const hasEvidence =
    (strengths && strengths.length > 0) ||
    (weaknesses && weaknesses.length > 0) ||
    (risks && risks.length > 0)

  if (compact || (!reasoning && !hasEvidence)) return pill

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
      {expanded && (
        <div className={styles.evidence}>
          {recommendation && (
            <p className={styles.recommendation}>
              {RECOMMENDATION_LABELS[recommendation]}
            </p>
          )}
          {hasEvidence ? (
            <>
              <EvidenceList label="Strengths" items={strengths} />
              <EvidenceList label="Weaknesses" items={weaknesses} />
              <EvidenceList label="Risks" items={risks} />
            </>
          ) : (
            <p className={styles.reasoning}>{reasoning}</p>
          )}
        </div>
      )}
    </div>
  )
}

const EvidenceList = ({
  label,
  items,
}: {
  label: string
  items?: string[] | null
}) => {
  if (!items || items.length === 0) return null
  return (
    <div className={styles.evidenceSection}>
      <p className={styles.evidenceLabel}>{label}</p>
      <ul className={styles.evidenceItems}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
