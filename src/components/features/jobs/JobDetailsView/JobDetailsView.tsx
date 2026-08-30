import 'react-responsive-modal/styles.css'

import React, { useState } from 'react'
import { Modal } from 'react-responsive-modal'

import Facebook from '@/assets/Facebook icon.svg'
import LinkedIn from '@/assets/linkedin logo_icon.svg'
import Twitter from '@/assets/twitter_new_brand_icon.svg'
import {
  CompanyTag,
  JobOrganization,
} from '@/components/features/jobs/CompanyTag'
import { ShareOptions } from '@/components/features/jobs/ShareOption/ShareOptions'
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
  aiConfigId?: string | null
  aiConfig?: { id?: string } | null
}

interface JobDetailsViewProps {
  jobId: string
  job: JobDetailsJob
  action: React.ReactNode
  onBack?: () => void
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
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const link = `https://auxhr.com/job/postedjob/${jobId}`

  const shareOptions = [
    {
      icon: Facebook,
      text: 'Share',
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        link,
      )}`,
    },
    {
      icon: Twitter,
      text: 'Tweet',
      link: `https://twitter.com/share?url=${encodeURIComponent(link)}`,
    },
    {
      icon: LinkedIn,
      text: 'Share',
      link: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
        link,
      )}`,
    },
  ]

  const workModeLabel = job.workMode?.length
    ? job.workMode.map((mode) => capitalizeFirstWord(mode)).join(', ')
    : 'Not specified'

  const postedByName = job.postedBy?.firstName
    ? `${job.postedBy.firstName} ${job.postedBy.lastName ?? ''}`.trim()
    : null

  const handleRedirectShare = (shareLink: string) => {
    window.open(shareLink, '_blank', 'noopener,noreferrer')
  }

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
      <div className={styles.header}>
        <CompanyTag
          organization={job.organization}
          size="md"
          className={styles.company}
        />
        <ShareOptions handleShare={() => setIsModalOpen(true)} jobId={jobId} />
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

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        center
        classNames={{ overlay: 'dashboard-modal-overlay' }}>
        <div className={styles.shareModal}>
          <h2 className={styles.shareModalTitle}>
            Select your preferred social media to share job
          </h2>
          <div className={styles.shareModalOptions}>
            {shareOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                className={styles.shareModalOption}
                onClick={() => handleRedirectShare(option.link)}>
                <img
                  src={option.icon}
                  alt={option.text}
                  className={styles.shareModalIcon}
                />
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </PageShell>
  )
}

export default JobDetailsView
