import { Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { WorkType } from '@/components/features/jobs/WorkTypeCheckboxes'
import {
  EMPTY_LOCATION,
  resolveLocationFromNames,
} from '@/components/forms/LocationSelect'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useJobEditDraftStore } from '@/features/jobs/store/useJobEditDraftStore'
import {
  useAiConfigMutation,
  usePatchAiConfigMutation,
  useUpdateJobMutation,
} from '@/redux/api/recruiter'
import { useIndividualJobQuery } from '@/redux/api/talent'
import { capitalizeEachWord } from '@/utils/CapitalizeWord'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { PostJobFormValues } from '@/utils/jobPostTypes'
import { notify } from '@/utils/toastNotifications'

import {
  AI_CONFIG_DEFAULT_VALUES,
  AiConfigFields,
  AiConfigFieldValues,
  DICHOTOMY_COUNT_FIELDS,
} from '../PostJobs/AiConfig/AiConfigFields'
import useGeneratedQuestion from '../PostJobs/AiConfig/useGeneratedQuestion'
import { JobDetailsFields } from '../PostJobs/JobDetailsFields'
import postJobStyles from '../PostJobs/PostJob.module.scss'
import tabStyles from '../PostJobs/PostJobTab.module.scss'
import { editJobValidationSchema } from './editJobValidationSchema'
import { JobStatusControl } from './JobStatusControl'

type EditJobFormValues = PostJobFormValues & {
  status: string
  aiConfig: AiConfigFieldValues
}

const FormObserver: React.FC<{ saveDraft: (v: EditJobFormValues) => void }> = ({
  saveDraft,
}) => {
  const { values } = useFormikContext<EditJobFormValues>()
  useEffect(() => {
    saveDraft(values)
  }, [values, saveDraft])
  return null
}

