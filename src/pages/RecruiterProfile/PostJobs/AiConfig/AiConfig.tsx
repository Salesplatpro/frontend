import { Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import React, { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAiConfigDraftStore } from '@/features/jobs/store/useAiConfigDraftStore'
import {
  useAiConfigMutation,
  useGetAiConfigQuery,
  usePatchAiConfigMutation,
} from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import styles from './AiConfig.module.scss'
import {
  AI_CONFIG_DEFAULT_VALUES,
  AiConfigFields,
  AiConfigFieldValues,
  DICHOTOMY_COUNT_FIELDS,
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

const identity = (key: keyof AiConfigFieldValues) => key

const AiConfig = ({ mode = 'create', aiConfigId }: AiConfigProps) => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const isEditMode = mode === 'edit'

  const [aiConfigMutation] = useAiConfigMutation()
  const [patchAiConfig] = usePatchAiConfigMutation()
  const { drafts, saveDraft, clearDraft } = useAiConfigDraftStore()
  const { questionsByPair, generateQuestion, loadingPairs } =
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

  const configData = existingConfig?.data?.config

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
        noOfCvSimilarCandidates: configData.noOfCvSimilarCandidates ?? '',
        personalizedAssessment: configData.personalizedAssessment
          ? 'true'
          : 'false',
        noPersonalizedQuestions: configData.noPersonalizedQuestions ?? '',
        personalityEvaluation: configData.personalityEvaluation
          ? 'true'
          : 'false',
        noOfEIQuestions: configData.noOfEIQuestions ?? 3,
        noOfSNQuestions: configData.noOfSNQuestions ?? 3,
        noOfTFQuestions: configData.noOfTFQuestions ?? 3,
        noOfJPQuestions: configData.noOfJPQuestions ?? 3,
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

    if (values.prescreeningAssessment === 'false') {
      delete cleanedValues.minPrescreeningScore
    }
    if (values.cvSimilarity === 'false') {
      delete cleanedValues.minCvSimilarityScore
      delete cleanedValues.noOfCvSimilarCandidates
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
        notify(
          'success',
          'AI config saved. Your job is still a draft — publish it from My Job Posts to make it visible to talents.',
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
      <h2 className={styles.heading}>AI Configs</h2>
      <p className={styles.subheading}>
        {isEditMode ? 'Edit your configurations' : 'Select your configurations'}
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={aiConfigValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {({ values, errors, setFieldValue, isSubmitting }) => (
          <Form>
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
