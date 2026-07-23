import cn from 'classnames'
import React from 'react'
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

import { getStatusBadge } from '../../../RecruiterProfile/getJobStatus'
import { Progress } from '../../utils/type'
import styles from './ProgressView.module.scss'

interface Props {
  progress: Progress
  jobId?: string
  isLast?: boolean
}

const awaitingBadge = { backgroundColor: '#f3f4f6', color: '#6b7280' }
const completedBadge = { backgroundColor: '#edfeee', color: '#1b7b44' }

const STATUS_LABELS: Record<string, string> = {
  completed: 'Completed',
  current: 'Not Started',
  awaiting: 'Locked',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  'awaiting-decision': 'Awaiting Decision',
}

// Statuses without a dedicated `.dot-{status}` class fall back to the neutral
// "awaiting" dot styling.
const dotStatusClass = (status: string) =>
  styles[`dot-${status}`] ?? styles['dot-awaiting']

const takeableTests = ['Personalized Test', 'Personality Test']

const ProgressItem: React.FC<Props> = ({ progress, jobId, isLast }) => {
  const navigate = useNavigate()
  const talentId = useAuthStore((state) => state.user)?.id

  const handleNavigate = () => {
    switch (progress.title) {
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
        <div className={cn(styles.dot, dotStatusClass(progress.status))}>
          {(progress.status === 'completed' ||
            progress.status === 'shortlisted') && (
            <IoCheckmarkCircle size={16} />
          )}
          {progress.status === 'rejected' && <IoCloseCircle size={16} />}
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
        ) : progress.status === 'shortlisted' ||
          progress.status === 'rejected' ? (
          <StatusBadge
            status={STATUS_LABELS[progress.status]}
            {...getStatusBadge(progress.status)}
          />
        ) : (
          <StatusBadge
            status={
              progress.result ?? STATUS_LABELS[progress.status] ?? 'Locked'
            }
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
