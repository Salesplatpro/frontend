import React, { useEffect, useState } from 'react'

import arrowUpRight from './assets/arrow-up-right-small.svg'
import checkCircle from './assets/check-circle.svg'
import sparkle from './assets/sparkle.svg'
import stem from './assets/stem.svg'
import styles from './HeroPanel.module.scss'
import { HeroTabContent, HeroTabId, heroTabs } from './heroPanelData'

const ROTATE_INTERVAL_MS = 6000

const SPARKLINE_POINTS = '0,32 20,24 40,28 60,10 80,16 100,4 120,12'

const CardMock = ({ card }: { card: HeroTabContent['card'] }) => {
  if (card.kind === 'diagnostic') {
    return (
      <div className={styles.diagnosticCard}>
        <div className={styles.diagnosticHeader}>
          <div>
            <span className={styles.diagnosticTitle}>{card.title}</span>
            <p className={styles.diagnosticName}>{card.name}</p>
            <p className={styles.diagnosticRole}>{card.roleLine}</p>
          </div>
          <span className={styles.matchBadge}>{card.matchLabel}</span>
        </div>
        <div className={styles.diagnosticBody}>
          <div>
            <div className={styles.tagsLabelRow}>
              <img src={checkCircle} alt="" aria-hidden />
              <span className={styles.tagsLabel}>{card.tagsLabel}</span>
            </div>
            <div className={styles.tags}>
              {card.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.synthesis}>
            <div className={styles.synthesisLabelRow}>
              <img src={sparkle} alt="" aria-hidden />
              <span className={styles.synthesisLabel}>
                {card.synthesisLabel}
              </span>
            </div>
            <p>“{card.synthesis}”</p>
          </div>
        </div>
      </div>
    )
  }

  if (card.kind === 'stepper') {
    return (
      <div className={styles.stepperCard}>
        {card.steps.map((step, index) => (
          <div key={step.label} className={styles.stepperRow}>
            <span
              className={
                step.status === 'completed'
                  ? styles.stepperNodeDone
                  : styles.stepperNode
              }
            />
            {index < card.steps.length - 1 && (
              <span className={styles.stepperLine} />
            )}
            <span className={styles.stepperLabel}>{step.label}</span>
            <span
              className={
                step.status === 'completed'
                  ? styles.pillDone
                  : styles.pillPending
              }>
              {step.pillLabel}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (card.kind === 'dashboard') {
    return (
      <div className={styles.dashboardCard}>
        <div className={styles.dashboardHeader}>
          <span className={styles.dashboardMetricLabel}>
            {card.metricLabel}
          </span>
          <span className={styles.dashboardMetricValue}>
            {card.metricValue}
          </span>
        </div>
        <svg
          className={styles.sparkline}
          viewBox="0 0 120 36"
          preserveAspectRatio="none"
          aria-hidden>
          <polyline points={SPARKLINE_POINTS} fill="none" strokeWidth="2" />
        </svg>
        <table className={styles.dashboardTable}>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Pre screening</th>
              <th>Cv match</th>
            </tr>
          </thead>
          <tbody>
            {card.table.map((row) => (
              <tr key={row.name}>
                <td>
                  <span className={styles.avatar}>{row.initials}</span>
                  {row.name}
                </td>
                <td>{row.preScreening}</td>
                <td>{row.cvMatch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={styles.photoCard}>
      <img src={card.photoSrc} alt="" className={styles.photo} />
      <div className={styles.photoOverlay}>
        <p className={styles.photoName}>{card.name}</p>
        <p className={styles.photoRole}>
          {card.roleLine}{' '}
          <span className={styles.photoFit}>{card.matchLabel}</span>
        </p>
        <div className={styles.photoTags}>
          {card.tags.map((tag) => (
            <span key={tag} className={styles.photoTag}>
              ✓ {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export const HeroPanel = () => {
  const [activeId, setActiveId] = useState<HeroTabId>(heroTabs[0].id)
  const activeTab = heroTabs.find((tab) => tab.id === activeId) ?? heroTabs[0]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveId((current) => {
        const index = heroTabs.findIndex((tab) => tab.id === current)
        return heroTabs[(index + 1) % heroTabs.length].id
      })
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [activeId])

  return (
    <div className={styles.panel}>
      <div className={styles.tabs} role="tablist">
        {heroTabs.map((tab) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={styles.tabOuter}
              onClick={() => setActiveId(tab.id)}>
              <span
                className={isActive ? styles.tabInnerActive : styles.tabInner}>
                <img src={tab.tabIcon} alt="" />
              </span>
              {isActive && (
                <img src={stem} alt="" aria-hidden className={styles.stem} />
              )}
            </button>
          )
        })}
      </div>

      <div key={activeTab.id} className={styles.card}>
        <div className={styles.cardLeft}>
          <div className={styles.eyebrow}>
            <img src={activeTab.eyebrowIcon} alt="" />
            <span>{activeTab.eyebrow}</span>
          </div>
          <div className={styles.headingBlock}>
            <h3 className={styles.heading}>{activeTab.heading}</h3>
            <p className={styles.body}>{activeTab.body}</p>
          </div>
          <button type="button" className={styles.learnMore}>
            {activeTab.ctaLabel} <img src={arrowUpRight} alt="" aria-hidden />
          </button>
        </div>
        <div className={styles.cardRight}>
          <CardMock card={activeTab.card} />
        </div>
      </div>
    </div>
  )
}
