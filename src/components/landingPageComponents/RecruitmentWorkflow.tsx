import cn from 'classnames'
import React from 'react'

import grid1Image from '../../assets/grid1.png'
import grid2Image from '../../assets/grid2.png'
import grid3Image from '../../assets/grid3.png'
import grid4Image from '../../assets/grid4.png'
import grid5Image from '../../assets/grid5.png'
import { containerPadding } from './landingData'
import { SectionHeader } from './SectionHeader'
import styles from './styles/RecruitmentWorkflow.module.scss'
import { BaseText } from './typography'

const gridItems = [
  {
    text: 'AI-Powered Matching — Precision screening across thousands of profiles.',
    image: grid1Image,
    alt: 'Grid-one',
    style: styles.gridItem1,
    imgClass: 'w-fit-content rounded-br-2xl rounded-bl-2xl',
  },
  {
    text: 'Role-Based Scoring — Dynamic fit scoring based on your unique role and company.',
    image: grid2Image,
    alt: 'Grid-two',
    style: styles.gridItem2,
    imgClass: 'rounded-tr-2xl rounded-br-2xl',
  },
  {
    text: 'Smart Recommendations — Not just resumes — insights.',
    image: grid3Image,
    alt: 'Grid-three',
    style: styles.gridItem3,
    imgClass: 'rounded-tr-2xl rounded-br-2xl',
  },
  {
    text: 'Collaborative Hiring — Tag, comment, and evaluate as a team.',
    image: grid4Image,
    alt: 'Grid-four',
    style: styles.gridItem4,
    imgClass: 'rounded-tr-2xl rounded-br-2xl',
  },
  {
    text: 'Candidate CRM — Track and manage candidates across hiring stages.',
    image: grid5Image,
    alt: 'Grid-five',
    style: styles.gridItem5,
    imgClass: 'rounded-tr-2xl rounded-br-2xl',
  },
]

export const RecruitmentWorkflow = () => {
  return (
    <div className={cn(containerPadding, styles.container)}>
      <SectionHeader
        title="How it works"
        subTitle="Your Recruitment Workflow, Reinvented."
      />
      <div className={styles.gridContainer}>
        {gridItems.map(({ text, image, alt, style, imgClass }, index) => (
          <div key={index} className={cn(styles.gridItem, style)}>
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
