import React from 'react'
import {
  FiBriefcase,
  FiClock,
  FiExternalLink,
  FiMapPin,
  FiTrendingUp,
} from 'react-icons/fi'

import { CompanyTag } from '@/components/features/jobs/CompanyTag'
import { ShareJob } from '@/components/features/jobs/ShareJob'
import { StatusBadge } from '@/components/ui/Badge'
import {
  getStatusBadge,
  getStatusLabel,
} from '@/pages/RecruiterProfile/getJobStatus'
import { formatTimeAgo } from '@/utils'
import { capitalizeEachWord } from '@/utils/CapitalizeWord'
import { formatCompensation } from '@/utils/formatCompensation'

import {
  formatExperience,
  formatLocation,
  formatWorkMode,
  toWebsiteLink,
} from './jobDetailsFormat'
import styles from './JobDetailsView.module.scss'
import type { JobDetailsJob } from './types'

type JobHeaderProps = {
  jobId: string
  job: JobDetailsJob
  showStatus: boolean
  canShare: boolean
}

export const JobHeader: React.FC<JobHeaderProps> = ({
  jobId,
  job,
  showStatus,
  canShare,
}) => {
  const title = job.role?.name
    ? capitalizeEachWord(job.role.name)
    : 'Job details'
  const website = toWebsiteLink(job.organization?.website)
  const posted = formatTimeAgo(job.createdAt)
  const hasSalary = job.minSalary != null || job.maxSalary != null

  const meta = [
    { key: 'location', icon: <FiMapPin />, text: formatLocation(job) },
    { key: 'workMode', icon: <FiBriefcase />, text: formatWorkMode(job) },
    { key: 'experience', icon: <FiTrendingUp />, text: formatExperience(job) },
    {
      key: 'posted',
      icon: <FiClock />,
      text: posted ? `Posted ${posted}` : null,
    },
  ].filter((item) => item.text)

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.employer}>
          <CompanyTag
            organization={job.organization}
            size="md"
            fallback="Company not listed"
          />
          {website && (
            <a
              href={website.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.website}>
              {website.label}
              <FiExternalLink aria-hidden />
            </a>
          )}
        </div>
        {canShare && (
          <ShareJob
            jobId={jobId}
            jobTitle={job.role?.name}
            tooltipPosition="left"
          />
        )}
      </div>

      <h1 className={styles.title}>{title}</h1>

      {meta.length > 0 && (
        <ul className={styles.meta}>
          {meta.map((item) => (
            <li key={item.key} className={styles.metaItem}>
              <span className={styles.metaIcon} aria-hidden>
                {item.icon}
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      )}

      {(hasSalary || (showStatus && job.status)) && (
        <div className={styles.pills}>
          {hasSalary && (
            <span className={styles.salaryPill}>{formatCompensation(job)}</span>
          )}
          {showStatus && job.status && (
            <StatusBadge
              status={getStatusLabel(job.status)}
              {...getStatusBadge(job.status)}
              showDot
            />
          )}
        </div>
      )}
    </header>
  )
}
