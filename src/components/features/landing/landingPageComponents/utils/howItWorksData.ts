import featuresDisplay from '@/assets/featuresDisplay.png'

import styles from '../styles/RecruitmentWorkflow.module.scss'

export type HowItWorksType = Record<
  'text' | 'image' | 'alt' | 'style' | 'imgClass',
  string
>

export const featuresData: HowItWorksType[] = [
  {
    text: 'AI-Powered Matching — Precision screening across thousands of profiles.',
    image: featuresDisplay,
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
    text: 'Smart Recommendations — Not just resumes — insights.',
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
