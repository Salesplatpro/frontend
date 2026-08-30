import { Alert } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { useEffect } from 'react'

import { WorkTypeCheckboxes } from '@/components/features/jobs/WorkTypeCheckboxes'
import { LocationSelect } from '@/components/forms/LocationSelect'
import { RoleMultiSelect } from '@/components/forms/Roles/RoleMultiSelect'
import {
  COMPENSATION_PERIOD_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  PROFILE_CURRENCY_OPTIONS,
  Select,
} from '@/components/forms/Select'
import { Button } from '@/components/ui/Button'
import { CvFile } from '@/components/ui/CvFile'
import { Spinner } from '@/components/ui/Spinner'

import BioTextArea from './BioTextArea'
import styles from './Profile.module.scss'
import TalentProfileHeader from './ProfileHeader'
import { validationSchema } from './ProileValidationSchema'
import UploadCV from './UploadCV'
import { useProfileForm } from './useProfileForm'

const TalentProfile = () => {
  const {
    profile,
    isLoading,
    error,
    isUpdating,
    isUploading,
    progress,
    cvFileName,
    formProgress,
    initialValues,
    updateFormProgress,
    handleSubmit,
    handleCvChange,
  } = useProfileForm()

  if (isLoading) return <Spinner fullPage />

  if (error) {
    return <Alert severity="error">Error fetching user profile info</Alert>
  }

  return (
    <div className={styles.page}>
      <TalentProfileHeader profile={profile} progress={formProgress} />

      <div className={styles.formCard}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize>
          {({
            values,
            errors,
            touched,
            dirty,
            isSubmitting,
            setFieldValue,
          }) => {
            useEffect(() => {
              updateFormProgress(values)
            }, [values])

            return (
              <Form>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="bio">
                    Bio
                  </label>
                  <BioTextArea />
                  {errors.bio && touched.bio && (
                    <div className={styles.errorText}>{errors.bio}</div>
                  )}
                </div>

                <div className={`${styles.row} ${styles.rowLarge}`}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      readOnly
                      value={`${profile?.firstName || ''} ${
                        profile?.lastName || ''
                      }`}
                      className={styles.readonlyInput}
                    />
                  </div>
                  <div className={styles.field}>
                    <div className={styles.labelRow}>
                      <span className={styles.label}>Role</span>
                      {profile?.roleChangeCount !== undefined && (
                        <span className={styles.roleChangeHint}>
                          {profile.roleChangeCount}/3 changes left
                        </span>
                      )}
                    </div>
                    <RoleMultiSelect
                      name="role"
                      value={values.role}
                      onChange={(value) => setFieldValue('role', value)}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <Select
                      label="Experience Level"
                      options={EXPERIENCE_LEVEL_OPTIONS}
                      value={values.experience}
                      onChange={(value) => setFieldValue('experience', value)}
                      placeholder="Select experience level"
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.fullField}>
                    <div className={styles.label}>Work Type</div>
                    <WorkTypeCheckboxes
                      value={values.workType}
                      onChange={(value) => setFieldValue('workType', value)}
                      error={
                        touched.workType && typeof errors.workType === 'string'
                          ? errors.workType
                          : undefined
                      }
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.fullField}>
                    <LocationSelect
                      value={values.location}
                      onChange={(location) =>
                        setFieldValue('location', location)
                      }
                      stateLabel="State/Province (Optional)"
                      cityLabel="Region/City (Optional)"
                      countryRequired
                      errors={{
                        country:
                          touched.location?.country &&
                          typeof errors.location?.country?.name === 'string'
                            ? errors.location.country.name
                            : undefined,
                      }}
                    />
                  </div>
                </div>

                <div className={`${styles.row} ${styles.salaryRow}`}>
                  <div className={styles.salaryField}>
                    <Select
                      label="Currency"
                      options={PROFILE_CURRENCY_OPTIONS}
                      value={values.currency}
                      onChange={(value) => setFieldValue('currency', value)}
                      placeholder="Select currency"
                    />
                  </div>
                  <div className={styles.salaryField}>
                    <label className={styles.label} htmlFor="minSalary">
                      Min Salary
                    </label>
                    <Field
                      type="text"
                      id="minSalary"
                      name="minSalary"
                      placeholder="Your minimum salary"
                      className={styles.input}
                    />
                    {errors.minSalary && touched.minSalary && (
                      <div className={styles.errorText}>{errors.minSalary}</div>
                    )}
                  </div>
                  <div className={styles.salaryField}>
                    <label className={styles.label} htmlFor="maxSalary">
                      Max Salary
                    </label>
                    <Field
                      type="text"
                      id="maxSalary"
                      name="maxSalary"
                      placeholder="Your maximum salary"
                      className={styles.input}
                    />
                    {errors.maxSalary && touched.maxSalary && (
                      <div className={styles.errorText}>{errors.maxSalary}</div>
                    )}
                  </div>
                  <div className={styles.salaryField}>
                    <Select
                      label="Compensation Period"
                      options={COMPENSATION_PERIOD_OPTIONS}
                      value={values.compensationPeriod}
                      onChange={(value) =>
                        setFieldValue('compensationPeriod', value)
                      }
                      placeholder="Select period"
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.fullField}>
                    <label className={styles.label} htmlFor="cv">
                      {profile?.cvFileName || profile?.cvUploadedAt
                        ? 'CV / Resume'
                        : 'Upload CV'}
                    </label>
                    <p className={styles.hint}>
                      We extract the text from your PDF or DOCX and store it
                      securely. Recruiters view a generated CV — the original
                      file is not kept.
                    </p>
                    <input
                      id="cv"
                      type="file"
                      accept=".pdf,.docx"
                      className={styles.fileInput}
                      disabled={isUploading}
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0]
                        if (file) handleCvChange(file)
                        event.target.value = ''
                      }}
                    />
                    {(profile?.cvFileName || profile?.cvUploadedAt) &&
                    !isUploading ? (
                      <CvFile
                        fileName={profile.cvFileName || 'CV'}
                        replaceInputId="cv"
                      />
                    ) : (
                      <label htmlFor="cv" className={styles.fileInputWrapper}>
                        <UploadCV
                          fileName={isUploading ? cvFileName : null}
                          progress={progress}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className={styles.actions}>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!dirty || isSubmitting || isUpdating}
                    loading={isSubmitting || isUpdating}>
                    Save
                  </Button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default TalentProfile
