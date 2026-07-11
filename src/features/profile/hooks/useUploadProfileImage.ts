import { Bounce } from 'react-toastify'
import useSWRMutation from 'swr/mutation'

import { notify } from '@/utils/toastNotifications'

import { patchProfile, uploadFile } from '../services/profileService'
import { useProfileStore } from '../store/useProfileStore'
import { useProfile } from './useProfile'

export const useUploadProfileImage = () => {
  const { mutate } = useProfile()

  const { trigger, isMutating } = useSWRMutation(
    '/user/me/picture',
    async (_key, { arg: file }: { arg: File }) => {
      const previousImage = useProfileStore.getState().profile?.profileImageUrl
      const previewUrl = URL.createObjectURL(file)
      useProfileStore.getState().patchProfile({ profileImageUrl: previewUrl })

      try {
        const uploaded = await uploadFile(file)
        await patchProfile({ picture: uploaded.data?.fileUrl })
        await mutate()
        notify('success', 'Profile picture updated successfully', {
          autoClose: 5000,
        })
      } catch (error) {
        useProfileStore
          .getState()
          .patchProfile({ profileImageUrl: previousImage })
        notify('error', 'Failed to update profile picture', {
          autoClose: 5000,
          transition: Bounce,
        })
        throw error
      }
    },
  )

  return { uploadProfileImage: trigger, isUploading: isMutating }
}
