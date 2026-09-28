import { Form, FormikHelpers, useFormikContext } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { FormikFocusOnError } from '@/components/forms/FormikFocusOnError'
import { ValidatedForm } from '@/components/forms/ValidatedForm'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAiConfigDraftStore } from '@/features/jobs/store/useAiConfigDraftStore'
import {
  useAiConfigMutation,
  usePatchAiConfigMutation,
} from '@/redux/api/recruiter'
import { useIndividualJobQuery } from '@/redux/api/talent'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { htmlToPlainText } from '../utils/aiText'
import styles from './AiConfig.module.scss'
import { AiConfigFields } from './AiConfigFields'
import { AI_CONFIG_DEFAULT_VALUES, AiConfigFieldValues } from './aiConfigModel'
import {
  AiConfigApiRecord,
  aiConfigFromApi,
  aiConfigToPayload,
  withConfigDefaults,
} from './aiConfigPayload'
import {
  DEFAULT_PRESET_ID,
  detectPreset,
  getPreset,
  isAutoSetupName,
  ScreeningPresetId,
  setupName,
} from './aiConfigPresets'
import { aiConfigValidationSchema } from './aiConfigValidationSchema'
import { CandidateJourney } from './CandidateJourney'
import { CopySetupSelect } from './CopySetupSelect'
import { ScreeningPresets } from './ScreeningPresets'

const BASE_PATH = '/recruiterDashboard/postjob'

const FormObserver: React.FC<{ saveDraft: (v: unknown) => void }> = ({
  saveDraft,
}) => {
  const { values } = useFormikContext<AiConfigFieldValues>()
  useEffect(() => {
    saveDraft(values)
  }, [values, saveDraft])
  return null
}

const newSetup = (roleName: string): AiConfigFieldValues => {
  const preset = getPreset(DEFAULT_PRESET_ID)
  return {
    ...AI_CONFIG_DEFAULT_VALUES,
    ...preset.values,
    name: setupName(roleName, preset.title),
  }
}

const AiConfig = () => {
  const { jobId = '' } = useParams()
  const navigate = useNavigate()

  const [createAiConfig] = useAiConfigMutation()
  const [patchAiConfig] = usePatchAiConfigMutation()
  const { drafts, saveDraft, clearDraft } = useAiConfigDraftStore()
  const { data: jobData, isLoading: jobLoading } = useIndividualJobQuery(
    jobId,
    { skip: !jobId },
  )

  // Read the draft once, so clearing it after saving can't reset the form.
  const [initialDraft] = useState(() => drafts[jobId] ?? null)

  const draftSaver = useCallback(
    (values: unknown) => saveDraft(jobId, values),
    [saveDraft, jobId],
  )

  if (jobLoading) return <Spinner fullPage />

  const job = jobData?.data?.job ?? jobData?.data
  const existingConfig: (AiConfigApiRecord & { id: string }) | null = job
    ?.aiConfig?.id
    ? job.aiConfig
    : null
  const roleName: string = job?.role?.name ?? ''

  const initialValues: AiConfigFieldValues = existingConfig
    ? aiConfigFromApi(existingConfig)
    : initialDraft
    ? withConfigDefaults(initialDraft as Partial<AiConfigFieldValues>)
    : newSetup(roleName)

  const jobContext = {
    role: roleName,
    experienceLevel: job?.experienceLevel ?? '',
    jobBrief: htmlToPlainText(job?.jobBrief ?? ''),
    requirements: htmlToPlainText(job?.requirements ?? ''),
    skills: job?.skills ?? [],
    goals: job?.goals ?? [],
  }

  const onSubmit = async (
    values: AiConfigFieldValues,
    { setSubmitting }: FormikHelpers<AiConfigFieldValues>,
  ) => {
    const payload = aiConfigToPayload(values)
    try {
      if (existingConfig) {
        await patchAiConfig({
          aiConfigId: existingConfig.id,
          data: payload,
        }).unwrap()
      } else {
        await createAiConfig({ ...payload, jobId }).unwrap()
      }
      clearDraft(jobId)
      notify('success', 'Screening saved. Check everything, then publish.')
      navigate(`${BASE_PATH}/${jobId}/review`)
    } catch (err) {
      notify(
        'error',
        getErrorMessage(
          err,
          'Failed to save screening. Your progress has been saved — please try again.',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>How should applicants be screened?</h2>
      <p className={styles.subheading}>
        Start from a preset, then adjust anything. Each part adds a step
        candidates complete before they reach you.
      </p>

      <ValidatedForm
        initialValues={initialValues}
        validationSchema={aiConfigValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {({ values, errors, setFieldValue, setValues, isSubmitting }) => {
          const applyPreset = (id: ScreeningPresetId) => {
            const preset = getPreset(id)
            setValues({
              ...values,
              ...preset.values,
              name: isAutoSetupName(values.name, roleName)
                ? setupName(roleName, preset.title)
                : values.name,
            })
          }

          return (
            <Form noValidate>
              <FormikFocusOnError />
              {!existingConfig && <FormObserver saveDraft={draftSaver} />}

              {!existingConfig && initialDraft && (
                <div className={styles.draftBanner}>
                  Restored your unsaved screening setup.
                </div>
              )}

              <div className={styles.layout}>
                <div className={styles.formColumn}>
                  <ScreeningPresets
                    selected={detectPreset(values)}
                    onSelect={applyPreset}
                  />

                  <div className={styles.copyRow}>
                    <CopySetupSelect
                      excludeId={existingConfig?.id}
                      onCopy={(config) => {
                        setValues({
                          ...aiConfigFromApi(config),
                          name: values.name || config.name || '',
                        })
                        notify('success', `Copied “${config.name}”.`)
                      }}
                    />
                  </div>

                  <AiConfigFields
                    values={values}
                    errors={errors}
                    fieldName={(key) => key}
                    setFieldValue={(key, value) => setFieldValue(key, value)}
                    jobId={jobId}
                    jobContext={jobContext}
                  />
                </div>

                <div className={styles.sideColumn}>
                  <CandidateJourney values={values} />
                </div>
              </div>

              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(`${BASE_PATH}/${jobId}/details`)}>
                  Back to details
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}>
                  Save and review
                </Button>
              </div>
            </Form>
          )
        }}
      </ValidatedForm>
    </div>
  )
}

export default AiConfig
