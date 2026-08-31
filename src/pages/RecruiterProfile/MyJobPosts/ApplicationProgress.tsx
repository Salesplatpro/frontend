import React from 'react'
import { GoTasklist } from 'react-icons/go'
import { SiReaddotcv } from 'react-icons/si'
import { TbEdit } from 'react-icons/tb'
import { useParams } from 'react-router-dom'

import { PageShell } from '@/components/layout/PageShell'
import { CvFile } from '@/components/ui/CvFile'
import { Spinner } from '@/components/ui/Spinner'
import { VerdictBadge } from '@/components/ui/VerdictBadge'
import { useApplication } from '@/features/applications/hooks/useApplication'
import { useUpdateApplicationStatus } from '@/features/applications/hooks/useUpdateApplicationStatus'

import { Button } from '../../../components'
import styles from './ApplicationProgress.module.scss'
import { EachProgressDetails } from './EachProgressDetails'
import { getApplicationDetails } from './getApplicationDetails'
import { Messaging } from './Messaging/Messaging'
import { ProfileCard } from './ProfileCard'

const iconSize = 32
const iconColor = ' #4985df'

export const ApplicationProgress = () => {
  const { applicationId } = useParams()
  const { data, error, isLoading } = useApplication(applicationId)
  const { updateStatus, isUpdating } = useUpdateApplicationStatus(
    applicationId ?? '',
  )

  const application = data?.data?.application

  const {
    firstName,
    lastName,
    bio,
    experience,
    prescreeningScore,
    cvSimilarityScore,
    personalizedScore,
    type,
    jodStatus,
    talentId,
    cvFileName,
    hasCv,
    matchVerdict,
    matchVerdictReasoning,
    matchRecommendation,
    matchStrengths,
    matchWeaknesses,
    matchRisks,
  } = getApplicationDetails(data)

  const progress = [
    {
      icon: <GoTasklist size={iconSize} color={iconColor} />,
      title: 'Pre-Assessment',
      score: prescreeningScore,
    },
    {
      icon: <SiReaddotcv size={iconSize} color={iconColor} />,
      title: 'CV-Matching',
      score: cvSimilarityScore,
    },
    {
      icon: <TbEdit size={iconSize} color={iconColor} />,
      title: 'Personality Test',
      score: personalizedScore,
    },
  ]

  const personality = {
    icon: <TbEdit size={iconSize} color={iconColor} />,
    title: 'Personalized Test',
    score: type,
  }

  const handleStatusUpdate = async (status: 'rejected' | 'shortlisted') => {
    await updateStatus(status)
  }

  if (error) {
    return <div className={styles.error}>Error loading job details</div>
  }

  if (isLoading) {
    return <Spinner fullPage />
  }

  const pending = !matchVerdict && application?.matchVerdictStatus === 'pending'
  const failed =
    !matchVerdict &&
    application?.currentStage === 'completed' &&
    application?.matchVerdictStatus !== 'pending'

  return (
    <PageShell>
      <ProfileCard
        firstName={firstName}
        lastName={lastName}
        role={experience}
        description={bio}
        jobStatus={jodStatus}
      />
      <div className={styles.progressList}>
        {progress.map((item, index) => (
          <EachProgressDetails
            key={index}
            title={item.title}
            useScore
            percentage={item.score}
          />
        ))}
        <EachProgressDetails
          title={personality.title}
          percentage={personality.score}
          personality={personality.score}
        />
      </div>
      <div className={styles.rankLine}>
        rank: {application?.rank} of {application?.job?.noOfApplicants}{' '}
        applicants
      </div>

      {(matchVerdict || pending || failed) && (
        <div className={styles.verdictSection}>
          <VerdictBadge
            verdict={matchVerdict}
            reasoning={matchVerdictReasoning}
            strengths={matchStrengths}
            weaknesses={matchWeaknesses}
            risks={matchRisks}
            recommendation={matchRecommendation}
            pending={pending}
            failed={failed}
          />
        </div>
      )}

      {hasCv && (
        <div className={styles.cvSection}>
          <CvFile fileName={cvFileName || 'CV.pdf'} />
        </div>
      )}

      <div className={styles.decisionActions}>
        <Button
          variant="outline"
          size="wide"
          fullWidth
          onClick={() => handleStatusUpdate('rejected')}
          loading={isUpdating}
          disabled={jodStatus === 'rejected'}>
          Reject
        </Button>
        <Button
          variant="primary"
          size="wide"
          fullWidth
          onClick={() => handleStatusUpdate('shortlisted')}
          loading={isUpdating}
          disabled={jodStatus === 'shortlisted'}>
          Shortlist
        </Button>
      </div>
      <div>
        <Messaging
          applicationId={applicationId}
          talentId={talentId ?? undefined}
        />
      </div>
    </PageShell>
  )
}
