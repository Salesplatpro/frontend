import React from 'react'

import styles from './AssessmentChat.module.scss'

type QaPair = {
  question: string
  answer: string
}

type AssessmentChatProps = {
  items?: QaPair[] | null
}

export const AssessmentChat = ({ items }: AssessmentChatProps) => {
  if (!items?.length) {
    return <p className={styles.empty}>No answers submitted yet.</p>
  }

  return (
    <div
      className={styles.thread}
      role="log"
      aria-label="Assessment questions and answers">
      {items.map((item, index) => (
        <React.Fragment key={`${item.question}-${index}`}>
          <div className={`${styles.row} ${styles.received}`}>
            <div className={styles.bubble}>
              <span className={styles.role}>Question</span>
              <p className={styles.content}>{item.question}</p>
            </div>
          </div>
          <div className={`${styles.row} ${styles.own}`}>
            <div className={styles.bubble}>
              <span className={styles.role}>Talent</span>
              <p className={styles.content}>{item.answer?.trim() || '—'}</p>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
