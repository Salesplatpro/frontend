import React from 'react'
import { IoIosInformationCircle } from 'react-icons/io'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import { PageHero } from '@/components/layout/PageHero'
import { PagePanel, StatCard, StatGrid } from '@/components/layout/PagePanel'
import { Avatar } from '@/components/ui/Avatar'
import { BackButton } from '@/components/ui/BackButton'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useApplication } from '@/features/applications/hooks/useApplication'
import { useUpdateApplicationStatus } from '@/features/applications/hooks/useUpdateApplicationStatus'
import type { JobAiConfigThresholds } from '@/features/applications/services/applicationService'
import { humanStage } from '@/pages/TalentProfile/Job/jobPipeline'
import type { SingleJobDetails } from '@/utils/recruiterJobPostsTypes'

import { AssessmentChat } from './AssessmentChat'
import styles from './CandidateDossierPanel.module.scss'
import { MBTI_TYPES } from './mbtiLegend'
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

const RECOMMENDATION_LABELS: Record<string, string> = {
  hire: 'Recommend: Hire',
  interview_further: 'Recommend: Interview further',
  no_hire: 'Recommend: Do not hire',
}

type CandidateDossierPanelProps = {
  application: SingleJobDetails
  jobAiConfig?: JobAiConfigThresholds | null
  onClose: () => void
  onChanged?: () => void | Promise<void>
}

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

const personalityCaption = (mbtiType?: string | null) =>
  MBTI_TYPES.find((item) => item.type === mbtiType)?.summary ?? null

