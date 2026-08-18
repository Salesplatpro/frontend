import React from 'react'
import { IoClose } from 'react-icons/io5'

import { Avatar } from '@/components/ui/Avatar'

import styles from './ScoutCandidatePanel.module.scss'
import type { ScoutReportRow } from './ScoutJobHistory'

type ScoutCandidatePanelProps = {
  scout: ScoutReportRow
  onClose: () => void
}

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className={styles.section}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    {children}
  </section>
)

const EmptyNote = ({ text }: { text: string }) => (
  <p className={styles.empty}>{text}</p>
)

export const ScoutCandidatePanel = ({
  scout,
  onClose,
}: ScoutCandidatePanelProps) => {
  const displayName = scout.candidateName ?? scout.cvName ?? 'Candidate'
  const [firstName, ...rest] = displayName.split(' ')
  const lastName = rest.join(' ')

  const hasContactDetails =
    scout.candidateEmail || scout.candidatePhone || scout.candidateAddress

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close candidate details panel"
        onClick={onClose}
      />
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Candidate details for ${displayName}`}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <Avatar firstName={firstName} lastName={lastName} />
            <div>
              <h2 className={styles.name}>{displayName}</h2>
              {scout.candidateEmail && (
                <p className={styles.email}>{scout.candidateEmail}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close candidate details panel">
            <IoClose size={22} />
          </button>
        </header>

        <div className={styles.body}>
          <Section title="Contact details">
            {hasContactDetails ? (
              <ul className={styles.list}>
                {scout.candidateEmail && <li>Email: {scout.candidateEmail}</li>}
                {scout.candidatePhone && <li>Phone: {scout.candidatePhone}</li>}
                {scout.candidateAddress && (
                  <li>Address: {scout.candidateAddress}</li>
                )}
              </ul>
            ) : (
              <EmptyNote text="No contact details could be extracted from this CV." />
            )}
          </Section>

          <Section title="CV match">
            {scout.cvScore != null ? (
              <p className={styles.prose}>CV score: {scout.cvScore}%</p>
            ) : (
              <EmptyNote text="No CV score is available." />
            )}
            {scout.insights ? (
              <p className={styles.prose}>{scout.insights}</p>
            ) : (
              <EmptyNote text="No AI reasoning is available for this CV." />
            )}
          </Section>

          {scout.coverLetterScore != null && (
            <Section title="Cover letter match">
              <p className={styles.prose}>
                Cover letter score: {scout.coverLetterScore}%
              </p>
              {scout.coverLetterInsights ? (
                <p className={styles.prose}>{scout.coverLetterInsights}</p>
              ) : (
                <EmptyNote text="No AI reasoning is available for the cover letter." />
              )}
            </Section>
          )}

          <Section title="Overall evaluation">
            {scout.evaluationScore != null ? (
              <p className={styles.prose}>
                Overall evaluation score: {scout.evaluationScore}%
              </p>
            ) : (
              <EmptyNote text="No overall evaluation score is available." />
            )}
          </Section>
        </div>
      </aside>
    </div>
  )
}
