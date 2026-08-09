import React from 'react'

import { Avatar } from '@/components/ui/Avatar'
import { useProfile } from '@/features/profile/hooks/useProfile'

import styles from './ProfilePic.module.scss'

const ProfilePic: React.FC = () => {
  const { profile } = useProfile()

  return (
    <div className={styles.container}>
      <Avatar
        firstName={profile?.firstName}
        lastName={profile?.lastName}
        size="lg"
        className={styles.avatar}
      />
    </div>
  )
}

export default ProfilePic
