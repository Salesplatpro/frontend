import React, { useEffect, useState } from 'react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { fetchRecruiterJobPostDetails } from '../../../api/api-communication'
import { calculateDaysFromCreation } from '../../../utils'
import styles from './SingleJobPost.module.scss'
import { SingleJobTable } from './SingleJobTable'

type JobType = {
  name: string
  stage: string
  status: string
  dateApplied: string
}

export type jobDetailsType = {
  applications: JobType[]
}

export const SingleJobPost = () => {
  const [jobDetails, setJobDetails] = useState([])
  const navigate = useNavigate()
  const { jobId } = useParams()
  const location = useLocation()
  const jobName = location.state?.jobName
  const postedAt = location.state?.postedAt

  useEffect(() => {
    ;(async () => {
      try {
        if (jobId) {
          const response = await fetchRecruiterJobPostDetails(jobId)
          setJobDetails(response.data)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [jobId])

  return (
    <div className={styles.container}>
      <div className={styles.backButton} onClick={() => navigate(-1)}>
        <MdOutlineArrowBackIosNew />
        <div>Back</div>
      </div>
      <div className={styles.topContainer}>
        <div className={styles.title}>
          {jobName}
          <span className={styles.applicants}>
            {jobDetails.length} applicants
          </span>
        </div>
        <div>Posted {calculateDaysFromCreation(postedAt)} days ago</div>
      </div>
      <SingleJobTable applications={jobDetails} />
    </div>
  )
}
