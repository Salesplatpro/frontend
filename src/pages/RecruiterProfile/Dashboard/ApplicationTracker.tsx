import React from 'react'

import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Typography'

import ProgressBar from '../../../utils/ProgressBar'
import styles from './ApplicationTracker.module.scss'
import { DashboardStats } from './types'

interface StatsType {
  infoData?: DashboardStats
}

const ApplicationTracker: React.FC<StatsType> = ({ infoData }) => {
  const tiles = [
    {
      key: 'campaigns',
      label: 'Campaigns',
      amount: infoData?.campaignCount ?? 0,
      showRatio: true,
      variant: 'primary' as const,
    },
    {
      key: 'applications',
      label: 'Applications',
      amount: infoData?.applicationsCount ?? 0,
      showRatio: false,
      variant: 'subtle' as const,
    },
    {
      key: 'shortlists',
      label: 'Shortlists',
      amount: infoData?.shortlistCount ?? 0,
      showRatio: false,
      variant: 'primary' as const,
    },
  ]

  return (
    <div className={styles.trackerRow}>
      {tiles.map((tile) => (
        <Card
          key={tile.key}
          className={`${styles.tile} ${styles[tile.variant]}`}>
          <div>
            <Text
              size="fs-sm"
              color={tile.variant === 'primary' ? 'white' : 'secondary'}>
              {tile.label}
            </Text>
            <Text
              size="fs-2xl"
              weight="bolder"
              color={tile.variant === 'primary' ? 'white' : 'secondary'}>
              {tile.amount}
            </Text>
          </div>
          {tile.showRatio && (
            <ProgressBar
              percentage={infoData?.completionRatio ?? 0}
              textColor="var(--color-white)"
              pathColor="var(--color-white)"
              trailColor="rgba(255,255,255,0.4)"
              size={50}
            />
          )}
        </Card>
      ))}
    </div>
  )
}

export default ApplicationTracker
