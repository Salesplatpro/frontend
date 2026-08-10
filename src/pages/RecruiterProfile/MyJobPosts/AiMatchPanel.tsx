import React from 'react'
import { IoClose } from 'react-icons/io5'

import { Avatar } from '@/components/ui/Avatar'
import { VerdictBadge } from '@/components/ui/VerdictBadge'
import { openTalentCv } from '@/features/profile/services/openTalentCv'
import type { SingleJobDetails } from '@/utils/recruiterJobPostsTypes'

import styles from './AiMatchPanel.module.scss'

const RECOMMENDATION_LABELS: Record<string, string> = {
  hire: 'Hire',
  interview_further: 'Interview further',
  no_hire: 'Do not hire',
}

const VERDICT_LABELS: Record<string, string> = {
  high: 'Strong fit',
  medium: 'Moderate fit',
  low: 'Weak fit',
}

type AiMatchPanelProps = {
  application: SingleJobDetails
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

const BulletList = ({ items }: { items: string[] }) => (
  <ul className={styles.list}>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
)

const EmptyNote = ({ text }: { text: string }) => (
  <p className={styles.empty}>{text}</p>
)

export const AiMatchPanel = ({ application, onClose }: AiMatchPanelProps) => {
  const { talent } = application
  const fullName = `${talent.firstName} ${talent.lastName}`.trim()

  const profileDetails = [
    talent.experience ? `Experience: ${talent.experience}` : null,
    talent.bio ? talent.bio : null,
    application.cvSimilarityScore != null
      ? `CV match score: ${application.cvSimilarityScore}%`
      : null,
    application.personalizedScore != null
      ? `Personalized assessment: ${application.personalizedScore}%`
      : null,
    talent.prescreeningScore != null
      ? `Pre-assessment: ${talent.prescreeningScore}%`
      : null,
  ].filter(Boolean) as string[]

  const strengths = application.matchStrengths?.filter(Boolean) ?? []
  const weaknesses = application.matchWeaknesses?.filter(Boolean) ?? []
  const risks = application.matchRisks?.filter(Boolean) ?? []
  const reasoning = application.matchVerdictReasoning?.trim() || null
  const recommendation = application.matchRecommendation
    ? RECOMMENDATION_LABELS[application.matchRecommendation]
    : null
  const fitLevel = application.matchVerdict
    ? VERDICT_LABELS[application.matchVerdict]
    : null

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close AI Match panel"
        onClick={onClose}
      />
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`AI Match for ${fullName}`}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <Avatar firstName={talent.firstName} lastName={talent.lastName} />
            <div>
              <h2 className={styles.name}>{fullName || 'Applicant'}</h2>
              <p className={styles.email}>{talent.email}</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close AI Match panel">
            <IoClose size={22} />
          </button>
        </header>

        <div className={styles.body}>
          <Section title="Profile & CV details">
            {profileDetails.length > 0 ? (
              <BulletList items={profileDetails} />
            ) : (
              <EmptyNote text="No profile or CV details are available for this applicant." />
            )}
            {(talent.cvFileName || talent.cvUploadedAt) && (
              <button
                type="button"
                className={styles.cvLink}
                onClick={() => openTalentCv(talent.id)}>
                Open CV
              </button>
            )}
          </Section>

          <Section title="Recommended fit level">
            {application.matchVerdict ? (
              <div className={styles.fitRow}>
                <VerdictBadge
                  verdict={application.matchVerdict}
                  recommendation={application.matchRecommendation}
                  compact
                />
                <span className={styles.fitLabel}>{fitLevel}</span>
                {application.averageScore != null && (
                  <span className={styles.score}>
                    Avg. score {application.averageScore}%
                  </span>
                )}
              </div>
            ) : (
              <EmptyNote text="AI Match has not been generated for this applicant yet." />
            )}
            {recommendation && (
              <p className={styles.recommendation}>
                Hiring recommendation: {recommendation}
              </p>
            )}
            {application.status && (
              <p className={styles.statusLine}>
                Application status: {application.status}
              </p>
            )}
          </Section>

          <Section title="AI recommendation">
            {reasoning ? (
              <p className={styles.prose}>{reasoning}</p>
            ) : (
              <EmptyNote text="No AI recommendation text is available." />
            )}
          </Section>

          <Section title="Why they are a good fit">
            {strengths.length > 0 ? (
              <BulletList items={strengths} />
            ) : (
              <EmptyNote text="No fit strengths were returned from available profile/CV data." />
            )}
          </Section>

          <Section title="Relevant experience">
            {talent.experience || strengths.length > 0 ? (
              <BulletList
                items={[
                  ...(talent.experience
                    ? [`Stated experience level: ${talent.experience}`]
                    : []),
                  ...strengths,
                ]}
              />
            ) : (
              <EmptyNote text="No relevant experience details are available beyond the stored profile." />
            )}
          </Section>

          <Section title="Hiring implications">
            {weaknesses.length > 0 || risks.length > 0 ? (
              <>
                {weaknesses.length > 0 && (
                  <>
                    <p className={styles.subLabel}>Gaps / concerns</p>
                    <BulletList items={weaknesses} />
                  </>
                )}
                {risks.length > 0 && (
                  <>
                    <p className={styles.subLabel}>Risks</p>
                    <BulletList items={risks} />
                  </>
                )}
              </>
            ) : (
              <EmptyNote text="No hiring implications were generated from the available data." />
            )}
          </Section>

          <Section title="Ranking score reason">
            {application.rank != null ? (
              <p className={styles.prose}>
                Ranked #{application.rank}
                {application.averageScore != null
                  ? ` with an average pipeline score of ${application.averageScore}%.`
                  : '.'}{' '}
                {reasoning
                  ? `AI reasoning: ${reasoning}`
                  : 'No additional AI ranking rationale is stored for this applicant.'}
              </p>
            ) : (
              <EmptyNote text="This applicant has not received a ranking score yet." />
            )}
          </Section>
        </div>
      </aside>
    </div>
  )
}
