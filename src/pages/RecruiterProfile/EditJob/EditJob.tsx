import { Field, Form, Formik, FormikHelpers } from 'formik'
import React from 'react'

import {
  WorkType,
  WorkTypeCheckboxes,
} from '@/components/features/jobs/WorkTypeCheckboxes'
import {
  EMPTY_LOCATION,
  LocationSelect,
  resolveLocationFromNames,
} from '@/components/forms/LocationSelect'
import { RoleSelect } from '@/components/forms/Roles/RoleSelect'
import {
  CURRENCY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  Select,
} from '@/components/forms/Select'
import { TagInput } from '@/components/forms/TagInput/TagInput'
import TextField from '@/components/forms/TextField'
import { Button } from '@/components/ui/Button'
import { useUpdateJobMutation } from '@/redux/api/recruiter'
import { EditJobType } from '@/utils'
import { capitalizeEachWord } from '@/utils/CapitalizeWord'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { FormValues } from '@/utils/jobPostTypes'
import { notify } from '@/utils/toastNotifications'

import styles from '../PostJobs/PostJob.module.scss'
import { validationSchema } from '../PostJobs/validationSchema'

type EditJobFormValues = Omit<FormValues, 'workMode'> & { workMode: WorkType[] }

type Props = {
  jobToEdit: EditJobType | null
  jobId?: string
}

