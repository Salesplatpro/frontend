import React from 'react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'

import { useFetchRecruiterJobPostDetailsQuery } from '../../../redux/api/recruiter'
import { calculateDaysFromCreation } from '../../../utils'
import styles from './SingleJobPost.module.scss'
import { SingleJobTable } from './SingleJobTable'

export const SingleJobPost = () => {
  const { jobId } = useParams()
  const { data, error, isLoading } = useFetchRecruiterJobPostDetailsQuery(
    jobId ?? '',
  )
  const navigate = useNavigate()
  const location = useLocation()
  const jobName = location.state?.jobName
  const postedAt = location.state?.postedAt
  const applications = data?.data?.applications ?? []

  if (error) {
    return <div>Error loading job details</div>
  }

  if (isLoading) {
    return <Spinner fullPage />
  }

  return (
    <div className={styles.container}>
      <div className={styles.backButton} onClick={() => navigate(-1)}>
        <MdOutlineArrowBackIosNew />
        <div>Back</div>
      </div>
      <div className={styles.topContainer}>
        <div className={`${styles.title} capitalize font-bold`}>
          {jobName}
          <span className={styles.applicants}>
            {applications.length || 0}{' '}
            {applications.length > 1 ? 'applicants' : 'applicant'}
          </span>
        </div>
        <div>Posted {calculateDaysFromCreation(postedAt)} days ago</div>
      </div>
      <SingleJobTable applications={applications} />
    </div>
  )
}
