import React from 'react'

import { Button } from '../../../components'
import styles from './JobPosts.module.scss'

export const JobPosts = () => {
  return (
    <div>
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
          <Button title="Create New" textType="small" />
        </div>
      </div>
      <div></div>
    </div>
  )
}
