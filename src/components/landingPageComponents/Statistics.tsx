import cn from 'classnames'
import React from 'react'

import { containerPadding } from './landingData'
import { SectionHeader } from './SectionHeader'
import { StatCard } from './StatCard'
import styles from './styles/Statistics.module.scss'
import { BaseText } from './typography'

const stats = [
  {
    value: '60%',
    description: 'Reduction in time to hire',
  },
  {
    value: '70%',
    description: 'Fewer Unqualified Applicants',
  },
  {
    value: '3x',
    description: 'Faster screening and matching',
  },
  {
    value: '50%',
    description: 'Lower Cost per Hire',
  },
  {
    value: '90%',
    description: 'Hiring Team Satisfaction',
  },
]

export const Statistics = () => {
  return (
    <div className={cn(styles.container, 'py-24', containerPadding)}>
      <SectionHeader
        title={
          <BaseText
            fontSize="fs-md"
            fontWeight="bold"
            fontColor="white"
            className="mb-2">
            Why Teams Switch to AuxHR
          </BaseText>
        }
        subTitle={
          <div>
            <BaseText fontSize="fs-3xl" fontColor="white">
              Let the Numbers Talk.
            </BaseText>
            <BaseText fontSize="fs-3xl" fontColor="white">
              AuxHR Doesn’t Just Improve Hiring — It Transforms It
            </BaseText>
          </div>
        }
        variant="secondary"
      />
      <div className="flex flex-wrap justify-center gap-6">
        {stats.map((item) => (
          <StatCard
            key={item.value}
            percentage={item.value}
            description={item.description}
          />
        ))}
      </div>
    </div>
  )
}
