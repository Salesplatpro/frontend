import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, DisplayError } from '../../../components'
import Loading from '../../../components/Loading/Loading'
import { useFetchRecruiterJobPostQuery } from '../../../redux/api/recruiter'
import { JobsTable } from './JobsTable'
import styles from './MyJobPosts.module.scss'

export const MyJobPosts = () => {
  const { data, error, isLoading } = useFetchRecruiterJobPostQuery({})
  const navigate = useNavigate()

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    console.error(error)
    return <DisplayError message="Error loading jobs" />
  }

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={styles.titleDesc}>
          <div className={styles.title}>Job Posts</div>
          <div className={styles.desc}>
            {' '}
            View jobs posted by you and see number of applicants that have
            responded.
          </div>
        </div>
        <div style={{ width: '16%' }}>
          <Button
            title="Create New"
            textType="normal"
            onClick={() => navigate('/recruiterDashboard/postjob')}
          />
        </div>
      </div>
      <div>
        <JobsTable data={data?.data || []} />
      </div>
    </div>
  )
}
