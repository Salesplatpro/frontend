import React from 'react'

import { PageHero, pageHeroStyles } from '@/components/layout/PageHero'
import { StatusBadge } from '@/components/ui/Badge'
import { getEmailVerificationBadge } from '@/features/email-verification/utils/getEmailVerificationBadge'
import { ProfileUser } from '@/features/profile/types'
import { capitalizeEachWord } from '@/utils/CapitalizeWord'
import ProgressBar from '@/utils/ProgressBar'

import ProfilePic from './ProfilePic'

interface ProfileHeaderProps {
  profile: ProfileUser | null
  progress: number
}

const TalentProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  progress,
}) => {
  const fullName = `${profile?.firstName || ''} ${
    profile?.lastName || ''
  }`.trim()

  return (
    <PageHero
      identity={
        <div className={pageHeroStyles.avatarRing}>
          <ProfilePic />
        </div>
      }
      title={fullName || 'Talent'}
      lead={capitalizeEachWord(profile?.userRole)}
      pills={
        <StatusBadge
          {...getEmailVerificationBadge(profile?.emailVerifiedAt)}
          showDot
        />
      }
      actions={
        <ProgressBar
          percentage={progress}
          textColor="#ffffff"
          pathColor="#ffffff"
          trailColor="rgba(255,255,255,0.25)"
          size={70}
        />
      }
    />
  )
}

export default TalentProfileHeader