export const EditJobTab = () => {
  const { jobId } = useParams()
  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const [updateJob] = useUpdateJobMutation()
  const [patchAiConfig] = usePatchAiConfigMutation()
  const [createAiConfig] = useAiConfigMutation()
  const { drafts, saveDraft, clearDraft } = useJobEditDraftStore()
  const { questionsByPair, generateQuestion, removeQuestion, loadingPairs } =
    useGeneratedQuestion(jobId)

  const draftSaver = useCallback(
    (v: EditJobFormValues) => saveDraft(jobId ?? '', v),
    [saveDraft, jobId],
  )

  useEffect(() => {
    if (error) {
      notify('error', 'Error loading job post')
    }
  }, [error])

  if (isLoading) return <Spinner fullPage />

  const job = data?.data?.job ?? data?.data
  const aiConfig = job?.aiConfig ?? null
  const aiConfigId: string = aiConfig?.id ?? job?.aiConfigId ?? ''

  if (!job) {
    return null
  }

  const rawWorkMode = job.workMode
  const workMode: WorkType[] = Array.isArray(rawWorkMode)
    ? (rawWorkMode as WorkType[])
    : rawWorkMode
    ? [rawWorkMode as WorkType]
    : []

  const jobInitialValues: PostJobFormValues = {
    jobBrief: job.jobBrief || '',
    role: job.role?.id || '',
    requirements: job.requirements || '',
    minSalary: String(job.minSalary ?? ''),
    maxSalary: String(job.maxSalary ?? ''),
    compensationPeriod: job.compensationPeriod || 'yearly',
    currency: job.currency || '',
    workMode,
    experienceLevel: job.experienceLevel || '',
    location: resolveLocationFromNames(
      job.locationCountry ?? undefined,
      job.locationState ?? undefined,
      job.locationCity ?? undefined,
    ) ?? { ...EMPTY_LOCATION },
    skills: job.skills || [],
    goals: job.goals || [],
  }

  const aiConfigInitialValues: AiConfigFieldValues = aiConfig
    ? {
        name: aiConfig.name ?? '',
        prescreeningAssessment: aiConfig.prescreeningAssessment
          ? 'true'
          : 'false',
        minPrescreeningScore: aiConfig.minPrescreeningScore ?? '',
        cvSimilarity: aiConfig.cvSimilarity ? 'true' : 'false',
        minCvSimilarityScore: aiConfig.minCvSimilarityScore ?? '',
        noOfCvSimilarCandidates: aiConfig.noOfCvSimilarCandidates ?? '',
        personalizedAssessment: aiConfig.personalizedAssessment
          ? 'true'
          : 'false',
        noPersonalizedQuestions: aiConfig.noPersonalizedQuestions ?? '',
        personalityEvaluation: aiConfig.personalityEvaluation
          ? 'true'
          : 'false',
        noOfEIQuestions: aiConfig.noOfEIQuestions ?? '',
        noOfSNQuestions: aiConfig.noOfSNQuestions ?? '',
        noOfTFQuestions: aiConfig.noOfTFQuestions ?? '',
        noOfJPQuestions: aiConfig.noOfJPQuestions ?? '',
        uploadedQuestions: aiConfig.uploadedQuestions?.length
          ? aiConfig.uploadedQuestions
          : [''],
        recruiterGuide: aiConfig.recruiterGuide ?? '',
      }
    : AI_CONFIG_DEFAULT_VALUES

  const savedDraft = drafts[jobId ?? ''] as EditJobFormValues | undefined

  const initialValues: EditJobFormValues = savedDraft ?? {
    ...jobInitialValues,
    status: job.status ?? 'draft',
    aiConfig: aiConfigInitialValues,
  }

  const onSubmit = async (
    values: EditJobFormValues,
    { setSubmitting }: FormikHelpers<EditJobFormValues>,
  ) => {
    // Status changes go through JobStatusControl, not this submit.
    const {
      location,
      aiConfig: aiConfigValues,
      status,
      maxSalary,
      ...rest
    } = values
    void status
    const jobPayload = {
      ...rest,
      ...(maxSalary ? { maxSalary } : {}),
      locationCountry: location.country.name,
      ...(location.state.name ? { locationState: location.state.name } : {}),
      ...(location.city.name ? { locationCity: location.city.name } : {}),
    }

    const cleanedAiConfig: Partial<AiConfigFieldValues> = { ...aiConfigValues }
    if (aiConfigValues.prescreeningAssessment === 'false') {
      delete cleanedAiConfig.minPrescreeningScore
    }
    if (aiConfigValues.cvSimilarity === 'false') {
      delete cleanedAiConfig.minCvSimilarityScore
      delete cleanedAiConfig.noOfCvSimilarCandidates
    }
    if (aiConfigValues.personalizedAssessment === 'false') {
      delete cleanedAiConfig.noPersonalizedQuestions
    }
    if (aiConfigValues.personalityEvaluation === 'false') {
      delete cleanedAiConfig.uploadedQuestions
      delete cleanedAiConfig.noOfEIQuestions
      delete cleanedAiConfig.noOfSNQuestions
      delete cleanedAiConfig.noOfTFQuestions
      delete cleanedAiConfig.noOfJPQuestions
    } else {
      // Validation requires all four counts when personalityEvaluation is
      // enabled; this only guards against a stray '' slipping through
      // (fails backend isInt()) rather than representing an intentional skip.
      DICHOTOMY_COUNT_FIELDS.forEach((field) => {
        if (cleanedAiConfig[field] === '' || cleanedAiConfig[field] == null) {
          delete cleanedAiConfig[field]
        }
      })
    }
    if (!aiConfigValues.recruiterGuide) {
      delete cleanedAiConfig.recruiterGuide
    }

    const aiConfigPayload = {
      ...cleanedAiConfig,
      prescreeningAssessment: cleanedAiConfig.prescreeningAssessment === 'true',
      cvSimilarity: cleanedAiConfig.cvSimilarity === 'true',
      personalizedAssessment: cleanedAiConfig.personalizedAssessment === 'true',
      personalityEvaluation: cleanedAiConfig.personalityEvaluation === 'true',
    }

    const [jobResult, aiConfigResult] = await Promise.allSettled([
      updateJob({ jobId, data: jobPayload }).unwrap(),
      aiConfigId
        ? patchAiConfig({ aiConfigId, data: aiConfigPayload }).unwrap()
        : createAiConfig({ ...aiConfigPayload, jobId }).unwrap(),
    ])

    if (jobResult.status === 'rejected') {
      notify(
        'error',
        getErrorMessage(jobResult.reason, 'Failed to update job details'),
      )
    }
    if (aiConfigResult.status === 'rejected') {
      notify(
        'error',
        getErrorMessage(aiConfigResult.reason, 'Failed to update AI config'),
      )
    }
    if (
      jobResult.status === 'fulfilled' &&
      aiConfigResult.status === 'fulfilled'
    ) {
      clearDraft(jobId ?? '')
      notify('success', 'Job updated successfully')
    }

    setSubmitting(false)
  }

  return (
    <div className={tabStyles.page}>
      <h2 className={tabStyles.heading}>
        Edit {capitalizeEachWord(job.role?.name)} Job
      </h2>
      <p className={tabStyles.subheading}>Modify your existing job post</p>

      <JobStatusControl jobId={jobId ?? ''} status={job.status ?? 'draft'} />

      <Formik
        initialValues={initialValues}
        validationSchema={editJobValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <FormObserver saveDraft={draftSaver} />

            <JobDetailsFields
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={(key, value) => setFieldValue(key, value)}
              roleDisabled
            />

            <h2 className={tabStyles.heading}>AI Configuration</h2>

            <AiConfigFields
              values={values.aiConfig}
              errors={errors.aiConfig ?? {}}
              fieldName={(key) => `aiConfig.${key}`}
              setFieldValue={(key, value) =>
                setFieldValue(`aiConfig.${key}`, value)
              }
              jobId={jobId}
              questionsByPair={questionsByPair}
              loadingPairs={loadingPairs}
              generateQuestion={generateQuestion}
              removeQuestion={removeQuestion}
            />

            <div className={postJobStyles.actions}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
