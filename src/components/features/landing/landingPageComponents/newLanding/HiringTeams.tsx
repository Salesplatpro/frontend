import React from 'react'

import styles from './HiringTeams.module.scss'
import { hiringTeams } from './hiringTeamsData'

export const HiringTeams = () => (
  <section className={styles.section}>
    <div className={styles.inner}>
      <h2 className={styles.heading}>Designed for Modern Hiring Teams.</h2>

      <div className={styles.grid}>
        {hiringTeams.map((team) => (
          <div key={team.id} className={styles.card}>
            <img src={team.image} alt="" className={styles.image} />
            <div className={styles.text}>
              <h3 className={styles.title}>{team.title}</h3>
              <p className={styles.description}>{team.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
