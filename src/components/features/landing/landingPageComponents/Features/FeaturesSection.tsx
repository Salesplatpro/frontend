import cn from 'classnames'
import React from 'react'

import { Text } from '@/components/ui/Typography'

import { FeatureDataType } from './Features'
import styles from './Features.module.scss'

type FeatureSectionProps = {
  header: string
  data: FeatureDataType[]
}

export const FeaturesSection = ({ header, data }: FeatureSectionProps) => {
  return (
    <div
      className={cn(
        styles.wrapper,
        'flex flex-col gap-4 justify-center md:gap-9 items-start px-8 md:px-24 py-12 md:py-24',
      )}
    >
      <Text size="fs-2xl" weight="bolder">
        {header}
      </Text>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full place-items-center md:place-items-stretch">
        {data.map(({ title, description }) => (
          <div key={title} className={styles.moreFeatures}>
            <Text size="fs-xl" weight="bolder">
              {title}
            </Text>
            <Text size="fs-xl">{description}</Text>
          </div>
        ))}
      </div>
    </div>
  )
}
