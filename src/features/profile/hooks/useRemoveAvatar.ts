import useSWRMutation from 'swr/mutation'

import { notify } from '@/utils/toastNotifications'

import { removeAvatar as removeAvatarFile } from '../services/profileService'
import { useProfile } from './useProfile'

export const useRemoveAvatar = () => {
  const { mutate } = useProfile()

  const { trigger, isMutating } = useSWRMutation(
    '/user/avatar/remove',
    async () => {
      try {
        await removeAvatarFile()
        await mutate()
        notify('success', 'Profile picture removed', { autoClose: 2000 })
      } catch (error) {
        notify('error', 'Failed to remove profile picture', {
          autoClose: 2000,
        })
        throw error
      }
    },
  )

  return { removeAvatar: trigger, isRemoving: isMutating }
}
