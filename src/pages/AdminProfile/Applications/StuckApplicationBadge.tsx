import React from 'react'

import {
  followUpCaption,
  stuckBadge,
} from '@/features/admin/applicationFollowUp'
import { StuckApplicationSummary } from '@/features/admin/types'

import styles from '../Onboarding/Onboarding.module.scss'

type StuckApplicationBadgeProps = {
  summary?: StuckApplicationSummary | null
}

export const StuckApplicationBadge = ({
  summary,
}: StuckApplicationBadgeProps) => {
  if (!summary) return <span className={styles.muted}>—</span>
  const { label, tone } = stuckBadge(summary.stage)
  const caption = followUpCaption(summary)
  return (
    <div className={styles.badgeCell}>
      <span className={`${styles.badge} ${styles[tone]}`}>{label}</span>
      {caption && <span className={styles.caption}>{caption}</span>}
    </div>
  )
}
