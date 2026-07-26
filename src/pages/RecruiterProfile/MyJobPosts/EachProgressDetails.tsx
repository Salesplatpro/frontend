import React from 'react'

import { AnalyzedPercentage } from '../Batching'
import styles from './EachProgressDetails.module.scss'

type EachProgressProps = {
  title: string
  useScore?: boolean
  percentage: number | string
  personality?: string
}

export const EachProgressDetails = ({
  title,
  useScore = false,
  percentage,
  personality,
}: EachProgressProps) => {
  return (
    <div className={styles.row}>
      <div className={styles.title}>{title}</div>
      <hr className={styles.divider} />
      <div className={styles.value}>
        {useScore ? (
          <div className={styles.scoreValue}>
            {typeof percentage === 'number' ? (
              <>
                <div className={styles.scoreLabel}>Score:</div>
                <div className={styles.matchValue}>
                  <AnalyzedPercentage targetValue={percentage} />
                  <div className={styles.matchLabel}>Match</div>
                </div>
              </>
            ) : (
              <div className={styles.plainValue}>{percentage}</div>
            )}
          </div>
        ) : (
          <div className={styles.personalityValue}>{personality}</div>
        )}
      </div>
    </div>
  )
}
