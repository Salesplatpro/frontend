import React from 'react'

import { ProfileUser } from '@/features/profile/types'
import { capitalizeEachWord } from '@/utils/CapitalizeWord'
import ProgressBar from '@/utils/ProgressBar'

import styles from './ProfileHeader.module.scss'
import ProfilePic from './ProfilePic'

interface ProfileHeaderProps {
  profile: ProfileUser | null
  progress: number
  picturePreview?: string | null
  onPictureSelect?: (file: File) => void
}

const TalentProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  progress,
  picturePreview,
  onPictureSelect,
}) => {
  return (
    <div>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Edit Talent Profile</h2>
        <ProgressBar
          percentage={progress}
          textColor="#344054"
          pathColor="#3C6FD4"
          trailColor="#F4EBFF"
          size={70}
        />
      </div>
      <div className={styles.card}>
        <ProfilePic
          previewUrl={picturePreview}
          onFileSelect={onPictureSelect}
        />
        <div className={styles.info}>
          <p className={styles.name}>
            {`${profile?.firstName || ''} ${profile?.lastName || ''}`}
          </p>
          <p className={styles.role}>{capitalizeEachWord(profile?.userRole)}</p>
        </div>
      </div>
    </div>
  )
}

export default TalentProfileHeader
