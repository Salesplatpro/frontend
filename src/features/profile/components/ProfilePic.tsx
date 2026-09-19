import React from 'react'
import { FaCamera, FaTimes } from 'react-icons/fa'

import { Avatar } from '@/components/ui/Avatar'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { useRemoveAvatar } from '@/features/profile/hooks/useRemoveAvatar'
import { useUploadAvatar } from '@/features/profile/hooks/useUploadAvatar'

import styles from './ProfilePic.module.scss'

const ProfilePic: React.FC = () => {
  const { profile } = useProfile()
  const { uploadAvatar, isUploading } = useUploadAvatar()
  const { removeAvatar, isRemoving } = useRemoveAvatar()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (file) void uploadAvatar(file)
    event.target.value = ''
  }

  return (
    <div className={styles.container}>
      <div className={styles.avatarWrapper}>
        <Avatar
          firstName={profile?.firstName}
          lastName={profile?.lastName}
          src={profile?.profileImageUrl}
          size="lg"
          className={styles.avatar}
        />
        <label
          htmlFor="avatar"
          className={styles.editButton}
          aria-label="Change profile picture">
          <FaCamera size={12} />
        </label>
        <input
          id="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={styles.fileInput}
          disabled={isUploading}
          onChange={handleChange}
        />
        {profile?.profileImageUrl && (
          <button
            type="button"
            className={styles.removeButton}
            aria-label="Remove profile picture"
            disabled={isRemoving}
            onClick={() => void removeAvatar()}>
            <FaTimes size={10} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfilePic
