import { useState } from 'react'

import { useGenerateJobFieldMutation } from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

export type JobTextField = 'jobBrief' | 'requirements' | 'recruiterGuide'
export type JobListField = 'skills' | 'goals'
export type JobFieldAction =
  | 'regenerate'
  | 'shorter'
  | 'detailed'
  | 'friendlier'

export interface JobAiContext {
  role?: string
  experienceLevel?: string
  jobBrief?: string
  requirements?: string
  skills?: string[]
  goals?: string[]
}

type FieldRequest = {
  field: JobTextField | JobListField
  action?: JobFieldAction
  currentText?: string
  job: JobAiContext
}

export const hasAiContext = (job: JobAiContext) =>
  !!(job.role?.trim() || job.jobBrief?.trim())

/** Calls the single-field AI helper; returns null (after showing a toast) on failure. */
export const useJobFieldAssist = () => {
  const [generateJobField] = useGenerateJobFieldMutation()
  const [pendingKey, setPendingKey] = useState<string | null>(null)

  const run = async (
    key: string,
    request: FieldRequest,
  ): Promise<{ text?: string; suggestions?: string[] } | null> => {
    setPendingKey(key)
    try {
      const response = await generateJobField(request).unwrap()
      return response?.data ?? null
    } catch (err) {
      notify(
        'error',
        getErrorMessage(
          err,
          'The AI could not help with that. Please try again.',
        ),
      )
      return null
    } finally {
      setPendingKey(null)
    }
  }

  return { run, pendingKey }
}
