import React from 'react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { singleJobData } from './myJobPostsData'
import styles from './SingleJobPost.module.scss'
import { SingleJobTable } from './SingleJobTable'

export const SingleJobPost = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.backButton} onClick={() => navigate(-1)}>
        <MdOutlineArrowBackIosNew />
        <div>Back</div>
      </div>
      <div className={styles.topContainer}>
        <div className={styles.title}>
          Sale Representative{' '}
          <span className={styles.applicants}>44 applicants</span>
        </div>
        <div>Posted 16 days ago</div>
      </div>
      <SingleJobTable data={singleJobData} />
    </div>
  )
}
