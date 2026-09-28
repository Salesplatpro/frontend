import React from 'react'

import styles from './AiConfig.module.scss'
import { AiConfigFieldValues } from './aiConfigModel'
import { candidateJourney } from './journeyStages'

type CandidateJourneyProps = {
  values: AiConfigFieldValues
  title?: string
}

export const CandidateJourney = ({
  values,
  title = 'What candidates will go through',
}: CandidateJourneyProps) => {
  const { stages, totalMinutes } = candidateJourney(values)

  return (
    <section className={styles.journey} aria-label={title}>
      <div className={styles.journeyHeader}>
        <p className={styles.journeyTitle}>{title}</p>
        <p className={styles.journeyTime}>
          About {totalMinutes} min for the candidate
        </p>
      </div>
      <ol className={styles.journeyList}>
        {stages.map((stage, index) => (
          <li key={stage.key} className={styles.journeyStage}>
            <span className={styles.journeyStep} aria-hidden>
              {index + 1}
            </span>
            <span className={styles.journeyCopy}>
              <span className={styles.journeyStageTitle}>{stage.title}</span>
              <span className={styles.journeyDetail}>{stage.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
