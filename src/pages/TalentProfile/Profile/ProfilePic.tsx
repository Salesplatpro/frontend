import React from 'react'
import { Bounce } from 'react-toastify'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { useUploadProfileImage } from '@/features/profile/hooks/useUploadProfileImage'
import { getDefaultIcon } from '@/utils/getDefaultIcon'
import { notify } from '@/utils/toastNotifications'

import styles from './ProfilePic.module.scss'

interface ProfilePicProps {
  previewUrl?: string | null
  onFileSelect?: (file: File) => void
}

const ProfilePic: React.FC<ProfilePicProps> = ({
  previewUrl,
  onFileSelect,
}) => {
  const user = useAuthStore((state) => state.user)
  const { profile } = useProfile()
  const { uploadProfileImage, isUploading } = useUploadProfileImage()

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      notify('error', 'Only image files are allowed', {
        autoClose: 5000,
        transition: Bounce,
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      notify('error', 'File size exceeds the 5MB limit', {
        autoClose: 5000,
        transition: Bounce,
      })
      return
    }

    if (onFileSelect) {
      onFileSelect(file)
    } else {
      void uploadProfileImage(file)
    }

    event.target.value = ''
  }

  const profileImageSrc =
    previewUrl ||
    profile?.profileImage?.url ||
    getDefaultIcon({ id: user?.id || '', size: 50 })

  return (
    <div className={styles.container}>
      <img src={profileImageSrc} alt="Profile" className={styles.image} />
      <input
        id="profileImage"
        type="file"
        accept="image/*"
        className={styles.input}
        onChange={handleImageChange}
        disabled={isUploading}
      />
      <button
        type="button"
        className={styles.changeButton}
        onClick={() => document.getElementById('profileImage')?.click()}
        disabled={isUploading}>
        Change Image
      </button>
    </div>
  )
}

export default ProfilePic
