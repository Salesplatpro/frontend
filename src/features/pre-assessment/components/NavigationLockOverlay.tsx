import React from 'react'
import { MdLock } from 'react-icons/md'

import styles from './NavigationLockOverlay.module.scss'

export const NavigationLockOverlay: React.FC = () => (
  <div className={styles.overlay}>
    <div className={styles.iconWrap}>
      <MdLock className={styles.icon} />
    </div>
    <div className={styles.text}>
      <p className={styles.title}>Navigation Locked</p>
      <p className={styles.description}>
        You are currently taking an assessment.
        <br />
        Complete or submit to continue.
      </p>
    </div>
  </div>
)
