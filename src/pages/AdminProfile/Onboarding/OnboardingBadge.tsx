import React from 'react'

import { followUpCaption, stageBadge } from '@/features/admin/onboarding'
import { OnboardingSummary } from '@/features/admin/types'

import styles from './Onboarding.module.scss'

type OnboardingBadgeProps = {
  summary?: OnboardingSummary | null
}

export const OnboardingBadge = ({ summary }: OnboardingBadgeProps) => {
  if (!summary) return <span className={styles.muted}>—</span>
  const { label, tone } = stageBadge(summary.stage)
  const caption = followUpCaption(summary)
  return (
    <div className={styles.badgeCell}>
      <span className={`${styles.badge} ${styles[tone]}`}>{label}</span>
      {caption && <span className={styles.caption}>{caption}</span>}
    </div>
  )
}
