import { Alert } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { useEffect } from 'react'

import { WorkTypeCheckboxes } from '@/components/features/jobs/WorkTypeCheckboxes'
import { LocationSelect } from '@/components/forms/LocationSelect'
import { PhoneNumberInput } from '@/components/forms/PhoneNumberInput'
import { RoleMultiSelect } from '@/components/forms/Roles/RoleMultiSelect'
import {
  CURRENCY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  Select,
} from '@/components/forms/Select'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

import BioTextArea from './BioTextArea'
import CvFile from './CvFile'
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
    picturePreview,
    setPictureFile,
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
      <TalentProfileHeader
        profile={profile}
        progress={formProgress}
        picturePreview={picturePreview}
        onPictureSelect={setPictureFile}
      />

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
                      {profile?.profile?.roleChangeCount !== undefined && (
                        <span className={styles.roleChangeHint}>
                          {profile.profile.roleChangeCount}/3 changes left
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
                    <PhoneNumberInput name="phone" label="Phone Number" />
                  </div>
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
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.fieldThird}>
                    <Select
                      label="Currency"
                      options={CURRENCY_OPTIONS}
                      value={values.currency}
                      onChange={(value) => setFieldValue('currency', value)}
                      placeholder="Select currency"
                    />
                  </div>
                  <div className={styles.fieldThird}>
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
                  <div className={styles.fieldThird}>
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
                </div>

                <div className={styles.row}>
                  <div className={styles.fullField}>
                    <label className={styles.label} htmlFor="cv">
                      {profile?.profile?.cv?.url ? 'CV / Resume' : 'Upload CV'}
                    </label>
                    <input
                      id="cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className={styles.fileInput}
                      disabled={isUploading}
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0]
                        if (file) handleCvChange(file)
                        event.target.value = ''
                      }}
                    />
                    {profile?.profile?.cv?.url && !isUploading ? (
                      <CvFile
                        fileName={decodeURIComponent(
                          profile.profile.cv.url.split('/').pop() || 'CV',
                        )}
                        url={profile.profile.cv.url}
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
                    disabled={
                      (!dirty && !picturePreview) || isSubmitting || isUpdating
                    }
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
