import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { ScoutFileCard } from '@/components/features/recruiter/Cards'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  clearScoutUploads,
  removeScoutUpload,
  setScoutBatchResult,
} from '@/redux/features/filesSlice/fileSlice'
import { RootState } from '@/redux/store/store'
import { getErrorMessage } from '@/utils/getErrorMessage'

import { Button } from '../../../../components'
import { useUploadScoutCvBatchMutation } from '../../../../redux/api/recruiter'
import { notify } from '../../../../utils/toastNotifications'
import styles from './ProcessCV.module.scss'

type BatchFailure = { message: string; fields?: Record<string, string> }

export const ProcessCV = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const scoutJobId = params.id ?? ''

  const uploads = useSelector((state: RootState) => state.file.scoutUploads)
  const batchResult = useSelector(
    (state: RootState) => state.file.scoutBatchResult,
  )
  const [uploadBatch, { isLoading }] = useUploadScoutCvBatchMutation()
  const [failure, setFailure] = useState<BatchFailure | null>(null)

  // Persistence is atomic server-side, so there's no meaningful per-file progress to
  // show mid-request — warn instead of letting an in-flight batch silently vanish.
  useEffect(() => {
    if (!isLoading) return
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isLoading])

  if (uploads.length === 0 && !batchResult) {
    return (
      <EmptyState
        title="No CVs selected"
        description="Select CVs to upload before scoring them."
        action={
          <Button
            variant="primary"
            onClick={() =>
              navigate(`/recruiterDashboard/scout/upload-cv/${scoutJobId}`)
            }>
            Select CVs
          </Button>
        }
      />
    )
  }

  const handleSubmit = async () => {
    setFailure(null)
    const formData = new FormData()
    formData.append('scoutJobId', scoutJobId)
    uploads.forEach((entry) => formData.append('cv', entry.cv))
    if (uploads.length > 0 && uploads[0]?.coverLetter) {
      uploads.forEach((entry) => {
        if (entry.coverLetter) formData.append('coverLetter', entry.coverLetter)
      })
    }

    try {
      const result = await uploadBatch(formData).unwrap()
      dispatch(setScoutBatchResult(result.data))
      notify('success', 'CVs scored successfully', { autoClose: 2000 })
    } catch (error) {
      const message = getErrorMessage(error, 'Some CVs could not be scored')
      const fields = (
        error as { data?: { error?: { fields?: Record<string, string> } } }
      )?.data?.error?.fields
      setFailure({ message, fields })
      notify('error', message)
    }
  }

  const failureFor = (fileName: string) => failure?.fields?.[fileName]

  const resultFor = (index: number) => batchResult?.scoutReports[index]

  return (
    <div className="py-4 space-y-4">
      <PageHeaderTitle
        paramsId={params}
        description="Upload CVs in batch for collective AI assessment"
        onBack={() => navigate(-1)}
      />

      {failure && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {failure.message}
        </div>
      )}

      <div className={styles.uploader}>
        {uploads.map((entry, index) => (
          <ScoutFileCard
            key={index}
            cv={entry.cv}
            coverLetter={entry.coverLetter}
            result={resultFor(index)}
            failureReason={failureFor(entry.cv.name)}
            onDelete={
              batchResult ? undefined : () => dispatch(removeScoutUpload(index))
            }
          />
        ))}
      </div>

      {!batchResult ? (
        <Button
          variant="primary"
          size="wide"
          fullWidth
          loading={isLoading}
          disabled={isLoading || uploads.length === 0}
          onClick={handleSubmit}>
          {uploads.length === 1 ? 'Score CV' : `Score ${uploads.length} CVs`}
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="wide"
            fullWidth
            onClick={() => {
              dispatch(clearScoutUploads())
              navigate(`/recruiterDashboard/scout/upload-cv/${scoutJobId}`)
            }}>
            Upload Another Batch
          </Button>
          <Button
            variant="primary"
            size="wide"
            fullWidth
            onClick={() => {
              dispatch(clearScoutUploads())
              navigate(`/recruiterDashboard/scout/history/${scoutJobId}`)
            }}>
            View Scout Job
          </Button>
        </div>
      )}
    </div>
  )
}
