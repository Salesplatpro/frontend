import React from 'react'

import { Text } from '@/components/ui/Typography'

import styles from './styles/StatCard.module.scss'

type StatCardProps = {
  percentage: string
  description: string
}

export const StatCard = ({ percentage, description }: StatCardProps) => (
  <div className={styles.statCard}>
    <Text size="fs-4xl" color="white" weight="bolder" className="font-raleway">
      {percentage}
    </Text>
    <Text color="white" size="fs-md" className="font-raleway flex-wrap">
      {description}
    </Text>
  </div>
)
