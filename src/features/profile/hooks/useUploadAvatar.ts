import { useState } from 'react'
import useSWRMutation from 'swr/mutation'

import { notify } from '@/utils/toastNotifications'

import { uploadAvatar as uploadAvatarFile } from '../services/profileService'
import { useProfile } from './useProfile'

export const useUploadAvatar = () => {
  const { mutate } = useProfile()
  const [progress, setProgress] = useState<number | null>(null)

  const { trigger, isMutating } = useSWRMutation(
    '/user/avatar',
    async (_key, { arg: file }: { arg: File }) => {
      setProgress(0)

      try {
        await uploadAvatarFile(file, (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded / event.total) * 100))
          }
        })
        await mutate()
        notify('success', 'Profile picture updated', { autoClose: 2000 })
      } catch (error) {
        notify('error', 'Failed to upload profile picture', {
          autoClose: 2000,
        })
        throw error
      } finally {
        setProgress(null)
      }
    },
  )

  return { uploadAvatar: trigger, isUploading: isMutating, progress }
}
