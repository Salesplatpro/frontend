import cn from 'classnames'
import React from 'react'

import { BaseText } from '@/components/ui/Typography'

import { containerPadding } from './landingData'
import { SectionHeader } from './SectionHeader'
import styles from './styles/RecruitmentWorkflow.module.scss'
import { HowItWorksType } from './utils'

type RecruitmentWorkflowProps = {
  title?: string
  subTitle: string
  data: HowItWorksType[]
  variant?: 'primary' | 'secondary'
}

export const RecruitmentWorkflow = ({
  title,
  subTitle,
  variant = 'primary',
  data,
}: RecruitmentWorkflowProps) => {
  const bgStyle = styles[variant]

  return (
    <div className={cn(containerPadding, styles.container, bgStyle)}>
      <SectionHeader title={title} subTitle={subTitle} variant={variant} />
      <div className={styles.gridContainer}>
        {data.map(({ text, image, alt, style, imgClass }, index) => (
          <div key={index} className={style}>
            <BaseText fontSize="fs-2xl" fontWeight="bold" className="p-6">
              {text}
            </BaseText>
            <img src={image} alt={alt} className={imgClass} />
          </div>
        ))}
      </div>
    </div>
  )
}
