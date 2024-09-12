import React from 'react'

import styles from './IsProcessing.module.scss'

export const IsProcessing = () => (
  <div className={styles.loading}>
    <div className={styles.loadingChild}></div>
  </div>
)
