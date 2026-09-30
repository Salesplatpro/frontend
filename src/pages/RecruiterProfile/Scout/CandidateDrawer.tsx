import React from 'react'

import { Button } from '@/components/ui'
import { Drawer } from '@/components/ui/Drawer/Drawer'
import { MatchScoreRing } from '@/components/ui/MatchScoreRing'
import { openScoutCandidateCv } from '@/features/scout/services/scoutService'
import type { ScoutCv } from '@/features/scout/types'

import styles from './CandidateDrawer.module.scss'

/** Pulls one labelled section back out of the stored "Label: a; b" insights text. */
const insightSection = (insights: string | null, label: string): string[] => {
  if (!insights) return []
  const line = insights
    .split('\n')
    .find((entry) => entry.toLowerCase().startsWith(`${label.toLowerCase()}:`))
  if (!line) return []
  return line
    .slice(line.indexOf(':') + 1)
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
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

const List = ({ items, tone }: { items: string[]; tone: 'good' | 'warn' }) => (
  <ul className={[styles.list, styles[tone]].join(' ')}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

export type CandidateDrawerProps = {
  cv: ScoutCv | null
  onClose: () => void
}

export const CandidateDrawer = ({ cv, onClose }: CandidateDrawerProps) => {
  if (!cv) return null

  const strengths = insightSection(cv.insights, 'Strengths')
  const concerns = insightSection(cv.insights, 'Concerns')
  const mustHavesMet = insightSection(cv.insights, 'Met must-haves')
  const mustHavesMissing = insightSection(cv.insights, 'Missing must-haves')
  const contact = [
    cv.candidateEmail,
    cv.candidatePhone,
    cv.candidateAddress,
  ].filter(Boolean)

  return (
    <Drawer
      open
      onClose={onClose}
      title={cv.candidateName ?? cv.cvName ?? 'Candidate'}
      subtitle={cv.candidate?.headline ?? cv.cvName ?? undefined}
      actions={
        cv.candidateId ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => void openScoutCandidateCv(cv.candidateId as string)}>
            Open CV
          </Button>
        ) : undefined
      }>
      <div className={styles.scoreRow}>
        <MatchScoreRing
          verdict={
            cv.evaluationScore == null
              ? null
              : cv.evaluationScore >= 75
              ? 'high'
              : cv.evaluationScore >= 50
              ? 'medium'
              : 'low'
          }
          averageScore={cv.evaluationScore ?? 0}
        />
        <div className={styles.scoreMeta}>
          <span className={styles.scoreValue}>
            {cv.evaluationScore == null
              ? 'Not scored'
              : `${cv.evaluationScore}% match`}
          </span>
          {cv.rank !== null && (
            <span className={styles.scoreRank}>
              Ranked #{cv.rank} in this run
            </span>
          )}
        </div>
      </div>

      <Section title="Why the AI picked them">
        <p className={styles.prose}>
          {cv.recommendation ??
            'The AI did not record a reason for this candidate.'}
        </p>
      </Section>

      {strengths.length > 0 && (
        <Section title="Strengths">
          <List items={strengths} tone="good" />
        </Section>
      )}

      {concerns.length > 0 && (
        <Section title="Things to check">
          <List items={concerns} tone="warn" />
        </Section>
      )}

      {(mustHavesMet.length > 0 || mustHavesMissing.length > 0) && (
        <Section title="Must-have skills">
          <div className={styles.chips}>
            {mustHavesMet.map((skill) => (
              <span
                key={skill}
                className={[styles.chip, styles.chipMet].join(' ')}>
                {skill}
              </span>
            ))}
            {mustHavesMissing.map((skill) => (
              <span
                key={skill}
                className={[styles.chip, styles.chipMissing].join(' ')}>
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section title="Contact details">
        {contact.length === 0 ? (
          <p className={styles.empty}>
            The AI found no contact details on this CV.
          </p>
        ) : (
          <dl className={styles.contact}>
            {cv.candidateEmail && (
              <>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${cv.candidateEmail}`}>
                    {cv.candidateEmail}
                  </a>
                </dd>
              </>
            )}
            {cv.candidatePhone && (
              <>
                <dt>Phone</dt>
                <dd>{cv.candidatePhone}</dd>
              </>
            )}
            {cv.candidateAddress && (
              <>
                <dt>Location</dt>
                <dd>{cv.candidateAddress}</dd>
              </>
            )}
          </dl>
        )}
      </Section>

      {cv.candidate?.skills && cv.candidate.skills.length > 0 && (
        <Section title="Skills the AI read from the CV">
          <div className={styles.chips}>
            {cv.candidate.skills.map((skill) => (
              <span key={skill} className={styles.chip}>
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}
    </Drawer>
  )
}
