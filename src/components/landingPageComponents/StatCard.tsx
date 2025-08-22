import React from 'react'

import styles from './styles/StatCard.module.scss'
import { BaseText } from './typography'

type StatCardProps = {
  percentage: string
  description: string
}

export const StatCard = ({ percentage, description }: StatCardProps) => (
  <div className={styles.statCard}>
    <BaseText fontSize="fs-4xl" fontColor="white" fontWeight="bolder">
      {percentage}
    </BaseText>
    <BaseText className="flex-wrap" fontColor="white" fontSize="fs-md">
      {description}
    </BaseText>
  </div>
)
