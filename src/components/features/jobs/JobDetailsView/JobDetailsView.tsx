import React from 'react'

import {
  CompanyTag,
  JobOrganization,
} from '@/components/features/jobs/CompanyTag'
import { ShareJob } from '@/components/features/jobs/ShareJob'
import RichTextDisplay from '@/components/features/shared/global/RichTextDisplay'
import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { BackButton } from '@/components/ui/BackButton'
import { StatusBadge } from '@/components/ui/Badge'
import { getStatusBadge } from '@/pages/RecruiterProfile/getJobStatus'
import { capitalizeFirstWord } from '@/utils'
import { capitalizeEachWord } from '@/utils/CapitalizeWord'
import { formatCompensation } from '@/utils/formatCompensation'

import styles from './JobDetailsView.module.scss'

export interface JobDetailsJob {
  role?: { name: string }
  createdAt?: string
  jobBrief?: string
  requirements?: string
  skills?: string[] | null
  goals?: string[] | null
  workMode?: string[] | null
  locationCountry?: string | null
  locationState?: string | null
  locationCity?: string | null
  experienceLevel?: string
  currency?: string | null
  minSalary?: number | null
  maxSalary?: number | null
  compensationPeriod?: string | null
  noOfApplicants?: number
  postedBy?: { firstName?: string; lastName?: string } | null
  organization?: JobOrganization | null
  status?: string
  hasApplied?: boolean
  applicationStage?: string | null
  applicationId?: string | null
  applicationStages?: Record<string, string> | null
  aiConfigId?: string | null
  aiConfig?: { id?: string } | null
}

interface JobDetailsViewProps {
  jobId: string
  job: JobDetailsJob
  action: React.ReactNode
  onBack?: () => void
  /** Optional content rendered between the hero and the company/share row — e.g. the recruiter-only applicant stats strip. Other consumers of this shared view simply omit it. */
  beforeBody?: React.ReactNode
}

const formatLocation = (job: JobDetailsJob) => {
  const parts = [job.locationCity, job.locationState, job.locationCountry]
    .filter(Boolean)
    .map((part) => capitalizeFirstWord(part ?? undefined))
  return parts.length > 0 ? parts.join(', ') : 'Not specified'
}

const JobDetailsView: React.FC<JobDetailsViewProps> = ({
  jobId,
  job,
  action,
  onBack,
  beforeBody,
}) => {
  const workModeLabel = job.workMode?.length
    ? job.workMode.map((mode) => capitalizeFirstWord(mode)).join(', ')
    : 'Not specified'

  const postedByName = job.postedBy?.firstName
    ? `${job.postedBy.firstName} ${job.postedBy.lastName ?? ''}`.trim()
    : null

  return (
    <PageShell wide>
      <BackButton onClick={onBack} />
      <PageHero
        compact
        title={
          job.role?.name ? capitalizeEachWord(job.role.name) : 'Job details'
        }
        lead={postedByName ? `Posted by ${postedByName}` : undefined}
        pills={
          job.status ? (
            <StatusBadge status={job.status} {...getStatusBadge(job.status)} />
          ) : undefined
        }
      />
      {beforeBody}
      <div className={styles.header}>
        <CompanyTag
          organization={job.organization}
          size="md"
          className={styles.company}
        />
        <ShareJob jobId={jobId} jobTitle={job.role?.name} />
      </div>

      <div className={styles.body}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Job Brief</h3>
            <RichTextDisplay
              content={job.jobBrief || ''}
              className={styles.richText}
            />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Requirements</h3>
            <RichTextDisplay
              content={job.requirements || ''}
              className={styles.richText}
            />
          </section>

          {!!job.skills?.length && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Skills</h3>
              <ul className={styles.list}>
                {job.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </section>
          )}

          {!!job.goals?.length && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Goals</h3>
              <ul className={styles.list}>
                {job.goals.map((goal, i) => (
                  <li key={i}>{goal}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.actionSlot}>{action}</div>

          <div className={styles.summaryItem}>
            <p className={styles.summaryLabel}>Work Mode</p>
            <p className={styles.summaryValue}>{workModeLabel}</p>
          </div>
          <div className={styles.summaryItem}>
            <p className={styles.summaryLabel}>Location</p>
            <p className={styles.summaryValue}>{formatLocation(job)}</p>
          </div>
          <div className={styles.summaryItem}>
            <p className={styles.summaryLabel}>Experience Level</p>
            <p className={styles.summaryValue}>
              {capitalizeFirstWord(job.experienceLevel) || 'Not specified'}
            </p>
          </div>
          <div className={styles.summaryItem}>
            <p className={styles.summaryLabel}>Salary</p>
            <p className={styles.summaryValue}>{formatCompensation(job)}</p>
          </div>
          {job.noOfApplicants != null && (
            <div className={styles.summaryItem}>
              <p className={styles.summaryLabel}>Applicants</p>
              <p className={styles.summaryValue}>{job.noOfApplicants}</p>
            </div>
          )}
        </aside>
      </div>
    </PageShell>
  )
}

export default JobDetailsView
