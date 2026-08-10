import featuresDisplay from '@/assets/featuresDisplay.png'
import grid1Image from '@/assets/grid1.png'
import grid2Image from '@/assets/grid2.png'
import grid3Image from '@/assets/grid3.png'
import grid4Image from '@/assets/grid4.png'
import grid5Image from '@/assets/grid5.png'

import styles from '../styles/RecruitmentWorkflow.module.scss'

export type HowItWorksType = Record<
  'text' | 'image' | 'alt' | 'style' | 'imgClass',
  string
>

export const howItWorksData: HowItWorksType[] = [
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
    text: 'Secure CV Processing — Extract resume text on upload; recruiters view a generated PDF, not a stored file.',
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

export const featuresData: HowItWorksType[] = [
  {
    text: 'AI-Powered Matching — Precision screening across thousands of profiles.',
    image: grid5Image,
    alt: 'Grid-one',
    style: styles.gridItem1,
    imgClass: 'w-fit-content rounded-br-2xl rounded-bl-2xl',
  },
  {
    text: 'Role-Based Scoring — Dynamic fit scoring based on your unique role and company.',
    image: featuresDisplay,
    alt: 'Grid-two',
    style: styles.gridItem2,
    imgClass: 'rounded-tr-2xl rounded-br-2xl',
  },
  {
    text: 'Secure CV Processing — Extract resume text on upload; recruiters view a generated PDF, not a stored file.',
    image: featuresDisplay,
    alt: 'Grid-three',
    style: styles.gridItem3,
    imgClass: 'rounded-tr-2xl rounded-br-2xl',
  },
  {
    text: 'Collaborative Hiring — Tag, comment, and evaluate as a team.',
    image: featuresDisplay,
    alt: 'Grid-four',
    style: styles.gridItem4,
    imgClass: 'rounded-tr-2xl rounded-br-2xl',
  },
  {
    text: 'Candidate CRM — Track and manage candidates across hiring stages.',
    image: featuresDisplay,
    alt: 'Grid-five',
    style: styles.gridItem5,
    imgClass: 'rounded-tr-2xl rounded-br-2xl',
  },
]
