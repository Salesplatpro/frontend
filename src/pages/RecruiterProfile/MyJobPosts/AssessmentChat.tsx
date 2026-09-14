import React from 'react'

import styles from './AssessmentChat.module.scss'

type QaPair = {
  question: string
  answer: string
}

export type QuestionFeedbackItem = {
  question: string
  whatTheyAnswered?: string
  whatItDemonstrates?: string
  experienceLink?: string
}

type AssessmentChatProps = {
  items?: QaPair[] | null
  feedback?: QuestionFeedbackItem[] | null
}

const normalizeQuestion = (value: string) =>
  value.replace(/\s+/g, ' ').trim().toLowerCase()

const findFeedback = (
  question: string,
  feedback?: QuestionFeedbackItem[] | null,
) => {
  if (!feedback?.length) return undefined
  const needle = normalizeQuestion(question)
  return (
    feedback.find((item) => normalizeQuestion(item.question) === needle) ??
    feedback.find((item) => {
      const haystack = normalizeQuestion(item.question)
      return haystack.includes(needle) || needle.includes(haystack)
    })
  )
}

export const AssessmentChat = ({ items, feedback }: AssessmentChatProps) => {
  if (!items?.length) {
    return <p className={styles.empty}>No answers submitted yet.</p>
  }

  return (
    <div
      className={styles.thread}
      role="log"
      aria-label="Assessment questions and answers">
      {items.map((item, index) => {
        const note = findFeedback(item.question, feedback)
        return (
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
            {note &&
            (note.whatTheyAnswered ||
              note.whatItDemonstrates ||
              note.experienceLink) ? (
              <div className={styles.feedback}>
                <p className={styles.feedbackKicker}>AI screening note</p>
                {note.whatTheyAnswered ? (
                  <p>
                    <strong>What they answered.</strong> {note.whatTheyAnswered}
                  </p>
                ) : null}
                {note.whatItDemonstrates ? (
                  <p>
                    <strong>What this demonstrates.</strong>{' '}
                    {note.whatItDemonstrates}
                  </p>
                ) : null}
                {note.experienceLink ? (
                  <p>
                    <strong>Verified experience.</strong> {note.experienceLink}
                  </p>
                ) : null}
              </div>
            ) : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}
