import 'react-responsive-modal/styles.css'

import Tooltip from '@mui/material/Tooltip'
import React, { useMemo, useState } from 'react'
import { Modal } from 'react-responsive-modal'
import { Link } from 'react-router-dom'

import { ShareOptions } from '@/components/features/jobs/ShareOption/ShareOptions'
import { Select } from '@/components/forms/Select'
import { StatusBadge } from '@/components/ui/Badge'
import { useUpdateJobMutation } from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import Facebook from '../../../assets/Facebook icon.svg'
import LinkedIn from '../../../assets/linkedin logo_icon.svg'
import Twitter from '../../../assets/twitter_new_brand_icon.svg'
import { ColumnDef, DataTable } from '../../../components'
import {
  calculateDaysFromCreation,
  recruiterJobPostsTypes,
} from '../../../utils'
import { getStatusBadge, JOB_STATUS_OPTIONS } from '../getJobStatus'
import styles from './JobsTable.module.scss'

type StatusCellProps = {
  jobId: string
  status: string
}

const StatusCell = ({ jobId, status }: StatusCellProps) => {
  const [updateJob, { isLoading }] = useUpdateJobMutation()

  const handleChange = async (nextStatus: string) => {
    if (nextStatus === status) return
    try {
      await updateJob({ jobId, data: { status: nextStatus } }).unwrap()
      notify('success', 'Job status updated')
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to update job status'))
    }
  }

  return (
    <div className={styles.statusCell}>
      <StatusBadge status={status} {...getStatusBadge(status)} />
      <Select
        options={JOB_STATUS_OPTIONS}
        value={status}
        onChange={(value) => void handleChange(value)}
        disabled={isLoading}
        height="34px"
      />
    </div>
  )
}

type JobsTableType = {
  data: recruiterJobPostsTypes[]
}

type ShareLinks = {
  facebook: string
  twitter: string
  linkedin: string
}

export const JobsTable = ({ data }: JobsTableType) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [shareLinks, setShareLinks] = useState<ShareLinks>({
    facebook: '',
    twitter: '',
    linkedin: '',
  })

  const handleShare = (jobId: string) => {
    const link = `https://auxhr.com/job/postedjob/${jobId}`
    setShareLinks({
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        link,
      )}`,
      twitter: `https://twitter.com/share?url=${encodeURIComponent(link)}`,
      linkedin: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
        link,
      )}`,
    })
    setIsModalOpen(true)
  }

  const handleRedirectShare = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const shareOptions = [
    { icon: Facebook, text: 'Share', link: shareLinks.facebook },
    { icon: Twitter, text: 'Tweet', link: shareLinks.twitter },
    { icon: LinkedIn, text: 'Share', link: shareLinks.linkedin },
  ]

  const columns = useMemo<ColumnDef<recruiterJobPostsTypes>[]>(
    () => [
      {
        key: 'role',
        header: 'Job Title',
        align: 'center',
        render: (job) => (
          <div className={styles.titleCell}>
            {!job.aiConfig && (
              <Tooltip title="No AI Config" placement="top" arrow>
                <span className={styles.aiConfigDot} />
              </Tooltip>
            )}
            <Link
              to={`/recruiterDashboard/jobdetail/${job.id}`}
              className={styles.titleLink}>
              {job.role.name}
            </Link>
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        align: 'center',
        render: (job) => (
          <StatusCell jobId={job.id} status={job.status ?? 'draft'} />
        ),
      },
      {
        key: 'applicants',
        header: 'Applicants',
        align: 'center',
        render: (job) => (
          <Link
            to={`/recruiterDashboard/singleJobPost/${job.id}`}
            state={{ jobName: job.role.name, postedAt: job.createdAt }}>
            <button className={styles.applicantsButton}>
              View ({job.noOfApplicants})
            </button>
          </Link>
        ),
      },
      {
        key: 'createdAt',
        header: 'Date Created',
        align: 'center',
        render: (job) => (
          <p className={styles.dateText}>
            {`${calculateDaysFromCreation(job.createdAt)} days ago`}
          </p>
        ),
      },
      {
        key: 'details',
        header: 'Details',
        align: 'center',
        render: (job) => (
          <div className={styles.actionsCell}>
            <Link
              to={`/recruiterDashboard/jobdetail/${job.id}`}
              state={{ jobName: job.role.name, postedAt: job.createdAt }}>
              <button className={styles.viewJobButton}>View Job</button>
            </Link>
            {!job.aiConfig && (
              <Link to={`/recruiterDashboard/postjob/${job.id}`}>
                <button className={styles.addAiConfigButton}>
                  Add AI Config
                </button>
              </Link>
            )}
            <ShareOptions handleShare={handleShare} jobId={job.id} />
          </div>
        ),
      },
    ],
    [handleShare],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        getRowKey={(job) => job.id}
        ariaLabel="Job posts table"
        getRowClassName={(job) => {
          if (job.status === 'suspended' || job.status === 'closed')
            return styles.rowClosed
          if (job.aiConfig) return styles.rowComplete
          return styles.rowIncomplete
        }}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        center
        classNames={{ overlay: 'dashboard-modal-overlay' }}>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>
            Select your preferred social media to share job
          </h2>
          <div className={styles.modalOptions}>
            {shareOptions.map((option, index) => (
              <button
                key={index}
                className={styles.shareButton}
                onClick={() => handleRedirectShare(option.link)}>
                <img
                  src={option.icon}
                  alt={option.text}
                  className={styles.shareIcon}
                />
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}
