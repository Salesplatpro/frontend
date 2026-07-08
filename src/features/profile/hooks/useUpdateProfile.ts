import { Bounce } from 'react-toastify'
import useSWRMutation from 'swr/mutation'

import { notify } from '@/utils/toastNotifications'

import { patchProfile, PROFILE_ENDPOINT } from '../services/profileService'
import { ProfilePatchPayload } from '../types'
import { useProfile } from './useProfile'

export const useUpdateProfile = () => {
  const { mutate } = useProfile()

  const { trigger, isMutating } = useSWRMutation(
    PROFILE_ENDPOINT,
    (_key, { arg }: { arg: Partial<ProfilePatchPayload> }) => patchProfile(arg),
  )

  const updateProfile = async (payload: Partial<ProfilePatchPayload>) => {
    try {
      await trigger(payload)
      await mutate()
      notify('success', 'Profile updated successfully', { autoClose: 5000 })
      return true
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Failed to update profile'
      notify('error', message, { autoClose: 5000, transition: Bounce })
      return false
    }
  }

  return { updateProfile, isUpdating: isMutating }
}
