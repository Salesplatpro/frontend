import React from 'react'
import { IoChevronForward } from 'react-icons/io5'
import { Link } from 'react-router-dom'

import { CountBadge } from '@/components/ui/Badge'

import {
  calculateDaysFromCreation,
  recruiterJobPostsTypes,
} from '../../../utils'
import {
  getStatusBadge,
  getStatusDotColor,
  JOB_STATUS_OPTIONS,
} from '../getJobStatus'
import styles from './JobsCardList.module.scss'

type JobsCardListProps = {
  data: recruiterJobPostsTypes[]
}

const statusLabel = (status: string) =>
  JOB_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status

export const JobsCardList = ({ data }: JobsCardListProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Job Posts</span>
        <CountBadge item={data.length} />
      </div>

      {data.map((job) => {
        const status = job.status ?? 'draft'
        return (
          <Link
            key={job.id}
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
                  {statusLabel(status)}
                </span>
              </div>
              <p className={styles.subtext}>
                {job.noOfApplicants} applicants &bull;{' '}
                {calculateDaysFromCreation(job.createdAt)} days ago
              </p>
            </div>
            <IoChevronForward className={styles.chevron} />
          </Link>
        )
      })}
    </div>
  )
}