export const CandidateDossierPanel = ({
  application: row,
  jobAiConfig,
  onClose,
  onChanged,
}: CandidateDossierPanelProps) => {
  const { data, isLoading } = useApplication(row.id)
  const application = (data?.data?.application ?? row) as SingleJobDetails & {
    talent: SingleJobDetails['talent']
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
  const { updateStatus, isUpdating } = useUpdateApplicationStatus(
    application.id,
  )

  const handleStatus = async (status: 'shortlisted' | 'rejected') => {
    await updateStatus(status)
    await onChanged?.()
  }

  const decision =
    application.status === 'shortlisted'
      ? { label: 'Accepted', className: styles.decisionAccepted }
      : application.status === 'rejected'
      ? { label: 'Rejected', className: styles.decisionRejected }
      : { label: 'Decision pending', className: styles.decisionPending }

  const rationale =
    analysis?.hiringRationale ||
    analysis?.whyFit ||
    application.matchVerdictReasoning ||
    ''

  const recommendationLabel = application.matchRecommendation
    ? RECOMMENDATION_LABELS[application.matchRecommendation]
    : null

  const typeCaption = personalityCaption(application.mbtiType)

  const personalityValue = (
    <span className={styles.mbtiValue}>
      {application.mbtiType ?? '—'}
      <button
        type="button"
        className={styles.tooltipTrigger}
        data-tooltip-id="mbti-legend"
        aria-label="What personality type letters mean">
        <IoIosInformationCircle size={18} />
      </button>
    </span>
  )

  return (
    <div className={styles.page}>
      <BackButton onClick={onClose} />
      <PageHero
        compact
        identity={
          <Avatar
            firstName={talent.firstName}
            lastName={talent.lastName}
            size="lg"
          />
        }
        title={fullName || 'Applicant'}
        lead={
          [location, talent.experience].filter(Boolean).join(' · ') ||
          talent.email
        }
        chips={
          <>
            <span className={`${styles.decisionChip} ${decision.className}`}>
              {decision.label}
            </span>
            <StatusBadge
              status={humanStage(application.currentStage)}
              backgroundColor="#f3f4f6"
              color="#374151"
            />
          </>
        }
        actions={
          <div className={styles.heroActions}>
            <Button variant="outline" size="sm" disabled>
              Download CV
              <span className={styles.comingSoon}>Coming soon</span>
            </Button>
            <Button
              size="sm"
              loading={isUpdating}
              onClick={() => void handleStatus('shortlisted')}>
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              loading={isUpdating}
              onClick={() => void handleStatus('rejected')}>
              Reject
            </Button>
          </div>
        }
      />

      {isLoading && !data ? (
        <Spinner />
      ) : (
        <>
          <section
            className={`${styles.recommendation} ${hero?.className ?? ''}`}
            aria-label="AI hiring recommendation">
            <p className={styles.recKicker}>AI recommendation</p>
            <h2 className={styles.recTitle}>
              {hero
                ? `${hero.title} — ${hero.action}`
                : 'Hiring recommendation pending'}
            </h2>
            <p className={styles.recScore}>
              Overall fit{' '}
              {analysis?.overallFitScore != null
                ? `${analysis.overallFitScore}/100`
                : application.averageScore != null
                ? `${application.averageScore}% avg`
                : 'not scored yet'}
              {recommendationLabel ? ` · ${recommendationLabel}` : ''}
            </p>
            {rationale ? (
              <p className={styles.recRationale}>{rationale}</p>
            ) : (
              <p className={styles.empty}>
                AI recommendation appears after the pipeline completes.
              </p>
            )}
            {analysis?.whyHire ? (
              <p className={styles.recRationale}>{analysis.whyHire}</p>
            ) : null}
          </section>

          <StatGrid columns={4}>
            <StatCard
              label={
                jobAiConfig?.minPrescreeningScore != null
                  ? `Prescreening · bar ${jobAiConfig.minPrescreeningScore}%`
                  : 'Prescreening'
              }
              value={scoreLabel(talent.prescreeningScore)}
            />
            <StatCard
              label="CV match"
              value={scoreLabel(application.cvSimilarityScore)}
            />
            <StatCard
              label="Personalized"
              value={scoreLabel(application.personalizedScore)}
            />
            <StatCard
              label="Personality"
              value={personalityValue}
              caption={typeCaption}
            />
          </StatGrid>

          <ReactTooltip
            id="mbti-legend"
            place="bottom"
            className={styles.mbtiTooltip}>
            <p className={styles.mbtiIntro}>
              A four-letter snapshot of how they prefer to work and decide.
            </p>
          </ReactTooltip>

          <PagePanel
            title="Personality answers"
            hint={
              application.mbtiType
                ? `Typed as ${application.mbtiType}`
                : 'Workplace scenarios the talent answered for this job.'
            }>
            <AssessmentChat items={application.personalityAnswers} />
          </PagePanel>

          <PagePanel
            title="Role assessment answers"
            hint="How they said they would do this job.">
            <AssessmentChat items={application.personalizedAnswers} />
          </PagePanel>

          <PagePanel title="Why they fit">
            {analysis?.whyFit ? (
              <p className={styles.prose}>{analysis.whyFit}</p>
            ) : application.matchVerdictReasoning ? (
              <p className={styles.prose}>
                {application.matchVerdictReasoning}
              </p>
            ) : (
              <p className={styles.empty}>
                No structured analysis yet. It appears after screening
                completes.
              </p>
            )}
          </PagePanel>

          <div className={styles.insightGrid}>
            <PagePanel title="Strengths">
              <BulletList
                items={
                  analysis?.strongestQualifications?.length
                    ? analysis.strongestQualifications
                    : application.matchStrengths
                }
              />
            </PagePanel>
            <PagePanel title="Gaps">
              <BulletList
                items={
                  analysis?.missingRequirements?.length
                    ? analysis.missingRequirements
                    : application.matchWeaknesses
                }
              />
            </PagePanel>
            <PagePanel title="Risks">
              <BulletList items={application.matchRisks} />
            </PagePanel>
            <PagePanel title="Evidence">
              <BulletList items={analysis?.keyEvidence} />
            </PagePanel>
          </div>

          <PagePanel title="Messages">
            <Messaging applicationId={application.id} talentId={talent.id} />
          </PagePanel>
        </>
      )}
    </div>
  )
}
