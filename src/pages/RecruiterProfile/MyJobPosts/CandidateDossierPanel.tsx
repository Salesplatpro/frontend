import React from 'react'
import { IoClose } from 'react-icons/io5'

import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { useApplication } from '@/features/applications/hooks/useApplication'
import { useRegenerateVerdict } from '@/features/applications/hooks/useRegenerateVerdict'
import { useUpdateApplicationStatus } from '@/features/applications/hooks/useUpdateApplicationStatus'
import type { JobAiConfigThresholds } from '@/features/applications/services/applicationService'
import { openTalentCv } from '@/features/profile/services/openTalentCv'
import { getStatusBadge } from '@/pages/RecruiterProfile/getJobStatus'
import { humanStage, humanStatus } from '@/pages/TalentProfile/Job/jobPipeline'
import type { SingleJobDetails } from '@/utils/recruiterJobPostsTypes'

import { Button } from '../../../components'
import styles from './CandidateDossierPanel.module.scss'
import { Messaging } from './Messaging/Messaging'

const HERO: Record<
  string,
  { title: string; action: string; className: string }
> = {
  high: {
    title: 'Strong Fit',
    action: 'Hire / Shortlist',
    className: styles.heroHigh,
  },
  medium: {
    title: 'Potential Fit',
    action: 'Review',
    className: styles.heroMedium,
  },
  low: {
    title: 'Poor Fit',
    action: 'Bounce / Reject',
    className: styles.heroLow,
  },
}

