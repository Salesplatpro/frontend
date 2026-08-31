import { useFormikContext } from 'formik'
import React from 'react'

import { ProfileFormValues } from '@/features/profile/types'

import styles from './BioTextArea.module.scss'

const BioTextArea = () => {
  const { values, errors, touched, setFieldValue, handleBlur } =
    useFormikContext<ProfileFormValues>()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    if (value.length <= 1000) {
      setFieldValue('bio', value)
    }
  }

  const hasError = Boolean(errors.bio && touched.bio)

  return (
    <>
      <textarea
        id="bio"
        name="bio"
        data-field="bio"
        value={values.bio}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Tell us about yourself"
        maxLength={1000}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? 'bio-error' : undefined}
        className={
          hasError ? `${styles.textarea} ${styles.invalid}` : styles.textarea
        }
      />
      <p className={styles.count}>{values.bio?.length || 0}/1000</p>
    </>
  )
}

export default BioTextArea
