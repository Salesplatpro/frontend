import { Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { WorkType } from '@/components/features/jobs/WorkTypeCheckboxes'
import {
  EMPTY_LOCATION,
  resolveLocationFromNames,
} from '@/components/forms/LocationSelect'
import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { BackButton } from '@/components/ui/BackButton'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useJobEditDraftStore } from '@/features/jobs/store/useJobEditDraftStore'
import {
  useAiConfigMutation,
  useGenerateJobContentMutation,
  useGetAiConfigQuery,
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

const toAiConfigFieldValues = (aiConfig: {
  name?: string | null
  prescreeningAssessment?: boolean
  minPrescreeningScore?: number | null
  cvSimilarity?: boolean
  minCvSimilarityScore?: number | null
  personalizedAssessment?: boolean
  noPersonalizedQuestions?: number | null
  personalityEvaluation?: boolean
  noOfEIQuestions?: number | null
  noOfSNQuestions?: number | null
  noOfTFQuestions?: number | null
  noOfJPQuestions?: number | null
  uploadedQuestions?: string[] | null
  recruiterGuide?: string | null
}): AiConfigFieldValues => ({
  name: aiConfig.name ?? '',
  prescreeningAssessment: aiConfig.prescreeningAssessment ? 'true' : 'false',
  minPrescreeningScore: aiConfig.minPrescreeningScore ?? '',
  cvSimilarity: aiConfig.cvSimilarity ? 'true' : 'false',
  minCvSimilarityScore: aiConfig.minCvSimilarityScore ?? '',
  personalizedAssessment: aiConfig.personalizedAssessment ? 'true' : 'false',
  noPersonalizedQuestions: aiConfig.noPersonalizedQuestions ?? '',
  personalityEvaluation: aiConfig.personalityEvaluation ? 'true' : 'false',
  noOfEIQuestions: aiConfig.noOfEIQuestions ?? '',
  noOfSNQuestions: aiConfig.noOfSNQuestions ?? '',
  noOfTFQuestions: aiConfig.noOfTFQuestions ?? '',
  noOfJPQuestions: aiConfig.noOfJPQuestions ?? '',
  uploadedQuestions: aiConfig.uploadedQuestions?.length
    ? aiConfig.uploadedQuestions
    : [''],
  recruiterGuide: aiConfig.recruiterGuide ?? '',
})

export const EditJobTab = () => {
  const { jobId } = useParams()
  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const [updateJob] = useUpdateJobMutation()
  const [patchAiConfig] = usePatchAiConfigMutation()
  const [createAiConfig] = useAiConfigMutation()
  const [generateJobContent, { isLoading: isGeneratingWithAI }] =
    useGenerateJobContentMutation()
  const { drafts, saveDraft, clearDraft } = useJobEditDraftStore()
  const { questionsByPair, generateQuestion, removeQuestion, loadingPairs } =
    useGeneratedQuestion(jobId)

  const job = data?.data?.job ?? data?.data
  const nestedAiConfig = job?.aiConfig ?? null
  const aiConfigId: string = nestedAiConfig?.id ?? job?.aiConfigId ?? ''

  const { data: aiConfigResp, isLoading: aiConfigLoading } =
    useGetAiConfigQuery(aiConfigId, { skip: !aiConfigId })

  const draftSaver = useCallback(
    (v: EditJobFormValues) => saveDraft(jobId ?? '', v),
    [saveDraft, jobId],
  )

  useEffect(() => {
    if (error) {
      notify('error', 'Error loading job post')
    }
  }, [error])

  const fetchedAiConfig = aiConfigResp?.data?.aiConfig ?? nestedAiConfig ?? null

  const aiConfigInitialValues = useMemo<AiConfigFieldValues>(
    () =>
      fetchedAiConfig
        ? toAiConfigFieldValues(fetchedAiConfig)
        : AI_CONFIG_DEFAULT_VALUES,
    [fetchedAiConfig],
  )

  if (isLoading || (aiConfigId && aiConfigLoading)) {
    return <Spinner fullPage />
  }

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

  const savedDraft = drafts[jobId ?? ''] as EditJobFormValues | undefined

  // Prefer the live attached AI config over any stale local draft so Edit Job
  // always shows the configuration currently linked to this job. Job detail
  // fields may still come from the draft.
  const initialValues: EditJobFormValues = {
    jobBrief: savedDraft?.jobBrief ?? jobInitialValues.jobBrief,
    role: jobInitialValues.role,
    requirements: savedDraft?.requirements ?? jobInitialValues.requirements,
    minSalary: savedDraft?.minSalary ?? jobInitialValues.minSalary,
    maxSalary: savedDraft?.maxSalary ?? jobInitialValues.maxSalary,
    compensationPeriod:
      savedDraft?.compensationPeriod ?? jobInitialValues.compensationPeriod,
    currency: savedDraft?.currency ?? jobInitialValues.currency,
    workMode: savedDraft?.workMode ?? jobInitialValues.workMode,
    experienceLevel:
      savedDraft?.experienceLevel ?? jobInitialValues.experienceLevel,
    location: savedDraft?.location ?? jobInitialValues.location,
    skills: savedDraft?.skills ?? jobInitialValues.skills,
    goals: savedDraft?.goals ?? jobInitialValues.goals,
    status: savedDraft?.status ?? job.status ?? 'draft',
    aiConfig: aiConfigInitialValues,
  }

  const handleGenerateWithAI = async (
    values: EditJobFormValues,
    setFieldValue: (key: keyof PostJobFormValues, value: unknown) => void,
  ) => {
    try {
      const response = await generateJobContent({
        role: values.role,
        experienceLevel: values.experienceLevel || undefined,
        keywords: values.skills,
      }).unwrap()
      const content = response?.data?.content
      if (!content) return

      setFieldValue('jobBrief', content.jobBrief)
      setFieldValue('requirements', content.requirements)
      if (Array.isArray(content.skills) && content.skills.length > 0) {
        setFieldValue('skills', content.skills)
      }
      if (Array.isArray(content.goals) && content.goals.length > 0) {
        setFieldValue('goals', content.goals)
      }
      notify(
        'success',
        'Job content generated — feel free to edit before submitting.',
      )
    } catch (err) {
      notify(
        'error',
        getErrorMessage(
          err,
          'Failed to generate job content. Please try again.',
        ),
      )
    }
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
    if (aiConfigValues.cvSimilarity === 'false') {
      delete cleanedAiConfig.minCvSimilarityScore
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
      // Each dichotomy pair is independently optional (only one of the four
      // is required overall) — a blank count means "skip this pair" and must
      // not be sent as '' (fails backend isInt()).
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
    <PageShell>
      <BackButton />
      <PageHero
        compact
        title={`Edit ${capitalizeEachWord(job.role?.name)} Job`}
        lead="Modify your existing job post"
      />

      <JobStatusControl
        jobId={jobId ?? ''}
        status={job.status ?? 'draft'}
        aiConfigId={aiConfigId}
      />

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
              onGenerateWithAI={() =>
                handleGenerateWithAI(values, setFieldValue)
              }
              isGeneratingWithAI={isGeneratingWithAI}
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
    </PageShell>
  )
}
