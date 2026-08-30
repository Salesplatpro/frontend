import { FormikProps } from 'formik'
import React, { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { usePreAssessment } from '@/features/pre-assessment/hooks'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { ProfileFormValues } from '@/features/profile/types'
import TalentProfile from '@/pages/TalentProfile/Profile'
import { notify } from '@/utils/toastNotifications'

import styles from './ProfileStep.module.scss'

const INCOMPLETE_TOAST =
  'Complete your profile to continue. Include bio, role, CV, work type, location, experience, and min/max salary.'

const ProfileStep: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { refetch } = usePreAssessment()
  const { mutate } = useProfile()
  const [isChecking, setIsChecking] = useState(false)
  const formikRef = useRef<FormikProps<ProfileFormValues>>(null)

  const handleContinue = async () => {
    setIsChecking(true)
    try {
      const form = formikRef.current
      if (form) {
        const errors = await form.validateForm()
        if (Object.keys(errors).length > 0) {
          try {
            await form.submitForm()
          } catch {
            // Formik rejects when validation fails; fields are marked touched.
          }
          notify('info', INCOMPLETE_TOAST, { autoClose: 4000 })
          return
        }
        await form.submitForm()
      }

      const refreshed = await mutate()
      const completion = refreshed?.data?.user?.profileCompletion
      if (completion && !completion.isProfileComplete) {
        notify('info', INCOMPLETE_TOAST, { autoClose: 4000 })
        return
      }

      const stillIncomplete = await refetch()
      if (stillIncomplete) {
        notify('info', INCOMPLETE_TOAST, { autoClose: 4000 })
        return
      }

      navigate(`/apply/${jobId}/prescreen`, { replace: true })
    } catch (error) {
      if (error instanceof Error && error.message === 'Profile update failed') {
        return
      }
      notify('info', INCOMPLETE_TOAST, { autoClose: 4000 })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className={styles.page}>
      <TalentProfile formikRef={formikRef} />
      <div className={styles.continueBar}>
        <Button onClick={() => void handleContinue()} loading={isChecking}>
          Continue
        </Button>
      </div>
    </div>
  )
}

export default ProfileStep
