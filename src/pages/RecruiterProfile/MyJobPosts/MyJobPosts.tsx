import Lottie from 'lottie-react'
import React from 'react'

import animationData from '../../../assets/Animation2.json'
import { Button, DisplayError } from '../../../components'
import Loading from '../../../components/Loading/Loading'
import { useFetchRecruiterJobPostQuery } from '../../../redux/api/recruiter'
import { JobsTable } from './JobsTable'
import styles from './MyJobPosts.module.scss'

export const MyJobPosts = () => {
  const { data, error, isLoading } = useFetchRecruiterJobPostQuery({})

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
          <Button title="Create New" textType="normal" />
        </div>
      </div>
      <div>
        <JobsTable data={data?.data || []} />
      </div>
    </div>
  )
}
