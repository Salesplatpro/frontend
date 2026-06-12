import React from 'react'

import { BaseText } from '@/components/ui/Typography'

import styles from './styles/StatCard.module.scss'

type StatCardProps = {
  percentage: string
  description: string
}

export const StatCard = ({ percentage, description }: StatCardProps) => (
  <div className={styles.statCard}>
    <BaseText
      fontSize="fs-4xl"
      fontColor="white"
      fontWeight="bolder"
      className="font-raleway"
    >
      {percentage}
    </BaseText>
    <BaseText
      fontColor="white"
      fontSize="fs-md"
      className="font-raleway flex-wrap"
    >
      {description}
    </BaseText>
  </div>
)
