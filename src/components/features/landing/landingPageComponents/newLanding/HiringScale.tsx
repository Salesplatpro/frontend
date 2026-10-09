import cn from 'classnames'
import React, { useEffect, useState } from 'react'

import badgeCheck from './assets/badge-check.svg'
import styles from './HiringScale.module.scss'
import { hiringScaleCandidates } from './hiringScaleData'

const ROTATE_INTERVAL_MS = 6000

export const HiringScale = () => {
  const [activeId, setActiveId] = useState(hiringScaleCandidates[0].id)
  const activeIndex = hiringScaleCandidates.findIndex(
    (candidate) => candidate.id === activeId,
  )
  const activeCandidate = hiringScaleCandidates[activeIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveId((current) => {
        const index = hiringScaleCandidates.findIndex(
          (candidate) => candidate.id === current,
        )
        return hiringScaleCandidates[(index + 1) % hiringScaleCandidates.length]
          .id
      })
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [activeId])

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Whether you&apos;re hiring your 5th person or your 500th.
        </h2>
        <p className={styles.subcopy}>
          AuxHR dynamically scales with organizational complexity and hiring
          volume.
        </p>
      </div>

      <div className={styles.panel}>
        <div className={styles.card}>
          <div key={activeCandidate.id} className={styles.photoFrame}>
            <img
              src={activeCandidate.photo}
              alt=""
              className={styles.photo}
              aria-hidden
            />
            <div className={styles.overlay}>
              <span className={styles.badge}>
                <img src={badgeCheck} alt="" aria-hidden />
              </span>
              <p className={styles.name}>{activeCandidate.name}</p>
              <p className={styles.role}>
                <span>{activeCandidate.role}</span>
                <span className={styles.fit}>{activeCandidate.fitLabel}</span>
              </p>
              <div className={styles.tags}>
                {activeCandidate.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={styles.rail}
          role="tablist"
          style={{ '--active-index': activeIndex } as React.CSSProperties}>
          <svg className={styles.connector} viewBox="-2 0 28 34" aria-hidden>
            <path d="M-2 8H0Q0 12 4 12H12Q24 12 24 0H26V34H24Q24 22 12 22H4Q0 22 0 26H-2Z" />
          </svg>
          {hiringScaleCandidates.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              role="tab"
              aria-selected={candidate.id === activeId}
              aria-label={candidate.name}
              className={cn(
                styles.thumb,
                candidate.id === activeId && styles.thumbActive,
              )}
              onClick={() => setActiveId(candidate.id)}>
              <img src={candidate.photo} alt="" aria-hidden />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
