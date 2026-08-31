import { Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EMPTY_LOCATION } from '@/components/forms/LocationSelect'
import { Button } from '@/components/ui/Button'
import { useJobDraftStore } from '@/features/jobs/store/useJobDraftStore'
import {
  useGenerateJobContentMutation,
  useJobPostCreationMutation,
} from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { locationFieldsFromWorkMode } from '@/utils/jobLocationPayload'
import { PostJobFormValues } from '@/utils/jobPostTypes'
import { notify } from '@/utils/toastNotifications'

import { JobDetailsFields } from './JobDetailsFields'
import styles from './PostJob.module.scss'
import { validationSchema } from './validationSchema'

const DEFAULT_VALUES: PostJobFormValues = {
  jobBrief: '',
  role: '',
  requirements: '',
  minSalary: '',
  maxSalary: '',
  compensationPeriod: '',
  currency: '',
  workMode: [],
  experienceLevel: '',
  location: { ...EMPTY_LOCATION },
  skills: [],
  goals: [],
}

// Syncs Formik values into the draft store on every change.
const FormObserver: React.FC<{ saveDraft: (v: PostJobFormValues) => void }> = ({
  saveDraft,
}) => {
  const { values } = useFormikContext<PostJobFormValues>()
  useEffect(() => {
    saveDraft(values)
  }, [values, saveDraft])
  return null
}

const PostJob: React.FC = () => {
  const navigate = useNavigate()
  const [jobPostCreation, { isLoading: isSubmitting }] =
    useJobPostCreationMutation()
  const [generateJobContent, { isLoading: isGeneratingWithAI }] =
    useGenerateJobContentMutation()
  const { draft, saveDraft, clearDraft } = useJobDraftStore()

  // Capture once whether a draft existed at mount, so the restored-draft
  // notice doesn't flicker on/off as the user edits the form.
  const [hadDraft] = useState(() => draft != null)

  const initialValues: PostJobFormValues = draft ?? DEFAULT_VALUES

  const onSubmit = async (
    values: PostJobFormValues,
    { setSubmitting }: FormikHelpers<PostJobFormValues>,
  ) => {
    const { location, maxSalary, workMode, ...rest } = values
    const payload = {
      ...rest,
      workMode,
      ...(maxSalary ? { maxSalary } : {}),
      ...locationFieldsFromWorkMode(location, workMode),
    }

    try {
      const response = await jobPostCreation(payload).unwrap()
      const jobId: string = response?.data?.job?.id

      if (!jobId) {
        notify(
          'error',
          'Job was created but no ID was returned. Please check My Job Posts and add an AI Config from there.',
        )
        return
      }

      clearDraft()
      notify('success', 'Job saved as a draft. Add your AI settings next.')
      navigate(`/recruiterDashboard/postjob/${jobId}`)
    } catch (err) {
      const apiMessage = getErrorMessage(
        err,
        'Failed to post job. Your progress has been saved — please try again.',
      )
      notify('error', apiMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGenerateWithAI = async (
    values: PostJobFormValues,
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

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h2 className={styles.pageHeading}>Tell candidates about the role</h2>
          <p className={styles.pageSubheading}>
            A clear brief and requirements help the right people apply — and
            give AI better material to screen them.
          </p>
        </div>
      </div>

      {hadDraft && (
        <div className={styles.draftNotice}>
          Restored your unsaved draft from last time.
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <FormObserver saveDraft={saveDraft} />

            <JobDetailsFields
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={(key, value) => setFieldValue(key, value)}
              onGenerateWithAI={() =>
                handleGenerateWithAI(values, setFieldValue)
              }
              isGeneratingWithAI={isGeneratingWithAI}
            />

            <div className={styles.actions}>
              <p className={styles.autosaveHint}>
                Your progress is saved automatically as you go.
              </p>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}>
                Submit job details
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PostJob
