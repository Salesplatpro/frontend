import cn from 'classnames'
import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'

import { CompanyTag } from '@/components/features/jobs/CompanyTag'
import RichTextDisplay from '@/components/features/shared/global/RichTextDisplay'
import { PageShell } from '@/components/layout/PageShell'
import { BackButton } from '@/components/ui/BackButton'

import { formatPoster, hasRichText, toWebsiteLink } from './jobDetailsFormat'
import styles from './JobDetailsView.module.scss'
import { JobHeader } from './JobHeader'
import { JobOverview } from './JobOverview'
import type { JobDetailsAudience, JobDetailsJob } from './types'

interface JobDetailsViewProps {
  jobId: string
  job: JobDetailsJob
  /** Who is looking: drives the status badge and the back button. */
  audience: JobDetailsAudience
  action: React.ReactNode
  onBack?: () => void
  /** Hiring-team card shown above the job overview, e.g. applicant stats. */
  insights?: React.ReactNode
}

const JobDetailsView: React.FC<JobDetailsViewProps> = ({
  jobId,
  job,
  audience,
  action,
  onBack,
  insights,
}) => {
  const isHiringTeam = audience === 'recruiter' || audience === 'admin'
  const poster = formatPoster(job)
  const website = toWebsiteLink(job.organization?.website)

  return (
    <PageShell wide>
      {audience !== 'public' && <BackButton onClick={onBack} />}

      <div className={styles.view}>
        <JobHeader
          jobId={jobId}
          job={job}
          showStatus={isHiringTeam}
          canShare={job.status === 'active'}
        />

        <div className={styles.body}>
          <div className={styles.main}>
            {hasRichText(job.jobBrief) && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>About the role</h2>
                <RichTextDisplay
                  content={job.jobBrief ?? ''}
                  className={styles.richText}
                />
              </section>
            )}

            {hasRichText(job.requirements) && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Requirements</h2>
                <RichTextDisplay
                  content={job.requirements ?? ''}
                  className={styles.richText}
                />
              </section>
            )}

            {!!job.skills?.length && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Skills</h2>
                <ul className={styles.chips}>
                  {job.skills.map((skill, index) => (
                    <li key={`${skill}-${index}`} className={styles.chip}>
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!!job.goals?.length && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Goals for this role</h2>
                <ul className={styles.goals}>
                  {job.goals.map((goal, index) => (
                    <li key={`${goal}-${index}`} className={styles.goal}>
                      <FiCheckCircle className={styles.goalIcon} aria-hidden />
                      {goal}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className={styles.sidebar}>
            {action && (
              <div
                className={cn(
                  styles.actionCard,
                  !isHiringTeam && styles.actionCardSticky,
                )}>
                {action}
              </div>
            )}

            {insights && (
              <section
                className={cn(styles.card, styles.sidebarItem)}
                aria-labelledby="job-insights-title">
                <h2 id="job-insights-title" className={styles.cardTitle}>
                  Hiring insights
                </h2>
                {insights}
              </section>
            )}

            <div className={styles.sidebarItem}>
              <JobOverview job={job} />
            </div>

            <section
              className={cn(styles.card, styles.sidebarItem)}
              aria-labelledby="job-company-title">
              <h2 id="job-company-title" className={styles.cardTitle}>
                About the company
              </h2>
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
                </a>
              )}
              {poster && (
                <p className={styles.poster}>
                  Posted by <span>{poster}</span>
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

export default JobDetailsView
