import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { fetchRecruiterJobPost } from '../../../api/api-communication'
import { Button } from '../../../components'
import Loading from '../../../components/Loading/Loading'
import { recruiterJobPostsTypes } from '../../../utils'
import { JobsTable } from './JobsTable'
import styles from './MyJobPosts.module.scss'

export const MyJobPosts = () => {
  const [jobs, setJobs] = useState<recruiterJobPostsTypes[] | []>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const fetchJobs = await fetchRecruiterJobPost()
        setJobs(fetchJobs.data)
        toast.success(fetchJobs.message)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return <Loading />
  }
  console.log(jobs)

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
        <JobsTable data={jobs} />
      </div>
    </div>
  )
}
