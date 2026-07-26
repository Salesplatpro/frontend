import React from 'react'
import { GoTasklist } from 'react-icons/go'
import { SiReaddotcv } from 'react-icons/si'
import { TbEdit } from 'react-icons/tb'
import { useParams } from 'react-router-dom'

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
  const talentId = application?.talent?.id

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
    cvUrl,
    matchVerdict,
    matchVerdictReasoning,
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

  const verdictPending =
    application?.currentStage === 'completed' && !matchVerdict

  return (
    <div className={styles.page}>
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

      {(matchVerdict || verdictPending) && (
        <div className={styles.verdictSection}>
          <VerdictBadge
            verdict={matchVerdict}
            reasoning={matchVerdictReasoning}
            pending={verdictPending}
          />
        </div>
      )}

      {cvUrl && (
        <div className={styles.cvSection}>
          <CvFile
            fileName={decodeURIComponent(cvUrl.split('/').pop() || 'CV')}
            url={cvUrl}
          />
        </div>
      )}

      <div className={styles.decisionActions}>
        <Button
          variant="outline"
          size="wide"
          fullWidth
          onClick={() => handleStatusUpdate('rejected')}
          disabled={isUpdating || jodStatus === 'rejected'}>
          {isUpdating ? 'Rejecting...' : 'Reject'}
        </Button>
        <Button
          variant="primary"
          size="wide"
          fullWidth
          onClick={() => handleStatusUpdate('shortlisted')}
          disabled={isUpdating || jodStatus === 'shortlisted'}>
          {isUpdating ? 'Shortlisting...' : 'Shortlist'}
        </Button>
      </div>
      <div>
        <Messaging applicationId={applicationId} talentId={talentId} />
      </div>
    </div>
  )
}
