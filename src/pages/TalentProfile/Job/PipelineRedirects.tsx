import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

export const RedirectPipelineToJob = () => {
  const { jobId } = useParams()
  return <Navigate to={`/talentDashboard/job/${jobId}`} replace />
}

export const RedirectPersonalityToJob = () => {
  const { jobId } = useParams()
  return (
    <Navigate to={`/talentDashboard/job/${jobId}?step=personality`} replace />
  )
}

export const RedirectPersonalizedToJob = () => {
  const { jobId } = useParams()
  return (
    <Navigate to={`/talentDashboard/job/${jobId}?step=personalized`} replace />
  )
}