type CandidateDossierPanelProps = {
  application: SingleJobDetails
  jobAiConfig?: JobAiConfigThresholds | null
  onClose: () => void
  onChanged?: () => void | Promise<void>
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

const BulletList = ({ items }: { items?: string[] | null }) => {
  const cleaned = items?.filter(Boolean) ?? []
  if (cleaned.length === 0) return <p className={styles.empty}>None recorded</p>
  return (
    <ul className={styles.list}>
      {cleaned.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

const scoreLabel = (value?: number | null, suffix = '%') =>
  value == null ? '—' : `${value}${suffix}`

export const CandidateDossierPanel = ({
  application: row,
  jobAiConfig,
  onClose,
  onChanged,
}: CandidateDossierPanelProps) => {
  const { data, isLoading } = useApplication(row.id)
  const application = (data?.data?.application ?? row) as SingleJobDetails & {
    talent: SingleJobDetails['talent']
    mbtiType?: string | null
    stages?: Record<string, string> | null
  }
  const { talent } = application
  const fullName = `${talent.firstName} ${talent.lastName}`.trim()
  const analysis = application.matchAnalysis
  const hero = application.matchVerdict ? HERO[application.matchVerdict] : null
  const location = [
    talent.locationCity,
    talent.locationState,
    talent.locationCountry,
  ]
    .filter(Boolean)
    .join(', ')
  const { regenerateVerdict, isRegenerating } = useRegenerateVerdict(
    application.id,
  )
  const { updateStatus, isUpdating } = useUpdateApplicationStatus(
    application.id,
  )

  const handleStatus = async (status: 'shortlisted' | 'rejected') => {
    await updateStatus(status)
    await onChanged?.()
  }

  const handleRegenerate = async () => {
    await regenerateVerdict()
    await onChanged?.()
  }

  const rationale =
    analysis?.hiringRationale ||
    analysis?.whyFit ||
    application.matchVerdictReasoning ||
    ''

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close candidate panel"
        onClick={onClose}
      />
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Candidate dossier for ${fullName}`}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <Avatar firstName={talent.firstName} lastName={talent.lastName} />
            <div>
              <h2 className={styles.name}>{fullName || 'Applicant'}</h2>
              <p className={styles.meta}>
                {[location, talent.experience].filter(Boolean).join(' · ') ||
                  talent.email}
              </p>
              <div className={styles.chips}>
                <StatusBadge
                  status={humanStatus(application.status)}
                  {...getStatusBadge(application.status)}
                />
                <StatusBadge
                  status={humanStage(application.currentStage)}
                  backgroundColor="#f3f4f6"
                  color="#374151"
                />
              </div>
              {(talent.cvFileName || talent.cvUploadedAt) && (
                <button
                  type="button"
                  className={styles.cvLink}
                  onClick={() => openTalentCv(talent.id)}>
                  Download CV
                </button>
              )}
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button
              variant="outline"
              size="sm"
              loading={isRegenerating}
              disabled={application.currentStage !== 'completed'}
              onClick={handleRegenerate}>
              Regenerate match
            </Button>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close">
              <IoClose size={22} />
            </button>
          </div>
        </header>

        <div className={styles.body}>
          {isLoading && !data ? (
            <Spinner />
          ) : (
            <>
              <section className={`${styles.hero} ${hero?.className ?? ''}`}>
                <h3 className={styles.heroTitle}>
                  {hero
                    ? `${hero.title} — ${hero.action}`
                    : 'Hiring recommendation'}
                </h3>
                <p className={styles.heroScore}>
                  Overall fit{' '}
                  {analysis?.overallFitScore != null
                    ? `${analysis.overallFitScore}/100`
                    : application.averageScore != null
                    ? `${application.averageScore}% avg`
                    : 'not scored yet'}
                </p>
                {rationale ? (
                  <p className={styles.heroRationale}>{rationale}</p>
                ) : (
                  <p className={styles.empty}>
                    AI recommendation appears after the pipeline completes.
                  </p>
                )}
                <div className={styles.heroActions}>
                  <Button
                    size="sm"
                    loading={isUpdating}
                    onClick={() => void handleStatus('shortlisted')}>
                    Shortlist
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    loading={isUpdating}
                    onClick={() => void handleStatus('rejected')}>
                    Reject
                  </Button>
                </div>
              </section>

              <div className={styles.scoreStrip}>
                <div className={styles.scoreCard}>
                  <div className={styles.scoreLabel}>Prescreening</div>
                  <div className={styles.scoreValue}>
                    {scoreLabel(talent.prescreeningScore)}
                    {jobAiConfig?.minPrescreeningScore != null
                      ? ` · bar ${jobAiConfig.minPrescreeningScore}%`
                      : ''}
                  </div>
                </div>
                <div className={styles.scoreCard}>
                  <div className={styles.scoreLabel}>CV match</div>
                  <div className={styles.scoreValue}>
                    {scoreLabel(application.cvSimilarityScore)}
                  </div>
                </div>
                <div className={styles.scoreCard}>
                  <div className={styles.scoreLabel}>Personalized</div>
                  <div className={styles.scoreValue}>
                    {scoreLabel(application.personalizedScore)}
                  </div>
                </div>
                <div className={styles.scoreCard}>
                  <div className={styles.scoreLabel}>Personality</div>
                  <div className={styles.scoreValue}>
                    {application.mbtiType ?? '—'}
                  </div>
                </div>
              </div>

              <Section title="AI analysis">
                {analysis?.whyFit ? (
                  <p className={styles.prose}>{analysis.whyFit}</p>
                ) : application.matchVerdictReasoning ? (
                  <p className={styles.prose}>
                    {application.matchVerdictReasoning}
                  </p>
                ) : (
                  <p className={styles.empty}>
                    No structured analysis yet. Regenerate match to refresh.
                  </p>
                )}
              </Section>

              <Section title="Why hire">
                {analysis?.whyHire ? (
                  <p className={styles.prose}>{analysis.whyHire}</p>
                ) : (
                  <p className={styles.empty}>
                    Not generated on this recommendation yet.
                  </p>
                )}
              </Section>

              <Section title="Strengths">
                <BulletList
                  items={
                    analysis?.strongestQualifications?.length
                      ? analysis.strongestQualifications
                      : application.matchStrengths
                  }
                />
              </Section>

              <Section title="Gaps">
                <BulletList
                  items={
                    analysis?.missingRequirements?.length
                      ? analysis.missingRequirements
                      : application.matchWeaknesses
                  }
                />
              </Section>

              <Section title="Risks">
                <BulletList items={application.matchRisks} />
              </Section>

              <Section title="Evidence">
                <BulletList items={analysis?.keyEvidence} />
              </Section>

              <Section title="Pipeline results">
                <ul className={styles.list}>
                  <li>Prescreening: {scoreLabel(talent.prescreeningScore)}</li>
                  <li>CV match: {scoreLabel(application.cvSimilarityScore)}</li>
                  <li>
                    Personalized: {scoreLabel(application.personalizedScore)}
                  </li>
                  <li>Personality: {application.mbtiType ?? '—'}</li>
                </ul>
              </Section>

              <Section title="Thread">
                <Messaging
                  applicationId={application.id}
                  talentId={talent.id}
                />
              </Section>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
