import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { EmailVerificationPanel } from '@/features/email-verification/components/EmailVerificationPanel'
import { useProfile } from '@/features/profile/hooks/useProfile'

import styles from './VerifyStep.module.scss'

const VerifyStep: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { mutate } = useProfile()

  const handleContinue = async () => {
    const refreshed = await mutate()
    if (refreshed?.data?.user?.emailVerifiedAt) {
      navigate(`/apply/${jobId}`, { replace: true })
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.intro}>
          Please verify your email address before continuing your application.
        </p>
        <EmailVerificationPanel redirectPath={`/apply/${jobId}`} />
        <div className={styles.continueBar}>
          <Button onClick={() => void handleContinue()}>
            I&apos;ve verified — Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VerifyStep
