import React from 'react'

import { Button } from '../../../components'
import { JobsTable } from './JobsTable'
import styles from './MyJobPosts.module.scss'

export const MyJobPosts = () => {
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
        <div style={{ width: '10%' }}>
          <Button title="Create New" textType="normal" />
        </div>
      </div>
      <div>
        <JobsTable />
      </div>
    </div>
  )
}
