import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { usePreAssessment } from '@/features/pre-assessment/hooks'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { notify } from '@/utils/toastNotifications'

const ApplyWizardEntry: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const { profile, isLoading: isProfileLoading } = useProfile()
  const { assessment, isLoading, isProfileIncomplete } = usePreAssessment()

  useEffect(() => {
    if (!jobId) return

    if (!token) {
      navigate('signup', { replace: true })
      return
    }

    if (user?.userRole !== 'talent') {
      notify('error', 'Only talent accounts can apply to jobs', {
        autoClose: 2000,
      })
      navigate(`/job/postedjob/${jobId}`, { replace: true })
      return
    }

    if (isProfileLoading) return

    if (!profile?.emailVerifiedAt) {
      navigate('verify', { replace: true })
      return
    }

    if (isLoading) return

    if (isProfileIncomplete) {
      navigate('profile', { replace: true })
      return
    }

    if (assessment?.status !== 'completed') {
      navigate('prescreen', { replace: true })
      return
    }

    navigate('details', { replace: true })
  }, [
    jobId,
    token,
    user,
    isProfileLoading,
    profile?.emailVerifiedAt,
    isLoading,
    isProfileIncomplete,
    assessment?.status,
    navigate,
  ])

  return <Spinner fullPage />
}

export default ApplyWizardEntry
