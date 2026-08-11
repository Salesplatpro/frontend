import React from 'react'
import { GoDotFill } from 'react-icons/go'
import { PiBuildingOfficeBold } from 'react-icons/pi'
import { Link } from 'react-router-dom'

import {
  CompanyTag,
  JobOrganization,
} from '@/components/features/jobs/CompanyTag'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

import { capitalizeFirstWord } from '../../../utils'
import { JobDetails } from './JobDetails'
import styles from './SingleJob.module.scss'

const stripHtmlAndTruncate = (html: string, limit: number) => {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}

export type SingleJobProps = {
  jobId?: string
  jobTitle?: string
  jobCategory?: string
  jobBrief?: string
  jobWorkMode?: string[]
  jobCountry?: string
  jobExperience?: string
  jobSalary?: string
  isApplied?: boolean
  organization?: JobOrganization | null
}

export const SingleJob = ({
  jobId,
  jobTitle,
  jobCategory,
  jobBrief,
  jobWorkMode,
  jobExperience,
  jobCountry,
  jobSalary,
  isApplied,
  organization,
}: SingleJobProps) => {
  return (
    <Card className={styles.card}>
      <PiBuildingOfficeBold size={36} className={styles.icon} />
      <div className={styles.body}>
        <Link to={`/talentDashboard/job/${jobId}`} className={styles.titleRow}>
          <span className={styles.title}>{capitalizeFirstWord(jobTitle)}</span>
          <span className={styles.category}>
            <GoDotFill color="#2e90fa" />
            {capitalizeFirstWord(jobCategory)}
          </span>
        </Link>

        <CompanyTag organization={organization} className="mt-1" />

        {jobBrief && (
          <p className={styles.description}>
            {stripHtmlAndTruncate(jobBrief, 140)}
          </p>
        )}

        <div className={styles.footer}>
          <JobDetails
            location={capitalizeFirstWord(jobCountry || '')}
            type={jobWorkMode?.map(capitalizeFirstWord).join(', ')}
            level={capitalizeFirstWord(jobExperience) || ''}
            salary={jobSalary || ''}
          />
          {isApplied ? (
            <Button size="sm" variant="secondary" disabled>
              Applied ✓
            </Button>
          ) : (
            <Link to={`/talentDashboard/job/${jobId}`}>
              <Button size="sm">Apply Now</Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
