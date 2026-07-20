import React from 'react'
import { IoMdInformationCircleOutline } from 'react-icons/io'

import { Card } from '@/components/ui/Card'
import { Heading, Text } from '@/components/ui/Typography'

import ProgressBar from '../../../../utils/ProgressBar'
import { Application } from '../../utils/type'
import styles from './ProgressView.module.scss'

interface HeaderProps {
  progressPercentage: number
  jobProgress: Application
}

const ProgressHeader: React.FC<HeaderProps> = ({
  progressPercentage,
  jobProgress,
}) => {
  return (
    <div className={styles.headerSection}>
      <Heading level={2}>Progress View</Heading>
      <Text color="secondary" className={styles.headerSubtitle}>
        Your job application pipeline. Track your progress and see where you are
        in the process.
      </Text>

      <Card className={styles.banner}>
        <div className={styles.bannerMessage}>
          <IoMdInformationCircleOutline
            size={24}
            className={styles.bannerIcon}
          />
          <Text weight="bold" className={styles.bannerText}>
            {jobProgress?.currentStage === 'completed'
              ? 'Application Assessment completed'
              : 'Application Assessment in progress'}
          </Text>
        </div>

        <ProgressBar
          percentage={progressPercentage}
          textColor="var(--color-text-heading)"
          pathColor="var(--color-warning)"
          trailColor="var(--color-border)"
          size={56}
        />
      </Card>
    </div>
  )
}

export default ProgressHeader
