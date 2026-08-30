import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { usePreAssessment } from '@/features/pre-assessment/hooks'
import { useProfile } from '@/features/profile/hooks/useProfile'
import TalentProfile from '@/pages/TalentProfile/Profile'
import { notify } from '@/utils/toastNotifications'

import styles from './ProfileStep.module.scss'

const ProfileStep: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { refetch } = usePreAssessment()
  const { mutate } = useProfile()
  const [isChecking, setIsChecking] = useState(false)

  const handleContinue = async () => {
    setIsChecking(true)
    const refreshed = await mutate()
    const completion = refreshed?.data?.user?.profileCompletion
    if (completion && !completion.isProfileComplete) {
      setIsChecking(false)
      notify(
        'info',
        'Complete your profile to continue. Include bio, role, CV, work type, location, experience, and min/max salary.',
        {
          autoClose: 4000,
        },
      )
      return
    }

    const stillIncomplete = await refetch()
    setIsChecking(false)

    if (stillIncomplete) {
      notify(
        'info',
        'Complete your profile to continue. Include bio, role, CV, work type, location, experience, and min/max salary.',
        {
          autoClose: 4000,
        },
      )
      return
    }

    navigate(`/apply/${jobId}/prescreen`, { replace: true })
  }

  return (
    <div className={styles.page}>
      <TalentProfile />
      <div className={styles.continueBar}>
        <Button onClick={() => void handleContinue()} loading={isChecking}>
          Continue
        </Button>
      </div>
    </div>
  )
}

export default ProfileStep
