import React from 'react'

import styles from './ActivityHeatmap.module.scss'
import {
  buildHeatmapWeeks,
  HeatmapDatum,
  heatmapLevel,
  WEEKDAY_SHORT_LABELS,
} from './heatmap'

type ActivityHeatmapProps = {
  data: HeatmapDatum[]
  emptyLabel?: string
}

const formatLabel = (isoDate: string, count: number) => {
  const date = new Date(`${isoDate}T00:00:00`)
  const readable = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  if (count === 0) return `No activity on ${readable}`
  return `${count} ${
    count === 1 ? 'application' : 'applications'
  } on ${readable}`
}

export const ActivityHeatmap = ({
  data,
  emptyLabel = 'No application activity in the last 12 weeks',
}: ActivityHeatmapProps) => {
  const weeks = buildHeatmapWeeks(data)
  const max = Math.max(0, ...data.map((item) => item.count))
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className={styles.wrap}>
      <div className={styles.grid} role="img" aria-label="Activity heatmap">
        <div className={styles.weekdays}>
          {WEEKDAY_SHORT_LABELS.map((label, index) => (
            <span
              key={label}
              className={index % 2 === 1 ? styles.weekdayMuted : undefined}>
              {index % 2 === 1 ? label : ''}
            </span>
          ))}
        </div>
        <div className={styles.weeks}>
          {weeks.map((week, weekIndex) => (
            <div key={week[0]?.date ?? weekIndex} className={styles.week}>
              {week.map((day) => (
                <span
                  key={day.date}
                  className={`${styles.cell} ${
                    styles[`level${heatmapLevel(day.count, max)}`]
                  } ${day.inRange ? '' : styles.future}`}
                  title={formatLabel(day.date, day.count)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.caption}>
          {total === 0 ? emptyLabel : `${total} in the last 12 weeks`}
        </p>
        <div className={styles.legend} aria-hidden>
          <span>Less</span>
          <span className={`${styles.cell} ${styles.level0}`} />
          <span className={`${styles.cell} ${styles.level1}`} />
          <span className={`${styles.cell} ${styles.level2}`} />
          <span className={`${styles.cell} ${styles.level3}`} />
          <span className={`${styles.cell} ${styles.level4}`} />
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
