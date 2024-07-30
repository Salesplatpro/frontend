import React from 'react'

import styles from './ApplicationPipeline.module.scss'
import { PipelineTable } from './PipelineTable'

export const ApplicationPipeline = () => {
  return (
    <div className={styles.pipelineContainer}>
      <div>
        <div className={styles.title}>Application Pipelines</div>
        <div>
          Your job application pipeline. Track your progress and see where you
          are in the process.
        </div>
      </div>
      <PipelineTable />
    </div>
  )
}
