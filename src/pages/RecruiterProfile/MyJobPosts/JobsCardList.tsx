import React from 'react'
import { IoChevronForward } from 'react-icons/io5'
import { Link } from 'react-router-dom'

import { CompanyTag } from '@/components/features/jobs/CompanyTag'
import { CountBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

import { formatTimeAgo, recruiterJobPostsTypes } from '../../../utils'
import {
  getStatusBadge,
  getStatusDotColor,
  getStatusLabel,
} from '../getJobStatus'
import styles from './JobsCardList.module.scss'
import { useJobPayment } from './useJobPayment'

type JobsCardListProps = {
  data: recruiterJobPostsTypes[]
}

export const JobsCardList = ({ data }: JobsCardListProps) => {
  const { canPay, payForJob, payingJobId } = useJobPayment()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Job Posts</span>
        <CountBadge item={data.length} />
      </div>

      {data.map((job) => {
        const status = job.status ?? 'draft'
        const aiConfigId =
          job.aiConfigId ??
          (typeof job.aiConfig === 'string' ? job.aiConfig : null)
        return (
          <div key={job.id} className={styles.item}>
            <Link
              to={`/recruiterDashboard/jobdetail/${job.id}`}
              state={{ jobName: job.role.name, postedAt: job.createdAt }}
              className={styles.row}>
              <span
                className={styles.dot}
                style={{ backgroundColor: getStatusDotColor(status) }}
              />
              <div className={styles.rowBody}>
                <div className={styles.rowTop}>
                  <span className={styles.title}>{job.role.name}</span>
                  <span
                    className={styles.statusPill}
                    style={getStatusBadge(status)}>
                    {getStatusLabel(status)}
                  </span>
                </div>
                <CompanyTag organization={job.organization} />
                <p className={styles.subtext}>
                  {job.noOfApplicants} applicants &bull;{' '}
                  {formatTimeAgo(job.createdAt)}
                </p>
              </div>
              <IoChevronForward className={styles.chevron} />
            </Link>
            {canPay(status, !!aiConfigId) && (
              <div className={styles.payBar}>
                <Button
                  variant="primary"
                  size="sm"
                  loading={payingJobId === job.id}
                  onClick={() => void payForJob(job.id)}>
                  Pay to activate
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
