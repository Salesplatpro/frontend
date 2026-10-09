import React from 'react'

import styles from './HowItWorks.module.scss'
import { howItWorksSteps, StepCard } from './howItWorksStepsData'

const StepMock = ({ card }: { card: StepCard }) => {
  if (card.kind === 'search') {
    return (
      <div className={styles.searchMock}>
        <img src={card.icon} alt="" aria-hidden />
        <span>{card.placeholder}</span>
      </div>
    )
  }

  if (card.kind === 'pill') {
    return (
      <div className={styles.pillMock}>
        <img src={card.icon} alt="" aria-hidden />
        <span>{card.text}</span>
      </div>
    )
  }

  if (card.kind === 'skeletonTable') {
    return (
      <div className={styles.skeletonCard}>
        {card.columns.map((rows, columnIndex) => (
          <div key={columnIndex} className={styles.skeletonColumn}>
            {rows.map((width, rowIndex) => (
              <div key={rowIndex} className={styles.skeletonCell}>
                <span
                  className={styles.skeletonBar}
                  style={{ width: `${width}%` }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.profileCard}>
      <span className={styles.iconBadge}>
        <img src={card.badgeIcon} alt="" aria-hidden />
      </span>
      <p className={styles.profileName}>{card.name}</p>
      <div className={styles.profileMeta}>
        <span className={styles.profileRole}>{card.role}</span>
        <span className={styles.fitBadge}>{card.fitLabel}</span>
      </div>
    </div>
  )
}

export const HowItWorks = () => (
  <section className={styles.section}>
    <div className={styles.copy}>
      <h2 className={styles.heading}>
        Great candidates shouldn&apos;t get lost in a pile of CVs...
      </h2>
      <p className={styles.subcopy}>
        AuxHR helps you cut through the noise and focus on the right candidates
        with automated semantic distillation.
      </p>
    </div>

    <div className={styles.grid}>
      <span className={styles.connector} aria-hidden />
      {howItWorksSteps.map((step) => (
        <div key={step.id} className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.badge}>{step.number}</span>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.description}>{step.description}</p>
          </div>
          <div className={styles.mockPanel}>
            <StepMock card={step.card} />
          </div>
        </div>
      ))}
    </div>
  </section>
)
