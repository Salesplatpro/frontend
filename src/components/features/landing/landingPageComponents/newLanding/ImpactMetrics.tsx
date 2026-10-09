import React from 'react'

import styles from './ImpactMetrics.module.scss'
import { impactMetrics } from './impactMetricsData'

export const ImpactMetrics = () => (
  <section className={styles.section}>
    <h2 className={styles.heading}>
      AuxHR Doesn&apos;t Just Improve Hiring,
      <br />
      It Transforms It.
    </h2>

    <div className={styles.grid}>
      {impactMetrics.map((metric) => (
        <div key={metric.value} className={styles.card}>
          <span className={styles.value}>{metric.value}</span>
          <span className={styles.label}>{metric.label}</span>
        </div>
      ))}
    </div>
  </section>
)