export const EditJob = ({ jobToEdit, jobId }: Props) => {
  const [updateJob] = useUpdateJobMutation()

  const rawWorkMode = jobToEdit?.workMode
  const workMode: WorkType[] = Array.isArray(rawWorkMode)
    ? (rawWorkMode as WorkType[])
    : rawWorkMode
    ? [rawWorkMode as WorkType]
    : []

  const initialValues: EditJobFormValues = {
    jobBrief: jobToEdit?.jobBrief || '',
    role: jobToEdit?.role?.id || '',
    requirements: jobToEdit?.requirements || '',
    minSalary: String(jobToEdit?.minSalary ?? ''),
    maxSalary: String(jobToEdit?.maxSalary ?? ''),
    currency: jobToEdit?.currency || '',
    workMode,
    experienceLevel: jobToEdit?.experienceLevel || '',
    location: resolveLocationFromNames(
      jobToEdit?.location?.country,
      jobToEdit?.location?.state,
      jobToEdit?.location?.city,
    ) ?? { ...EMPTY_LOCATION },
    skills: jobToEdit?.skills || [],
    goals: jobToEdit?.goals || [],
  }

  const onSubmit = async (
    values: EditJobFormValues,
    { setSubmitting }: FormikHelpers<EditJobFormValues>,
  ) => {
    const payload = {
      ...values,
      location: {
        country: values.location.country.name,
        state: values.location.state.name,
        ...(values.location.city.name
          ? { city: values.location.city.name }
          : {}),
      },
    }

    try {
      await updateJob({ jobId, data: payload }).unwrap()
      notify('success', 'Job updated successfully')
    } catch (err) {
      const apiMessage = getErrorMessage(err, 'Failed to update job')
      notify('error', apiMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h2 className={styles.pageHeading}>
            Edit {capitalizeEachWord(jobToEdit?.role?.name)} Job
          </h2>
          <p className={styles.pageSubheading}>Update your job details</p>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {({ values, setFieldValue, errors, touched, isSubmitting }) => (
          <Form>
            {/* Section 1: Job Overview */}
            <section className={styles.formSection}>
              <div className={styles.fieldGroup}>
                <RoleSelect
                  label="Role"
                  required
                  name="role"
                  value={values.role}
                  onChange={(value) => setFieldValue('role', value)}
                  disabled
                  error={
                    touched.role && typeof errors.role === 'string'
                      ? errors.role
                      : undefined
                  }
                />
              </div>

              <div className={styles.fieldGroup}>
                <TextField
                  label="Job Brief"
                  asterick
                  name="jobBrief"
                  placeholder="Describe the role in up to 600 words"
                  type="textarea"
                  MAX_WORDS={600}
                />
              </div>
            </section>

            {/* Section 2: Requirements */}
            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Requirements</h3>

              <div className={styles.fieldGroup}>
                <TextField
                  label="Job Requirements"
                  asterick
                  name="requirements"
                  placeholder="List the qualifications and skills needed"
                  type="textarea"
                />
              </div>

              <div className={styles.fieldGroup}>
                <Select
                  label="Experience Level"
                  required
                  options={EXPERIENCE_LEVEL_OPTIONS}
                  value={values.experienceLevel}
                  onChange={(value) => setFieldValue('experienceLevel', value)}
                  placeholder="Select experience level"
                  error={
                    touched.experienceLevel &&
                    typeof errors.experienceLevel === 'string'
                      ? errors.experienceLevel
                      : undefined
                  }
                />
              </div>
            </section>

            {/* Section 3: Location & Work */}
            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Location &amp; Work</h3>

              <div className={styles.fieldGroup}>
                <LocationSelect
                  value={values.location}
                  onChange={(location) => setFieldValue('location', location)}
                  cityLabel="Region / City (Optional)"
                  countryRequired
                  stateRequired
                  errors={{
                    country:
                      touched.location?.country &&
                      typeof errors.location?.country?.name === 'string'
                        ? errors.location.country.name
                        : undefined,
                    state:
                      touched.location?.state &&
                      typeof errors.location?.state?.name === 'string'
                        ? errors.location.state.name
                        : undefined,
                  }}
                />
              </div>

              <div className={styles.fieldGroup}>
                <p className={styles.label}>
                  Work Mode<span className={styles.required}>*</span>
                </p>
                <WorkTypeCheckboxes
                  value={values.workMode}
                  onChange={(value) => setFieldValue('workMode', value)}
                  error={
                    touched.workMode && typeof errors.workMode === 'string'
                      ? errors.workMode
                      : undefined
                  }
                />
              </div>
            </section>

            {/* Section 4: Compensation */}
            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Compensation</h3>

              <div className={styles.compensationRow}>
                <div className={styles.compensationFieldThird}>
                  <label className={styles.label} htmlFor="currency-trigger">
                    Currency<span className={styles.required}>*</span>
                  </label>
                  <Select
                    options={CURRENCY_OPTIONS}
                    value={values.currency}
                    onChange={(value) => setFieldValue('currency', value)}
                    placeholder="Select currency"
                  />
                  {touched.currency && errors.currency && (
                    <div className={styles.errorText}>
                      {errors.currency as string}
                    </div>
                  )}
                </div>

                <div className={styles.compensationFieldThird}>
                  <label className={styles.label} htmlFor="minSalary">
                    Min Salary<span className={styles.required}>*</span>
                  </label>
                  <Field
                    id="minSalary"
                    name="minSalary"
                    type="text"
                    placeholder="e.g. 300000"
                    className={styles.input}
                  />
                  {touched.minSalary && errors.minSalary && (
                    <div className={styles.errorText}>
                      {errors.minSalary as string}
                    </div>
                  )}
                </div>

                <div className={styles.compensationFieldThird}>
                  <label className={styles.label} htmlFor="maxSalary">
                    Max Salary<span className={styles.required}>*</span>
                  </label>
                  <Field
                    id="maxSalary"
                    name="maxSalary"
                    type="text"
                    placeholder="e.g. 600000"
                    className={styles.input}
                  />
                  {touched.maxSalary && errors.maxSalary && (
                    <div className={styles.errorText}>
                      {errors.maxSalary as string}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Section 5: Goals & Skills */}
            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Goals &amp; Skills</h3>

              <div className={styles.fieldGroup}>
                <TagInput
                  label="Required Skills"
                  required
                  value={values.skills}
                  onChange={(tags) => setFieldValue('skills', tags)}
                  placeholder="Type a skill and press Enter"
                  maxLength={250}
                  error={
                    touched.skills && typeof errors.skills === 'string'
                      ? errors.skills
                      : undefined
                  }
                />
              </div>

              <div className={styles.fieldGroup}>
                <TagInput
                  label="Top Goals"
                  required
                  value={values.goals}
                  onChange={(tags) => setFieldValue('goals', tags)}
                  placeholder="Type a goal and press Enter"
                  maxLength={250}
                  error={
                    touched.goals && typeof errors.goals === 'string'
                      ? errors.goals
                      : undefined
                  }
                />
              </div>
            </section>

            <div className={styles.actions}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}>
                Update Job
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
