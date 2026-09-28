import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { useJobDraftStore } from '@/features/jobs/store/useJobDraftStore'
import { PostJobFormValues } from '@/utils/jobPostTypes'

import AiConfig from './AiConfig/AiConfig'
import PostJob from './PostJob'
import { ReviewStep } from './ReviewStep/ReviewStep'
import { StartStep } from './StartStep/StartStep'
import { PostJobStepId, PostJobStepper } from './Stepper/PostJobStepper'

export type PostJobRouteStep = 'new' | 'details' | 'screening' | 'review'

type PostJobTabProps = {
  step?: PostJobRouteStep
}

const BASE_PATH = '/recruiterDashboard/postjob'

const PostJobTab = ({ step = 'new' }: PostJobTabProps) => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { draft, saveDraft, clearDraft } = useJobDraftStore()
  const [newJobStage, setNewJobStage] = useState<'start' | 'details'>(() =>
    draft ? 'details' : 'start',
  )
  const [aiFilledCount, setAiFilledCount] = useState<number | null>(null)

  const current: PostJobStepId = step === 'new' ? newJobStage : step

  const handleGenerated = (values: PostJobFormValues, filledCount: number) => {
    saveDraft(values)
    setAiFilledCount(filledCount)
    setNewJobStage('details')
  }

  const handleStartFromScratch = () => {
    clearDraft()
    setAiFilledCount(null)
    setNewJobStage('details')
  }

  const handleBackToStart = () => {
    setAiFilledCount(null)
    setNewJobStage('start')
  }

  const selectable: PostJobStepId[] = jobId
    ? ['details', 'screening', 'review']
    : newJobStage === 'details'
    ? ['start']
    : []

  const renderContent = () => {
    if (step === 'screening' && jobId) {
      return <AiConfig />
    }
    if (step === 'review' && jobId) {
      return <ReviewStep jobId={jobId} />
    }
    if (step === 'details' && jobId) {
      return <PostJob jobId={jobId} />
    }
    if (newJobStage === 'start') {
      return (
        <StartStep
          hasDraft={!!draft}
          onContinueDraft={() => setNewJobStage('details')}
          onGenerated={handleGenerated}
          onStartFromScratch={handleStartFromScratch}
        />
      )
    }
    return (
      <PostJob
        aiFilledCount={aiFilledCount}
        onBackToStart={handleBackToStart}
      />
    )
  }

  return (
    <PageShell>
      <PageHero
        compact
        title="Create a job"
        lead="Start with AI or from scratch, choose how applicants are screened, then publish."
      />

      <PostJobStepper
        current={current}
        selectable={selectable}
        onSelect={(target) => {
          if (target === 'start') handleBackToStart()
          if (target === 'details' && jobId)
            navigate(`${BASE_PATH}/${jobId}/details`)
          if (target === 'screening' && jobId) navigate(`${BASE_PATH}/${jobId}`)
          if (target === 'review' && jobId)
            navigate(`${BASE_PATH}/${jobId}/review`)
        }}
      />

      <div>{renderContent()}</div>
    </PageShell>
  )
}

export default PostJobTab
