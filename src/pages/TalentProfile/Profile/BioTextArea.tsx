import { useFormikContext } from 'formik'
import React from 'react'

import { ProfileFormValues } from '@/features/profile/types'

import styles from './BioTextArea.module.scss'

const BioTextArea = () => {
  const { values, setFieldValue } = useFormikContext<ProfileFormValues>()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    if (value.length <= 1000) {
      setFieldValue('bio', value)
    }
  }

  return (
    <>
      <textarea
        id="bio"
        name="bio"
        value={values.bio}
        onChange={handleChange}
        placeholder="Tell us about yourself"
        className={styles.textarea}
      />
      <p className={styles.count}>{values.bio?.length || 0}/1000</p>
    </>
  )
}

export default BioTextArea
