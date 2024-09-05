import React from 'react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Loading from '../../../components/Loading/Loading'
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
  console.log(jobId)

  if (error) {
    return <div>Error loading job details</div>
  }

  if (isLoading) {
    return <Loading />
  }

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
            {data?.data?.applications.length || 0} applicants
          </span>
        </div>
        <div>Posted {calculateDaysFromCreation(postedAt)} days ago</div>
      </div>
      <SingleJobTable applications={data?.data?.applications} />
    </div>
  )
}
