import { Alert } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import React, { useEffect, useState } from 'react'
import { Bounce } from 'react-toastify'

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
import { useProfile } from '@/features/profile/hooks/useProfile'
import { buildProfileFormValues } from '@/features/profile/hooks/useProfileFormValues'
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile'
import { useUploadCv } from '@/features/profile/hooks/useUploadCv'
import { uploadFile } from '@/features/profile/services/profileService'
import { ProfileFormValues } from '@/features/profile/types'
import { diffProfileValues } from '@/features/profile/utils/diffProfileValues'
import { calculateProgress } from '@/utils/calculateProgress'
import { notify } from '@/utils/toastNotifications'

import BioTextArea from './BioTextArea'
import CvFile from './CvFile'
import styles from './Profile.module.scss'
import TalentProfileHeader from './ProfileHeader'
import { validationSchema } from './ProileValidationSchema'
import UploadCV from './UploadCV'

const TalentProfile = () => {
  const { profile, isLoading, error } = useProfile()
  const { updateProfile, isUpdating } = useUpdateProfile()
  const { uploadCv, isUploading, progress } = useUploadCv()
  const [cvFileName, setCvFileName] = useState<string | null>(null)
  const [formProgress, setFormProgress] = useState(0)
  const [pictureFile, setPictureFile] = useState<File | null>(null)
  const [picturePreview, setPicturePreview] = useState<string | null>(null)

  const initialValues = buildProfileFormValues(profile)

  useEffect(() => {
    if (!pictureFile) {
      setPicturePreview(null)
      return
    }

    const url = URL.createObjectURL(pictureFile)
    setPicturePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [pictureFile])

  if (isLoading) return <Spinner fullPage />

  if (error) {
    return <Alert severity="error">Error fetching user profile info</Alert>
  }

  const handleSubmit = async (
    values: ProfileFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ProfileFormValues>,
  ) => {
    console.log(values)

    const patch = diffProfileValues(initialValues, values)

    if (pictureFile) {
      try {
        const uploaded = await uploadFile(pictureFile)
        patch.picture = uploaded.data?.fileUrl
      } catch (error) {
        notify('error', 'Failed to upload profile picture', {
          autoClose: 5000,
          transition: Bounce,
        })
        setSubmitting(false)
        return
      }
    }

    if (Object.keys(patch).length > 0) {
      const success = await updateProfile(patch)
      if (success) {
        resetForm({ values })
        setPictureFile(null)
      }
    }

    setSubmitting(false)
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
              setFormProgress(
                calculateProgress(values, !!profile?.profile?.cv?.url),
              )
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
                    <RoleMultiSelect
                      label="Role"
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
                        if (file) {
                          setCvFileName(file.name)
                          void uploadCv(file)
                        }
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
                      (!dirty && !pictureFile) || isSubmitting || isUpdating
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
