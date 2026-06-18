import { Field, Form, Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import { FaClipboardList } from 'react-icons/fa6'

import {
  WorkType,
  WorkTypeCheckboxes,
} from '@/components/features/jobs/WorkTypeCheckboxes'
import {
  EMPTY_LOCATION,
  LocationSelect,
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
import { FormValues } from '@/utils/jobPostTypes'

import { ParsedJD } from './parseJobDescription'
import PasteJDModal from './PasteJDModal'
import styles from './PostJob.module.scss'
import { validationSchema } from './validationSchema'

type PostJobFormValues = Omit<FormValues, 'workMode'> & { workMode: WorkType[] }

const PostJob: React.FC = () => {
  const [isJDModalOpen, setIsJDModalOpen] = useState(false)
  const [extraFields, setExtraFields] = useState<
    Array<{ label: string; value: string }>
  >([])

  const initialValues: PostJobFormValues = {
    jobBrief: '',
    role: '',
    requirements: '',
    minSalary: '',
    maxSalary: '',
    currency: '',
    workMode: [],
    experienceLevel: '',
    location: { ...EMPTY_LOCATION },
    skills: [],
    goals: [],
  }

  const onSubmit = (
    values: PostJobFormValues,
    { setSubmitting }: FormikHelpers<PostJobFormValues>,
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
    console.log('Job post payload:', payload)
    setSubmitting(false)
  }

  const handleJDApply = (
    parsed: ParsedJD,
    setFieldValue: FormikHelpers<PostJobFormValues>['setFieldValue'],
  ) => {
    Object.entries(parsed.formValues).forEach(([key, value]) => {
      if (value !== undefined) {
        setFieldValue(key, value)
      }
    })
    if (parsed.extraFields.length > 0) {
      setExtraFields(parsed.extraFields)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h2 className={styles.pageHeading}>Job details</h2>
          <p className={styles.pageSubheading}>Tell us about your job</p>
        </div>
        <button
          type="button"
          className={styles.pasteJDTrigger}
          onClick={() => setIsJDModalOpen(true)}
          aria-label="Paste job description to auto-fill form">
          <FaClipboardList />
          Paste job description
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {({ values, isSubmitting, setFieldValue, errors, touched }) => (
          <>
            <PasteJDModal
              open={isJDModalOpen}
              onClose={() => setIsJDModalOpen(false)}
              onApply={(parsed) => handleJDApply(parsed, setFieldValue)}
            />

            <Form>
              {/* Section 1: Job Overview */}
              <section className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Job Overview</h3>

                <div className={styles.fieldGroup}>
                  <RoleSelect
                    label="Role"
                    required
                    name="role"
                    value={values.role}
                    onChange={(value) => setFieldValue('role', value)}
                    creatable
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
                    onChange={(value) =>
                      setFieldValue('experienceLevel', value)
                    }
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
                  {/* Currency — label rendered manually so spacing is identical to Min/Max */}
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

              {/* Section 6: Additional Details (auto-created from parsed JD) */}
              {extraFields.length > 0 && (
                <section className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Additional Details</h3>
                  <p className={styles.sectionNote}>
                    Extracted from your pasted job description
                  </p>
                  <div className={styles.extraFieldsGrid}>
                    {extraFields.map(({ label, value }) => (
                      <div key={label} className={styles.extraField}>
                        <span className={styles.extraLabel}>{label}</span>
                        <span className={styles.extraValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className={styles.actions}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}>
                  Submit Job
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  )
}

export default PostJob
