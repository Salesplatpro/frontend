import cn from 'classnames'
import React from 'react'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

import { Progress } from '../../utils/type'
import styles from './ProgressView.module.scss'

interface Props {
  progress: Progress
  jobId?: string
  isLast?: boolean
}

const awaitingBadge = { backgroundColor: '#f3f4f6', color: '#6b7280' }
const completedBadge = { backgroundColor: '#edfeee', color: '#1b7b44' }

const takeableTests = [
  'Pre-Assessment',
  'Personalized Test',
  'Personality Test',
]

const ProgressItem: React.FC<Props> = ({ progress, jobId, isLast }) => {
  const navigate = useNavigate()
  const talentId = useAuthStore((state) => state.user)?.id

  const handleNavigate = () => {
    switch (progress.title) {
      case 'Pre-Assessment':
        navigate('/talentDashboard/TalentQuiz', {
          state: { canRetakeAssessment: true },
        })
        break
      case 'Personalized Test':
        navigate(
          `/talentDashboard/applicationPipeline/personalizedTest/${jobId}/${talentId}`,
        )
        break
      case 'Personality Test':
        navigate(
          `/talentDashboard/applicationPipeline/personalityTest/${jobId}`,
        )
        break
      default:
        break
    }
  }

  const isTakeable =
    progress.status === 'current' && takeableTests.includes(progress.title)

  return (
    <div className={styles.itemRow}>
      <div className={styles.connectorCol}>
        <div className={cn(styles.dot, styles[`dot-${progress.status}`])}>
          {progress.status === 'completed' && <IoCheckmarkCircle size={16} />}
        </div>
        {!isLast && <div className={styles.connectorLine} />}
      </div>

      <Card className={styles.itemCard}>
        <div className={styles.itemInfo}>
          <div className={styles.itemIcon}>
            <img src={progress.icon} alt="" />
          </div>
          <span className={styles.itemTitle}>{progress.title}</span>
        </div>

        {isTakeable ? (
          <Button size="sm" onClick={handleNavigate}>
            Take Test
          </Button>
        ) : (
          <StatusBadge
            status={progress.status === 'completed' ? 'Completed' : 'Awaiting'}
            {...(progress.status === 'completed'
              ? completedBadge
              : awaitingBadge)}
          />
        )}
      </Card>
    </div>
  )
}

export default ProgressItem
