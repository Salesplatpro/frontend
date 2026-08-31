import { Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import React, { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { FormikFocusOnError } from '@/components/forms/FormikFocusOnError'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAiConfigDraftStore } from '@/features/jobs/store/useAiConfigDraftStore'
import {
  useAiConfigMutation,
  useGetAiConfigQuery,
  usePatchAiConfigMutation,
  useUpdateJobMutation,
} from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import styles from './AiConfig.module.scss'
import {
  AI_CONFIG_DEFAULT_VALUES,
  AiConfigFields,
  AiConfigFieldValues,
  DICHOTOMY_COUNT_FIELDS,
  DICHOTOMY_ERROR_KEY,
} from './AiConfigFields'
import { aiConfigValidationSchema } from './aiConfigValidationSchema'
import useGeneratedQuestion from './useGeneratedQuestion'

interface AiConfigValues extends AiConfigFieldValues {
  jobId: string
}

type AiConfigProps = {
  mode?: 'create' | 'edit'
  aiConfigId?: string
}

const FormObserver: React.FC<{ saveDraft: (v: unknown) => void }> = ({
  saveDraft,
}) => {
  const { values } = useFormikContext<AiConfigValues>()
  useEffect(() => {
    saveDraft(values)
  }, [values, saveDraft])
  return null
}

const DEFAULT_VALUES: AiConfigValues = {
  ...AI_CONFIG_DEFAULT_VALUES,
  jobId: '',
}

const identity = (
  key: keyof AiConfigFieldValues | typeof DICHOTOMY_ERROR_KEY,
) => key

const AiConfig = ({ mode = 'create', aiConfigId }: AiConfigProps) => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const isEditMode = mode === 'edit'

  const [aiConfigMutation] = useAiConfigMutation()
  const [patchAiConfig] = usePatchAiConfigMutation()
  const [updateJob] = useUpdateJobMutation()
  const { drafts, saveDraft, clearDraft } = useAiConfigDraftStore()
  const { questionsByPair, generateQuestion, removeQuestion, loadingPairs } =
    useGeneratedQuestion(jobId)

  const { data: existingConfig, isLoading: configLoading } =
    useGetAiConfigQuery(aiConfigId ?? '', { skip: !isEditMode || !aiConfigId })

  // Stable callback for FormObserver — fixes the infinite-loop caused by an
  // inline arrow that creates a new function reference on every render.
  const draftSaver = useCallback(
    (v: unknown) => saveDraft(jobId ?? '', v),
    [saveDraft, jobId],
  )

  if (isEditMode && configLoading) return <Spinner fullPage />

  const configData = existingConfig?.data?.aiConfig

  const editInitialValues: AiConfigValues | null = configData
    ? {
        name: configData.name ?? '',
        jobId: jobId ?? '',
        prescreeningAssessment: configData.prescreeningAssessment
          ? 'true'
          : 'false',
        minPrescreeningScore: configData.minPrescreeningScore ?? '',
        cvSimilarity: configData.cvSimilarity ? 'true' : 'false',
        minCvSimilarityScore: configData.minCvSimilarityScore ?? '',
        personalizedAssessment: configData.personalizedAssessment
          ? 'true'
          : 'false',
        noPersonalizedQuestions: configData.noPersonalizedQuestions ?? '',
        personalityEvaluation: configData.personalityEvaluation
          ? 'true'
          : 'false',
        noOfEIQuestions: configData.noOfEIQuestions ?? '',
        noOfSNQuestions: configData.noOfSNQuestions ?? '',
        noOfTFQuestions: configData.noOfTFQuestions ?? '',
        noOfJPQuestions: configData.noOfJPQuestions ?? '',
        uploadedQuestions: configData.uploadedQuestions?.length
          ? configData.uploadedQuestions
          : [''],
        recruiterGuide: configData.recruiterGuide ?? '',
      }
    : null

  const savedDraft = drafts[jobId ?? '']
  const hadDraft = !isEditMode && savedDraft != null

  const initialValues: AiConfigValues = isEditMode
    ? editInitialValues ?? DEFAULT_VALUES
    : savedDraft != null
    ? ({
        ...(savedDraft as AiConfigValues),
        jobId: jobId ?? '',
      } as AiConfigValues)
    : { ...DEFAULT_VALUES, jobId: jobId ?? '' }

  const onSubmit = async (
    values: AiConfigValues,
    { setSubmitting }: FormikHelpers<AiConfigValues>,
  ) => {
    const cleanedValues: Partial<AiConfigValues> = { ...values }

    if (values.cvSimilarity === 'false') {
      delete cleanedValues.minCvSimilarityScore
    }
    if (values.personalizedAssessment === 'false') {
      delete cleanedValues.noPersonalizedQuestions
    }
    if (values.personalityEvaluation === 'false') {
      delete cleanedValues.uploadedQuestions
      delete cleanedValues.noOfEIQuestions
      delete cleanedValues.noOfSNQuestions
      delete cleanedValues.noOfTFQuestions
      delete cleanedValues.noOfJPQuestions
    } else {
      // Each dichotomy pair is independently optional — a blank count means
      // "skip this pair" and must not be sent as '' (fails backend isInt()).
      DICHOTOMY_COUNT_FIELDS.forEach((field) => {
        if (cleanedValues[field] === '' || cleanedValues[field] == null) {
          delete cleanedValues[field]
        }
      })
    }
    if (!values.recruiterGuide) {
      delete cleanedValues.recruiterGuide
    }

    const payload = {
      ...cleanedValues,
      prescreeningAssessment: cleanedValues.prescreeningAssessment === 'true',
      cvSimilarity: cleanedValues.cvSimilarity === 'true',
      personalizedAssessment: cleanedValues.personalizedAssessment === 'true',
      personalityEvaluation: cleanedValues.personalityEvaluation === 'true',
    }

    try {
      if (isEditMode) {
        await patchAiConfig({ aiConfigId, data: payload }).unwrap()
        notify('success', 'AI config updated!')
      } else {
        await aiConfigMutation(payload).unwrap()
        clearDraft(jobId ?? '')
        let published = false
        if (jobId) {
          try {
            await updateJob({ jobId, data: { status: 'active' } }).unwrap()
            published = true
          } catch {
            published = false
          }
        }
        notify(
          'success',
          published
            ? 'AI config saved and job published. Talents can now apply from the job link.'
            : 'AI config saved. Your job is still a draft — publish it from My Job Posts to make it visible to talents.',
        )
        navigate('/recruiterDashboard/myjobposts')
      }
    } catch (err) {
      const apiMessage = getErrorMessage(
        err,
        isEditMode
          ? 'Failed to update AI config.'
          : 'Failed to save AI config. Your progress has been saved — please try again.',
      )
      notify('error', apiMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Screening setup</h2>
      <p className={styles.subheading}>
        {isEditMode
          ? 'Adjust how candidates are assessed for this role. Each toggle adds or removes a stage they must complete.'
          : 'Choose how this job screens applicants. Hover the info icons to see what candidates experience at each step.'}
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={aiConfigValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {({ values, errors, setFieldValue, isSubmitting }) => (
          <Form noValidate>
            <FormikFocusOnError />
            {!isEditMode && <FormObserver saveDraft={draftSaver} />}

            {hadDraft && (
              <div className={styles.draftBanner}>Draft restored</div>
            )}

            <AiConfigFields
              values={values}
              errors={errors}
              fieldName={identity}
              setFieldValue={(key, value) => setFieldValue(key, value)}
              jobId={jobId}
              questionsByPair={questionsByPair}
              loadingPairs={loadingPairs}
              generateQuestion={generateQuestion}
              removeQuestion={removeQuestion}
            />

            <div className={styles.actions}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}>
                {isEditMode ? 'Update AI Config' : 'Save AI Config'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AiConfig
